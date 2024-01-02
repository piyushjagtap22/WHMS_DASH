import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";


const MapComponent = () => {
    useEffect(() => {
        const map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v11",
            center: [-122.416667, 37.774929],
            zoom: 11,
            accessToken: "YOUR_MAPBOX_ACCESS_TOKEN",
          });
          
          const sourceManager = map.getSourceManager();
          
          // Create a new GeoJSON source
          const geofenceSource = sourceManager.addSource("geofence", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                // Define your geofence polygons or lines here
                {
                  type: "Feature",
                  geometry: {
                    type: "Polygon",
                    coordinates: [
                      [-122.419444, 37.775025],
                      [-122.418333, 37.773889],
                      [-122.417222, 37.774929],
                      [-122.419444, 37.775025],
                    ],
                  },
                },
              ],
            },
          });
          
          // Create a layer using the geofence source
          const geofenceFillLayer = map.addLayer({
            id: "geofence-fill",
            source: "geofence",
            type: "fill",
            paint: {
              "fill-color": "#008CBA", // Customize geofence fill color
              "fill-opacity": 0.2, // Customize geofence fill opacity
            },
          });
    
        // Implement geofencing logic here
        map.on("enter", (event) => {
          console.log("Entered geofenced area");
        });
        map.on("leave", (event) => {
          console.log("Exited geofenced area");
        });
      }, []);
    
      return(
        <>
        <div id="map"></div>;
        </>
      ) 
}

export default MapComponent;