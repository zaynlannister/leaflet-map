import React from "react";
import { GeoJSON } from "react-leaflet";

interface UzbGeoJsonProps {
  geojson: any;
  zoomLevel: number;
}

const UzbGeoJson: React.FC<UzbGeoJsonProps> = ({ geojson, zoomLevel }) => {
  const geoJsonRef = React.useRef<any>();

  React.useEffect(() => {
    if (geoJsonRef.current) {
      if (zoomLevel >= 9) {
        let newData = geojson?.features?.filter(
          (item: any) => item.geometry.type !== "MultiPolygon"
        );
        geoJsonRef.current?.clearLayers(); // remove old data
        geoJsonRef.current?.addData(newData); // might need to be geojson.features
      } else {
        geoJsonRef.current?.clearLayers(); // remove old data
        geoJsonRef.current?.addData(geojson); // might need to be geojson.features
      }
    }
  }, [geoJsonRef, geojson, geojson?.features?.length, zoomLevel]);
  return <GeoJSON ref={geoJsonRef} data={geojson.features} />;
};

export default UzbGeoJson;
