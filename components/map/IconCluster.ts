import { CompositeLayer } from "@deck.gl/core/typed";
import { IconLayer } from "@deck.gl/layers/typed";
import { CustomIconLayerProps, IconLayerType } from "@nature-digital/types";
import Supercluster from "supercluster";

function getIconName(size: string | number) {
  if (typeof size === "string") {
    return size.replace(".png", "");
  }

  if (size < 10) {
    return `marker-${size}`;
  }
  if (size < 100) {
    return `marker-${Math.floor(size / 10)}0`;
  }
  return "marker-100";
}

function getIconSize(size: number, isHighlighted: boolean) {
  if (isHighlighted) {
    return 2; // Set radius to 100 for highlighted POI
  }
  return Math.min(100, size) / 100 + 1;
}

export default class IconClusterLayer extends CompositeLayer<CustomIconLayerProps> {
  static layerName = "IconClusterLayer";

  // eslint-disable-next-line
  shouldUpdateState({ changeFlags }) {
    return changeFlags.somethingChanged;
  }

  updateState({ props, oldProps, changeFlags }) {
    const rebuildIndex = changeFlags.dataChanged || props.sizeScale !== oldProps.sizeScale;

    if (rebuildIndex) {
      const index = new Supercluster({ maxZoom: 16, radius: props.sizeScale * Math.sqrt(2) });
      index.load(
        props.data.map((d: any) => ({
          geometry: { coordinates: props.getPosition(d) },
          properties: d,
        })),
      );
      this.setState({ index });
    }

    const z = Math.floor(this.context.viewport.zoom);
    if (rebuildIndex || z !== this.state.z) {
      this.setState({
        data: this.state.index.getClusters([-180, -85, 180, 85], z),
        z,
      });
    }
  }

  getPickingInfo({ info, mode }) {
    const pickedObject = info.object && info.object.properties;
    if (pickedObject) {
      if (pickedObject.cluster && mode !== "hover") {
        info.objects = this.state.index.getLeaves(pickedObject.cluster_id, 25).map(f => f.properties);
      }
      info.object = pickedObject;
    }
    return info;
  }

  renderLayers() {
    const { data } = this.state;
    const { iconAtlas, iconMapping, sizeScale, highlightedPOI, showAreaPoiLayer } = this.props;

    const layers: any[] = [];

    const clustersData = data.filter(
      (item: any) => item.properties.type !== IconLayerType.WEGE && item.properties.type !== IconLayerType.GEBIET,
    );

    const areaRoutesData = data.filter(
      (item: any) => item.properties.type === IconLayerType.WEGE || item.properties.type === IconLayerType.GEBIET,
    );

    layers.push(
      new IconLayer(
        this.getSubLayerProps({
          autoHighlight: true,
          filterTransformSize: true,
          filterTransformColor: true,
          id: "icon",
          data: clustersData,
          iconAtlas,
          iconMapping,
          sizeScale,
          getPosition: (d: any) => d.geometry.coordinates,
          getIcon: (d: any) =>
            getIconName(
              d.properties.cluster
                ? d.properties.point_count
                : d.properties.icon || d.properties.areaIcon || d.properties.type,
            ),
          getSize: (d: any) => {
            const isHighlighted = JSON.stringify(d.properties) === JSON.stringify(highlightedPOI);
            return getIconSize(d.properties.cluster ? d.properties.point_count : 1, isHighlighted);
          },
        }),
      ),
    );

    if (showAreaPoiLayer && areaRoutesData.length > 0) {
      layers.push(
        new IconLayer(
          this.getSubLayerProps({
            id: "area-icon",
            data: areaRoutesData,
            iconAtlas,
            iconMapping,
            sizeScale,
            getPosition: (d: any) => d.geometry.coordinates,
            getIcon: (d: any) =>
              getIconName(
                d.properties.cluster
                  ? d.properties.point_count
                  : d.properties.icon || d.properties.areaIcon || d.properties.type,
              ),
            getSize: (d: any) => {
              const isHighlighted = JSON.stringify(d.properties) === JSON.stringify(highlightedPOI);
              return getIconSize(d.properties.cluster ? d.properties.point_count : 1, isHighlighted);
            },
          }),
        ),
      );
    }

    return layers;
  }
}
