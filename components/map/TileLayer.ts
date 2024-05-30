import { GeoBoundingBox, TileLayer as TLayer } from "@deck.gl/geo-layers/typed";
import { BitmapLayer } from "@deck.gl/layers/typed";
import { MAP_ENDPOINTS, MAP_IDS, MAP_TYPES, SWR_KEYS, WEB_MAP_SETTINS } from "@nature-digital/constants";
import { SWRTypes } from "@nature-digital/types";
import useSWR from "swr";
import isMobileUser from "../../utils/functions/isMobileUser";

const TileLayer = () => {
  const { data: mapType } = useSWR<SWRTypes["MAP_TYPE"]>(SWR_KEYS.MAP_TYPE);

  const cityLabels = new TLayer({
    // @ts-ignore
    data: MAP_ENDPOINTS[MAP_IDS.BASE_WEB](MAP_TYPES.LUFTBILD),

    visible: mapType === MAP_TYPES.CITY_LABELS,
    // Since these OSM tiles support HTTP/2, we can make many concurrent requests
    // and we aren't limited by the browser to a certain number per domain.
    maxRequests: 50,
    id: "LUFTBILD_TILE_LAYER",
    // https://wiki.openstreetmap.org/wiki/Zoom_levels
    minZoom: WEB_MAP_SETTINS.MIN_ZOOM,
    maxZoom: WEB_MAP_SETTINS.MAX_ZOOM,
    zoomOffset: isMobileUser() ? 1 : 0,
    tileSize: 256,
    renderSubLayers: props => {
      const { west, south, east, north } = props.tile.bbox as GeoBoundingBox;

      return [
        new BitmapLayer(props, {
          data: null,
          image: props.data,
          bounds: [west, south, east, north],
        }),
      ];
    },
  });

  const baseTile = new TLayer({
    // @ts-ignore
    data: MAP_ENDPOINTS[MAP_IDS.BASE_WEB](mapType),
    // Since these OSM tiles support HTTP/2, we can make many concurrent requests
    // and we aren't limited by the browser to a certain number per domain.
    maxRequests: 50,
    id: "TILE_LAYER",
    // https://wiki.openstreetmap.org/wiki/Zoom_levels
    minZoom: WEB_MAP_SETTINS.MIN_ZOOM,
    maxZoom: WEB_MAP_SETTINS.MAX_ZOOM,
    tileSize: 256,
    zoomOffset: isMobileUser() ? 1 : 0,
    renderSubLayers: props => {
      const { west, south, east, north } = props.tile.bbox as GeoBoundingBox;

      return [
        new BitmapLayer(props, {
          data: null,
          image: props.data,
          bounds: [west, south, east, north],
        }),
      ];
    },
  });

  return [cityLabels, baseTile];
};

export default TileLayer;
