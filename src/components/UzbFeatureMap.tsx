import React from "react";
import { FeatureGroup, useMapEvents } from "react-leaflet";
import uzbjson from "../data/uzb.json";
import UzbGeoJson from "./UzbGeoJson";

const UzbFeatureMap = () => {
  const ref = React.useRef<L.FeatureGroup>(null);

  const [zoomLevel, setZoomLevel] = React.useState<number>(8);

  const maps = useMapEvents({
    zoomend: function () {
      const zoomLevel = maps.getZoom();
      setZoomLevel(zoomLevel);
    },
  });
  return (
    <FeatureGroup ref={ref}>
      {uzbjson && <UzbGeoJson geojson={uzbjson} zoomLevel={zoomLevel} />}
    </FeatureGroup>
  );
};

export default UzbFeatureMap;
