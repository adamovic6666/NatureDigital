import { FlyToInterpolator, MapViewState } from "@deck.gl/core/typed";
import DeckGL, { DeckGLRef } from "@deck.gl/react/typed";
import { FULL_MAP_BOUNDS, INITIAL_VIEW_STATE, SWR_KEYS, URL_KEYS } from "@nature-digital/constants";
import { SWRTypes } from "@nature-digital/types";
import { debounce } from "lodash";
import { createRef, useCallback } from "react";
import useSWR from "swr";
import { setMapRef } from "../../utils/fetchers/mapFetcher";
import isMobileUser from "../../utils/functions/isMobileUser";
import Url from "../../utils/urlHandler";
import AreaPOIRouteLayer from "./AreaPOIRouteLayer";
import BikingHikingRoutesProps from "./BikingHikingRoutes";
import CurrentPosition from "./CurrentPosition";
import TileLayer from "./TileLayer";

export const transitionInterpolator = new FlyToInterpolator();

const Map = () => {
  const map = createRef<DeckGLRef>();
  setMapRef(map);

  const { data: mapZoom, mutate: mutateZoom } = useSWR<SWRTypes["MAP_ZOOM"]>(SWR_KEYS.MAP_ZOOM);

  const getInitialViewState = useCallback(() => {
    const longitude = Url.getParam(URL_KEYS.LONGITUDE) || INITIAL_VIEW_STATE.longitude;
    const latitude = Url.getParam(URL_KEYS.LATITUDE) || INITIAL_VIEW_STATE.latitude;
    let zoom: number;

    if (Url.getParam(URL_KEYS.LONGITUDE) && Url.getParam(URL_KEYS.LATITUDE)) {
      zoom = 14;
    } else {
      zoom = isMobileUser() ? 5.75 : INITIAL_VIEW_STATE.zoom;
    }

    return {
      ...INITIAL_VIEW_STATE,
      transitionDuration: 0,
      longitude: Number(longitude),
      latitude: Number(latitude),
      zoom,
    };
  }, []);
  const { data: initialViewState } = useSWR<MapViewState>(SWR_KEYS.MAP_VIEW_STATE, getInitialViewState, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  // Declare a debounced version of the mutateZoom function
  const debouncedMutateZoom = debounce(mutateZoom, 400);

  const handleViewStateChange = useCallback(
    ({ viewState }) => {
      debouncedMutateZoom(Math.round(viewState?.zoom));

      viewState.longitude = Math.min(FULL_MAP_BOUNDS.tX, Math.max(FULL_MAP_BOUNDS.bX, viewState.longitude));
      viewState.latitude = Math.min(FULL_MAP_BOUNDS.tY, Math.max(FULL_MAP_BOUNDS.bY, viewState.latitude));

      return viewState;
    },
    [debouncedMutateZoom],
  );

  const initialState =
    Url.getParam(URL_KEYS.LONGITUDE) && Url.getParam(URL_KEYS.LATITUDE)
      ? getInitialViewState()
      : initialViewState || getInitialViewState();

  return (
    <DeckGL
      layers={[
        TileLayer(),
        AreaPOIRouteLayer(mapZoom ? mapZoom < 11 : true),
        BikingHikingRoutesProps({ type: "biking" }),
        BikingHikingRoutesProps({ type: "hiking" }),
        CurrentPosition(),
      ]}
      initialViewState={initialState}
      ref={map}
      onViewStateChange={handleViewStateChange}
      glOptions={{ powerPreference: "high-performance" }}
      getCursor={state => {
        if (state.isHovering) {
          return "pointer";
        }

        return "auto";
      }}
      height="100%"
      controller={{ dragRotate: true, touchRotate: true }}
    />
  );
};

export default Map;
