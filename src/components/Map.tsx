import React from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import UzbFeatureMap from "./UzbFeatureMap";
import GeomanMultiple from "./Geoman/GeomanMultiple";
import type { FeatureCollection } from "geojson";
import { SearchControl, OpenStreetMapProvider } from "leaflet-geosearch";

export const GEOJSON: FeatureCollection = {
  type: "FeatureCollection",
  features: [],
};

const GeoSearchComponent = () => {
  const map = useMap();

  React.useEffect(() => {
    //@ts-ignore
    const searchControl = new SearchControl({
      provider: new OpenStreetMapProvider(),
      style: "bar",
    });

    map.addControl(searchControl);

    return () => {
      map.removeControl(searchControl);
    };
  }, [map]);

  return null;
};

const Map = () => {
  const [geoJson, setGeoJsoN] = React.useState<FeatureCollection>(GEOJSON);
  // @ts-ignore
  const searchControl = new SearchControl({
    provider: new OpenStreetMapProvider(),
    style: "bar",
  });

  return (
    <MapContainer
      style={{ width: "100%", height: "100%" }}
      center={[41.311081, 69.240562]}
      zoom={13}
      scrollWheelZoom={true}
      //@ts-ignore
      fullscreenControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <UzbFeatureMap />
      <GeomanMultiple
        geojson={geoJson}
        setGeojson={setGeoJsoN}
        cutPolygon={false}
        drawPolygon={true}
      />
      <GeoSearchComponent />
    </MapContainer>
  );
};

export default Map;
