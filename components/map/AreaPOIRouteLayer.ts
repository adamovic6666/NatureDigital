import { MapViewState, PickingInfo, TRANSITION_EVENTS } from "@deck.gl/core/typed";
import { FillStyleExtension } from "@deck.gl/extensions/typed";
import { GeoJsonLayer } from "@deck.gl/layers/typed";
import { ICON_MAPPING, SWR_KEYS, TYPES, URL_KEYS } from "@nature-digital/constants";
import { POI, SWRTypes, Tooltip } from "@nature-digital/types";
import { geoFillPattern } from "@nature-digital/web-styles";
import { useCallback, useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { transitionInterpolator } from ".";
import { entityFetcher } from "../../utils/fetchers";
import { mapRef } from "../../utils/fetchers/mapFetcher";
import Url from "../../utils/urlHandler";
import IconClusterLayer from "./IconCluster";

type POIEvents = Omit<PickingInfo, "object"> & { object: POI };

const AreaPOIRouteLayer = (showAreaPoiLayer: boolean) => {
  const { data } = useSWR<SWRTypes["MAP_ELEMENTS"]>(SWR_KEYS.MAP_ELEMENTS);
  const { mutate: mutateSearchState } = useSWR<SWRTypes["SEARCH_STATE"]>(SWR_KEYS.SEARCH_STATE);
  const { data: articleSliderState, mutate: m } = useSWR<SWRTypes["ARTICLE_SLIDER_STATE"]>(
    SWR_KEYS.ARTICLE_SLIDER_STATE,
  );
  const { mutate: mutateMapViewState } = useSWR<MapViewState>(SWR_KEYS.MAP_VIEW_STATE);
  const [highlightedPOI, setHighlightedPOI] = useState<POI | null>(null);
  const { mutate: setActiveList } = useSWR<SWRTypes["ACTIVE_LIST_STATE"]>(SWR_KEYS.ACTIVE_LIST_STATE);

  const handleHover = useCallback((poi: PickingInfo | POIEvents) => {
    if (poi.object) {
      const title = poi.object.properties?.title || poi.object.title;

      if (title) {
        mutate(SWR_KEYS.HOVER, { title, x: poi.x, y: poi.y } as Tooltip);
      }
    } else {
      mutate(SWR_KEYS.HOVER, null);
    }
  }, []);

  const updateMapState = initialViewState => {
    mapRef?.current?.deck?.setProps?.({
      initialViewState,
    });
    mutateMapViewState(initialViewState);
  };

  useEffect(() => {
    const storedPOI = localStorage.getItem("highlightedPOI");

    if (!storedPOI) {
      return;
    }

    const parsedPOI = JSON.parse(storedPOI);
    setHighlightedPOI(parsedPOI);
  }, []);

  const handleClick = useCallback(
    async (poi: (PickingInfo | POIEvents) & { objects: POI[] }) => {
      const url = poi.object.properties?.url || poi.object.url;

      // @ts-ignore
      const viewState = mapRef?.current?.deck?.viewState["default-view"] ?? mapRef?.current?.deck?.viewState;
      const commonViewStateProps = {
        transitionInterpolator,
        transitionInterruption: TRANSITION_EVENTS.IGNORE,
        transitionDuration: "auto",
      };

      if (url) {
        const [latitude, longitude] = poi.coordinate ?? [];
        const selectedPOI = JSON.stringify(poi.object);
        const storedPOI = localStorage.getItem("highlightedPOI");

        if (selectedPOI === storedPOI) {
          return;
        }

        setHighlightedPOI(poi.object);

        // Store the highlighted POI information in localStorage
        localStorage.setItem("highlightedPOI", JSON.stringify(poi.object));

        const initialViewState = {
          ...viewState,
          ...commonViewStateProps,
          longitude: latitude,
          latitude: longitude,
          transitionDuration: 800,
        };

        updateMapState(initialViewState);
        setActiveList(true);

        Url.changeParam([URL_KEYS.URL, url]);
        articleSliderState?.initial && m({ ...articleSliderState, initial: false });
        !articleSliderState?.initial && m({ initial: false, isLoading: true });
        mutate(SWR_KEYS.SEARCH, await entityFetcher({ url }));
        mutateSearchState({ isOpen: false, hasResults: true });
      } else {
        Url.removeParam(URL_KEYS.URL);
        m({ initial: false, isLoading: false });
        // moves the map to the clicked cluster
        if (poi.object?.cluster_id && poi.viewport?.zoom) {
          // @ts-ignore
          let nextZoom = poi.viewport.zoom + 2;

          if (typeof poi.sourceLayer?.parent?.state?.index?.getClusterExpansionZoom === "function") {
            nextZoom = poi.sourceLayer.parent.state.index.getClusterExpansionZoom(poi.object.cluster_id);
            // Add some variation to the zoom, so it's not a whole number.
            nextZoom += poi.viewport.zoom % 1;
          }

          const initialViewState = {
            ...viewState,
            ...commonViewStateProps,
            longitude: poi.objects[0].point?.x,
            latitude: poi.objects[0].point?.y,
            zoom: nextZoom,
          };

          updateMapState(initialViewState);
        }
      }

      Url.changeURL();
    },
    [articleSliderState, m, mutateSearchState, mutateMapViewState],
  );

  if (!data) return null;

  const today = new Date().getTime();
  const currentYear = new Date().getFullYear();

  const features: any = {
    type: "FeatureCollection",
    features: [],
  };

  const modifiedData = JSON.parse(JSON.stringify(data));
  const modifiedDataWithNewProp = modifiedData.map(obj => ({ ...obj, areaIcon: undefined }));

  // eslint-disable-next-line
  for (let data of modifiedDataWithNewProp) {
    const { type, point, title, url, restrictionType, geometry } = data;
    if (geometry && (type === TYPES.route || type === TYPES.area)) {
      const properties = {
        fillColor: type === TYPES.route ? [33, 150, 83, 255] : [33, 150, 83, 127],
        lineColor: [33, 150, 83],
        opacity: 1,
        getLineWidth: 20,
        restrictionType: "",
        type,
        point,
        title,
        url,
      };

      if (!restrictionType) {
        data.areaIcon = data.type;
      }

      if (restrictionType) {
        let activeType = "";
        // calculates the restrictionType used for filling the areas

        // @ts-ignore
        // eslint-disable-next-line
        for (const item of restrictionType) {
          const dateStart = Date.parse(`${currentYear}/${item?.start_date_month}/${item?.start_date_day}`);
          const dateEnd = Date.parse(`${currentYear}/${item?.end_date_month}/${item?.end_date_day}`);

          if (dateStart < today && today < dateEnd) {
            activeType = item?.type;
          }
        }

        switch (activeType) {
          case "closed":
            // #eb5757 50%
            properties.fillColor = [235, 87, 87];
            // #eb5757
            properties.lineColor = [235, 87, 87];
            properties.restrictionType = activeType;
            // eslint-disable-next-line
            data.areaIcon = "icon-closed";
            break;
          case "buffer":
            // #f2c94c 50%
            properties.fillColor = [242, 201, 76, 127];
            // #f2c94c
            properties.lineColor = [242, 201, 76];
            // eslint-disable-next-line
            data.areaIcon = "icon-buffer";
            break;
          default:
            // #219653 50%
            properties.fillColor = [33, 150, 83, 127];
            // #219653
            properties.lineColor = [33, 150, 83];
            // eslint-disable-next-line
            data.areaIcon = data.type;
        }

        properties.opacity = 0.5;
      }

      features.features.push({ type: "Feature", properties, geometry });
    }
  }

  const commonProps = {
    onHover: handleHover,
    // @ts-ignore
    onClick: handleClick,
    pickable: true,
  };

  const layers = [
    new GeoJsonLayer({
      id: "ROUTE_OUTLINE",
      data: features,
      filled: false,
      getLineColor: f => (f.properties?.type === TYPES.route ? [0, 0, 0] : [0, 0, 0, 0]),
      opacity: 1,
      material: false,
      lineJointRounded: true,
      lineCapRounded: true,
      getLineWidth: f => (f.properties?.type === TYPES.route ? f.properties?.getLineWidth + 2 : 0),
      lineWidthMinPixels: 2,
    }),
    // @ts-ignore
    new GeoJsonLayer({
      id: "AREA_AND_ROUTE",
      data: features,
      filled: true,
      getFillColor: f => (f.properties?.type === TYPES.area ? f.properties?.fillColor : [0, 0, 0, 0]),
      getLineColor: f =>
        f.properties?.type === TYPES.route || f.properties?.type === TYPES.area
          ? f.properties?.lineColor
          : [0, 0, 0, 0],
      opacity: 1,
      wireframe: true,
      material: false,
      lineJointRounded: true,
      lineCapRounded: true,
      getLineWidth: f => (f.properties?.type === TYPES.route ? f.properties?.getLineWidth : 5),
      lineWidthMinPixels: 2,
      fillPatternMask: true,
      fillPatternAtlas: geoFillPattern.src,
      fillPatternMapping: {
        hatch: {
          x: 0,
          y: 0,
          width: 248,
          height: 248,
          mask: true,
        },
        full: {
          x: 264,
          y: 0,
          width: 256,
          height: 256,
          mask: true,
        },
      },
      getFillPattern: f => (f.properties?.restrictionType === "closed" ? "hatch" : "full"),
      getFillPatternScale: 1,
      getFillPatternOffset: [0, 0],
      extensions: [new FillStyleExtension({ pattern: true })],
      ...commonProps,
    }),

    new IconClusterLayer({
      data: modifiedDataWithNewProp,
      // position of points on the map
      // @ts-ignore
      getPosition: (d: POI) => [d.point.x, d.point.y],
      // host/marker.png
      iconAtlas: "marker.png",
      // gets icons from png
      iconMapping: ICON_MAPPING,
      id: "POI_LAYER",
      sizeScale: 40,
      highlightedPOI,
      showAreaPoiLayer,
      ...commonProps,
    }),
  ];

  return layers;
};

export default AreaPOIRouteLayer;
