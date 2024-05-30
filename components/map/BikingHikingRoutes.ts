import { GeoBoundingBox, TileLayer } from "@deck.gl/geo-layers/typed";
import { BitmapLayer } from "@deck.gl/layers/typed";
import { MAP_ENDPOINTS, MAP_IDS, SWR_KEYS } from "@nature-digital/constants";
import { SWRTypes } from "@nature-digital/types";
import useSWR from "swr";

type BikingHikingRoutesProps = {
  type: "hiking" | "biking";
};

const BikingHikingRoutesProps = ({ type }: BikingHikingRoutesProps) => {
  const { data: routes } = useSWR<SWRTypes["ROUTES"]>(SWR_KEYS.ROUTES);
  const mapId = type === "biking" ? MAP_IDS.RADWEGE_WEB : MAP_IDS.WANDERWEGE_WEB;

  return new TileLayer({
    id: `${type}_LAYER`,
    // Since these OSM tiles support HTTP/2, we can make many concurrent requests
    // and we aren't limited by the browser to a certain number per domain.
    maxRequests: 50,
    getTileData: tile => {
      const { west, north, east, south } = tile.bbox as GeoBoundingBox;
      const urlBbox = `${west},${south},${east},${north}`;

      return (MAP_ENDPOINTS[mapId] as Function)?.(urlBbox);
    },
    // https://wiki.openstreetmap.org/wiki/Zoom_levels
    minZoom: 6,
    maxZoom: 17,
    visible: routes?.[type],
    tileSize: 256,
    renderSubLayers: props => {
      const { west, south, east, north } = props.tile.bbox as GeoBoundingBox;

      return new BitmapLayer(props, {
        data: null,
        image: props.data,
        bounds: [west, south, east, north],
      });
    },
  });
};

BikingHikingRoutesProps.displayName = "BikingHikingLayer";

export default BikingHikingRoutesProps;
