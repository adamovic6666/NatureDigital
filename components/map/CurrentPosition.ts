import { TRANSITION_EVENTS } from "@deck.gl/core/typed";
import { IconLayer } from "@deck.gl/layers/typed";
import { FULL_MAP_BOUNDS, ICON_MAPPING } from "@nature-digital/constants";
import { CoordinateType } from "@nature-digital/types";
import { createRef, useCallback, useLayoutEffect, useState } from "react";
import { mapRef } from "../../utils/fetchers/mapFetcher";
import { transitionInterpolator } from ".";

// eslint-disable-next-line
export let goToMe: Function;
export const goToMeRef = createRef<HTMLButtonElement>();

const CurrentPosition = () => {
  const [coords, setCoords] = useState<CoordinateType | null>(null);

  const onSuccess = useCallback((position: GeolocationPosition) => {
    const { longitude, latitude } = position.coords;

    if (
      FULL_MAP_BOUNDS.bX < longitude &&
      FULL_MAP_BOUNDS.tX > longitude &&
      FULL_MAP_BOUNDS.bY < latitude &&
      FULL_MAP_BOUNDS.tY > latitude
    ) {
      // eslint-disable-next-line
      goToMeRef.current!.style.display = "block";
      setCoords({ lng: longitude, lat: latitude });
    }
  }, []);

  useLayoutEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onSuccess);
    }
    // eslint-disable-next-line
  }, []);

  goToMe = useCallback(() => {
    if (coords) {
      // @ts-ignore
      const viewState = mapRef.current?.deck?.viewState["default-view"];

      mapRef?.current?.deck?.setProps?.({
        initialViewState: {
          ...viewState,
          transitionInterpolator,
          transitionInterruption: TRANSITION_EVENTS.BREAK,
          transitionDuration: "auto",
          longitude: coords?.lng,
          latitude: coords?.lat,
          zoom: 12,
        },
      });
    }
  }, [coords]);

  if (!coords) return null;

  return new IconLayer({
    id: "CURRENT_POSITION",
    data: [{ coords }],
    iconAtlas: "marker.png",
    getIcon: () => "marker-1",
    sizeScale: 10,
    getPosition: d => [d.coords.lng, d.coords.lat],
    getSize: () => 5,
    iconMapping: ICON_MAPPING,
  });
};

export default CurrentPosition;
