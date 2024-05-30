import { TRANSITION_EVENTS, WebMercatorViewport } from "@deck.gl/core/typed";
import { DeckGLRef } from "@deck.gl/react/typed";
import {
  API_ENDPOINTS,
  INITIAL_VIEW_STATE,
  REQUEST_SECRET,
  SWR_KEYS,
  TYPES,
  URL_KEYS,
  WEB_MAP_SETTINS,
} from "@nature-digital/constants";
import { ItemType, ObjectOfAny } from "@nature-digital/types";
import axios from "axios";
import { RefObject } from "react";
import { mutate } from "swr";
import { transitionInterpolator } from "../../components/map";
import isMobileUser from "../functions/isMobileUser";
import Url from "../urlHandler";
import entityFetcher from "./entityFetcher";
import filtersFetcher from "./filtersFetcher";

const shouldBeShownOnMap = [TYPES.bayfruhheu, TYPES.area, TYPES.route, TYPES.poi];

// eslint-disable-next-line
export let mapRef: RefObject<DeckGLRef> | undefined;
// eslint-disable-next-line
export let searchRef: RefObject<HTMLInputElement>;

export const setMapRef = (_mapRef: typeof mapRef | undefined) => (mapRef = _mapRef);
export const setSearchRef = (_searchRef: typeof searchRef) => (searchRef = _searchRef);

const cache = new Map<string, CacheType>();
const entityCache = new Map<string, ItemType>();

type EntitiesType = { [key: string]: ItemType[] };
type MapFetcherProps = {
  isInitialLoadMap?: boolean;
  withCoordinates?: boolean;
};
type CacheType = {
  data: { data: string[] };
};
type ResponseType = { data: ItemType[]; count: number };

const endpoint = (process.env.NEXT_PUBLIC_API_URL + API_ENDPOINTS.SEARCH) as string;

const mapFetcher = async (props: MapFetcherProps = {}) => {
  const { isInitialLoadMap, withCoordinates = false } = props;
  const isMap = isInitialLoadMap || !!mapRef;

  // updates the url
  // eslint-disable-next-line
  let { object, string } = Url.changeURL([
    URL_KEYS.ROW,
    URL_KEYS.URL,
    URL_KEYS.LATITUDE,
    URL_KEYS.LONGITUDE,
    // URL_KEYS.ALLOWGEO,
    // URL_KEYS.ALLOWNONGEO,
  ]);

  // @ts-ignore
  object[URL_KEYS.LIMIT] = isMobileUser() ? WEB_MAP_SETTINS.MOBILE_LIMIT : WEB_MAP_SETTINS.DESKTOP_LIMIT;
  // @ts-ignore
  object.web = true;

  // cache is disabled
  const isInCache = 0; // cache.has(endpoint + string);

  if (!isInCache) {
    mutate(SWR_KEYS.LOADING, true);
  }
  let bounds: ObjectOfAny = {};
  let allowGeoAndNonGeoContent: ObjectOfAny = {};

  if (mapRef && withCoordinates) {
    // search on map with bounds
    // @ts-ignore
    const viewState = mapRef?.current?.deck?.viewState;
    const viewport = new WebMercatorViewport(viewState["default-view"]);

    const ne = viewport.unproject([viewport.width, 0]);
    const sw = viewport.unproject([0, viewport.height]);

    bounds = {
      bottomLeftX: sw[0],
      bottomLeftY: sw[1],
      topRightX: ne[0],
      topRightY: ne[1],
    };
  }

  if (isMap) {
    allowGeoAndNonGeoContent = {
      allowGeo: true,
      allowNonGeo: true,
    };
  }

  let modifiedObject = {};
  const transformStringsToArray = obj => {
    // eslint-disable-next-line
    for (const key in obj) {
      if (typeof obj[key] === "string" && key !== URL_KEYS.SEARCH) {
        obj[key] = [obj[key]];
      }
    }
    return obj;
  };

  modifiedObject = object.filterType ? transformStringsToArray(object) : { ...object };

  // gets data from cache or requests it
  const { data } = isInCache
    ? (cache.get(endpoint + string) as CacheType)
    : await axios.post<ResponseType>(
        endpoint,
        { ...modifiedObject, ...bounds, ...allowGeoAndNonGeoContent },
        {
          headers: {
            secretkey: REQUEST_SECRET,
          },
        },
      );
  // @ts-ignore
  if (data?.count === 0 && withCoordinates && mapRef && !isInitialLoadMap) {
    // @ts-ignore
    const viewState = mapRef?.current?.deck?.viewState["default-view"] ?? {};
    const commonViewStateProps = {
      transitionInterpolator,
      transitionInterruption: TRANSITION_EVENTS.IGNORE,
      transitionDuration: "auto",
    };

    const initialViewState = {
      ...viewState,
      ...commonViewStateProps,
      longitude: INITIAL_VIEW_STATE.longitude,
      latitude: INITIAL_VIEW_STATE.latitude,
      zoom: INITIAL_VIEW_STATE.zoom,
      transitionDuration: 800,
    };

    mapRef?.current?.deck?.setProps?.({
      initialViewState,
    });
    mutate(SWR_KEYS.MAP_VIEW_STATE, initialViewState);
    mutate(SWR_KEYS.MAP_ZOOM, INITIAL_VIEW_STATE.zoom);
    mutate(SWR_KEYS.LOADING, false);
    // eslint-disable-next-line no-return-await
    return await mapFetcher({ isInitialLoadMap: true });
  }

  const entities = {
    AREA_POI_ROUTE: [],
    search: [],
  } as EntitiesType;

  // new object when for response object value is falsy
  const response = data || { data: [], count: 0 };

  // eslint-disable-next-line
  for (let entity of response?.data) {
    const isCached = typeof entity === "string";
    entity = isCached ? (entityCache.get(entity as string) as ItemType) : (entity as ItemType);

    if (isMap) {
      const entityType = shouldBeShownOnMap.includes(entity?.type);

      if (entityType && entity.point) {
        // @ts-ignore
        let newEntity: ItemType = {
          point: entity.point,
          title: entity.title,
          url: entity.url,
          icon: entity.icon,
        };

        if (entity.type !== TYPES.poi && entity.type !== TYPES.bayfruhheu) {
          const shouldGeometryParse = typeof entity.geometry === "string";
          const geometry = shouldGeometryParse ? JSON.parse(entity?.geometry || "") : entity.geometry;

          entity.geometry = geometry;

          newEntity = {
            ...newEntity,
            geometry,
            restrictionType: entity.restrictionType,
            type: entity.type,
          };
        }

        entities.AREA_POI_ROUTE.push(newEntity);
      }
    }

    entities.search.push(entity);

    // inserts ['entity'] to cache
    // if (!entityCache.has(entity._id)) {
    //   entityCache.set(entity._id, entity);
    // }
  }

  const url = Url.getParam(URL_KEYS.URL);

  if (url && isMap) {
    mutate(SWR_KEYS.SEARCH, entityFetcher({ url: url as string }));
  } else {
    mutate(SWR_KEYS.SEARCH, entities.search.map(Object));
  }

  if (isMap) {
    mutate(SWR_KEYS.MAP_ELEMENTS, entities.AREA_POI_ROUTE);
  }

  mutate(SWR_KEYS.FILTER, filtersFetcher);

  // if (!cache.has(`${endpoint}${string}`)) {
  //   cache.set(`${endpoint}${string}`, {
  //     data: { data: (data as ResponseType).data.map(({ _id }) => _id) },
  //   });
  // }

  mutate(SWR_KEYS.LOADING, false);
};

export default mapFetcher;
