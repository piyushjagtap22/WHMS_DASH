import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import CustomButton from './Button';
import { getLoc } from '../slices/adminApiSlice';
import mapboxgl from 'mapbox-gl';

const MAPBOX_TOKEN =
  'pk.eyJ1IjoicGl5dXNoMjIiLCJhIjoiY2x1ZWM2cWtlMXFhZjJrcW40OHA0a2h0eiJ9.GtGi0PHDryu8IT04ueU7Pw';
const GEOCODING_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

const MapboxMap = ({ lat, lon, currentUserId }) => {
  const token = useSelector(
    (state) => state.auth.AuthUser?.stsTokenManager?.accessToken
  );
  useEffect(() => {
    console.log('Mapbox map re rendering');
  });
  const [latLonData, setLatLonData] = useState([]);
  const [address, setAddress] = useState('');
  const [address2, setAddress2] = useState('');
  const latitudeRef = useRef(lat);
  const longitudeRef = useRef(lon);
  const mapContainerRef = useRef(null);

  console.log(currentUserId, lat, lon); // this is being logged repeatedly with same data

  useEffect(() => {
    latitudeRef.current = lat;
    longitudeRef.current = lon;
    setLatLonData([lat, lon]);
    updateAddress(lat, lon, 'address1');
  }, [lat, lon]);

  const getLocation = useCallback(
    async (map) => {
      try {
        const dataloc = await getLoc(token, currentUserId);
        const latitude = dataloc.data[0].lat;
        const longitude = dataloc.data[0].lon;

        setLatLonData([latitude, longitude]);
        latitudeRef.current = latitude;
        longitudeRef.current = longitude;

        if (
          latitudeRef.current !== latitude ||
          longitudeRef.current !== longitude
        ) {
          if (map.getLayer('route')) {
            map.removeLayer('route');
          }
          if (map.getSource('route')) {
            map.removeSource('route');
          }

          if (map.getLayer('end')) {
            map.removeLayer('end');
          }
          if (map.getSource('end')) {
            map.removeSource('end');
          }
        }
        map.flyTo({
          center: [longitude, latitude],
          speed: 4.5,
        });

        return {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [longitude, latitude],
              },
            },
          ],
        };
      } catch (err) {
        console.error('Error fetching location:', err);
        throw new Error(err);
      }
    },
    [currentUserId, token]
  );

  const initializeMap = useCallback(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      zoom: 14.0,
    });

    map.on('load', async () => {
      try {
        const geojson = await getLocation(map);
        map.addSource('iss', { type: 'geojson', data: geojson });
        map.addLayer({
          id: 'iss',
          type: 'symbol',
          source: 'iss',
          layout: { 'icon-image': 'rocket' },
        });

        setInterval(async () => {
          try {
            const geojson = await getLocation(map);
            map.getSource('iss').setData(geojson);
          } catch (err) {
            console.error('Error updating map source:', err);
          }
        }, 5000);

        map.on('click', async (event) => {
          const coords = [event.lngLat.lng, event.lngLat.lat];
          const end = {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: { type: 'Point', coordinates: coords },
              },
            ],
          };

          if (map.getLayer('end')) {
            map.getSource('end').setData(end);
          } else {
            map.addLayer({
              id: 'end',
              type: 'circle',
              source: { type: 'geojson', data: end },
              paint: { 'circle-radius': 10, 'circle-color': '#f30' },
            });
          }

          updateAddress(coords[1], coords[0], 'address2');
          await getRoute(
            map,
            [latitudeRef.current, longitudeRef.current],
            coords
          );
        });
      } catch (err) {
        console.error('Error initializing map:', err);
      }
    });
  }, [getLocation]);

  useEffect(() => {
    const mapboxScript = document.createElement('script');
    mapboxScript.src =
      'https://api.mapbox.com/mapbox-gl-js/v3.2.0/mapbox-gl.js';
    mapboxScript.onload = initializeMap;
    document.body.appendChild(mapboxScript);

    const mapboxLink = document.createElement('link');
    mapboxLink.href =
      'https://api.mapbox.com/mapbox-gl-js/v3.2.0/mapbox-gl.css';
    mapboxLink.rel = 'stylesheet';
    document.head.appendChild(mapboxLink);
  }, [initializeMap]);

  const updateAddress = useCallback(async (lat, lon, addressType) => {
    const req = `${GEOCODING_URL}/${lon}%2C%20${lat}.json?access_token=${MAPBOX_TOKEN}`;
    try {
      const loc = await axios.get(req);
      const placeName = loc.data?.features[0]?.place_name;

      if (addressType === 'address1') {
        setAddress(placeName);
      } else if (addressType === 'address2') {
        setAddress2(placeName);
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  }, []);

  const handleButtonClick = () => {
    const url = `https://google.com/maps/search/${latitudeRef.current},${longitudeRef.current}`;
    window.open(url, '_blank');
  };

  return (
    <>
      <div
        className='MuiBox-root'
        style={{
          gridColumn: 'span 7',
          gridRow: 'span 4',
          height: '34rem',
          backgroundColor: '#191C23',
          padding: '0rem',
          borderRadius: '1.55rem',
          zIndex: 2,
        }}
      >
        {latitudeRef.current != null || latitudeRef.current !== '' ? (
          <>
            <div
              id='map2'
              style={{
                borderTopLeftRadius: '1.55rem',
                borderTopRightRadius: '1.55rem',
                height: '23rem',
              }}
              ref={mapContainerRef}
            />
            <div style={{ padding: '16px' }}>
              {address !== '' && (
                <p
                  style={{
                    maxWidth: '754.5px',
                    padding: '8px',
                    border: '2px solid gray',
                    borderRadius: '0.73rem',
                  }}
                >
                  {address}
                </p>
              )}
              <CustomButton onClick={handleButtonClick}>
                Open in Maps
              </CustomButton>
            </div>
          </>
        ) : (
          'Loading...'
        )}
      </div>
    </>
  );
};

// Use React.memo to wrap your component with a custom comparison function
export default React.memo(MapboxMap, (prevProps, nextProps) => {
  console.log('prevProps:', prevProps);
  console.log('nextProps:', nextProps);
  return (
    prevProps.lat === nextProps.lat &&
    prevProps.lon === nextProps.lon &&
    prevProps.currentUserId === nextProps.currentUserId
  );
});
