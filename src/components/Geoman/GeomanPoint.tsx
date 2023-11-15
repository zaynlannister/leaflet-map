import * as React from "react";
import { FeatureGroup } from "react-leaflet";
import type { FeatureCollection } from "geojson";
import * as L from "leaflet";
import { GeomanControls } from "react-leaflet-geoman-v2";

export interface Props {
  geojson: FeatureCollection;
  cutPolygon: boolean;
  drawPolygon: boolean;
  setGeojson: (geojson: FeatureCollection) => void;
}

export default function Geoman({
  geojson,
  setGeojson,
  cutPolygon = false,
  drawPolygon = false,
}: Props) {
  const ref = React.useRef<L.FeatureGroup>(null);
  const [markerCreated, setMarkerCreated] = React.useState(false);

  const generateId = () => {
    let uniqueId = React.useId();
    return uniqueId;
  };

  React.useEffect(() => {
    if (ref.current?.getLayers().length === 0 && geojson) {
      L.geoJSON(geojson).eachLayer((layer) => {
        if (
          layer instanceof L.Polyline ||
          layer instanceof L.Polygon ||
          layer instanceof L.Marker
        ) {
          if (layer?.feature?.properties.radius && ref.current) {
            new L.Circle(layer.feature.geometry.coordinates.slice().reverse(), {
              radius: layer.feature?.properties.radius,
            }).addTo(ref.current);
          } else {
            ref.current?.addLayer(layer);
          }
        }
      });
    }
    if (!geojson.features.length) {
      setMarkerCreated(false);
    } else {
      setMarkerCreated(true);
    }
  }, [geojson, geojson.features.length, markerCreated]);

  const handleChange = () => {
    const newGeo: FeatureCollection = {
      type: "FeatureCollection",
      features: [],
    };
    const layers = ref.current?.getLayers();

    if (layers) {
      layers.forEach((layer) => {
        if (layer instanceof L.Circle || layer instanceof L.CircleMarker) {
          const { lat, lng } = layer.getLatLng();

          newGeo.features.push({
            type: "Feature",
            properties: {
              radius: layer.getRadius(),
            },
            geometry: {
              type: "Point",
              coordinates: [lng, lat],
            },
            id: generateId(),
          });
        } else if (
          layer instanceof L.Marker ||
          layer instanceof L.Polygon ||
          layer instanceof L.Rectangle ||
          layer instanceof L.Polyline
        ) {
          newGeo.features.push(layer.toGeoJSON());
        }
      });
    }
    if (!markerCreated) {
      const markerLayer = ref.current
        ?.getLayers()
        .find((layer) => layer instanceof L.Marker);
      if (markerLayer) {
        setMarkerCreated(true);
      }
    }
    setGeojson(newGeo);
  };

  return (
    <FeatureGroup ref={ref}>
      <GeomanControls
        options={{
          position: "topleft",
          drawText: false,
          drawCircle: false,
          drawCircleMarker: false,
          drawPolyline: false,
          drawRectangle: false,
          drawPolygon,
          cutPolygon,
          drawMarker: !markerCreated,
          disableMarkerInsert: markerCreated,
        }}
        globalOptions={{
          continueDrawing: markerCreated,
          editable: true,
        }}
        onCreate={handleChange}
        onChange={handleChange}
        onUpdate={handleChange}
        onEdit={handleChange}
        onMapRemove={handleChange}
        onMapCut={handleChange}
        onDragEnd={handleChange}
        onMarkerDragEnd={handleChange}
      />
    </FeatureGroup>
  );
}
