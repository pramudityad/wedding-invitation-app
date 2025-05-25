import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

const MapComponent = ({ center = [0, 0], zoom = 10 }) => {
  const mapRef = useRef();
  const map = useRef(null);

  useEffect(() => {
    map.current = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: center,
        zoom: zoom
      })
    });
    return () => map.current.setTarget(undefined);
  }, []);

  return <div ref={mapRef} className="map-container" style={{ width: '100%', height: '400px' }} />;
};

export default MapComponent;
