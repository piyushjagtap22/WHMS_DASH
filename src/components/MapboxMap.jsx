import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import CustomButton from './Button';
import { getLoc } from '../slices/adminApiSlice';
import mapboxgl from 'mapbox-gl';
import { toast } from 'react-hot-toast';
import { Box, useMediaQuery } from '@mui/material';
const MAPBOX_TOKEN =
  'pk.eyJ1IjoicGl5dXNoMjIiLCJhIjoiY2x1ZWM2cWtlMXFhZjJrcW40OHA0a2h0eiJ9.GtGi0PHDryu8IT04ueU7Pw';
const GEOCODING_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
const MapboxMap = () => {
  const token = useSelector(
    (state) => state.auth.AuthUser?.stsTokenManager?.accessToken
  );
  useEffect(() => {
    console.log('Mapbox map re rendering');
  });

  const userData = useSelector((state) => state.device.currentDeviceData);

  const currentUserId = userData.currentUserId;

  const isNonMediumScreens = useMediaQuery('(min-width: 1200px)');
  const [latLonData, setLatLonData] = useState([]);
  const [address, setAddress] = useState('');
  const latitudeRef = useRef(latLonData[0]);
  const longitudeRef = useRef(latLonData[1]);
  const mapContainerRef = useRef(null);

  const getLocation = useCallback(
    async (map) => {
      try {
        const dataloc = await getLoc(token, currentUserId);
        const latitude = dataloc.data[0].lat;
        const longitude = dataloc.data[0].lon;

        if (
          latitudeRef.current === latitude &&
          longitudeRef.current === longitude
        )
          return null;
        setLatLonData([latitude, longitude]);
        latitudeRef.current = latitude;
        longitudeRef.current = longitude;
        updateAddress(latitude, longitude, 'address1');

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
        if (geojson != null) {
          map.addSource('device', { type: 'geojson', data: geojson });
          map.addLayer({
            id: 'device',
            type: 'symbol',
            source: 'device',
            layout: { 'icon-image': 'rocket' },
          });
          setInterval(async () => {
            try {
              const geojson = await getLocation(map);
              map.getSource('device').setData(geojson);
            } catch (err) {
              console.error('Error updating map source:', err);
            }
          }, 5000);
        }
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

  const copyLocation = () => {
    const url = `https://google.com/maps/search/${latitudeRef.current},${longitudeRef.current}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        console.log('URL copied to clipboard');
        toast.success('Location Copied to clipboard');
      })
      .catch((err) => {
        toast.error('Unable to copy location');
        console.error('Failed to copy URL to clipboard', err);
      });
  };

  return (
    <>
      <Box
        margin='2rem 2rem'
        display='grid'
        gridTemplateColumns='repeat(12, 1fr)'
        gridAutoRows='160px'
        gap='12px'
        zIndex={2}
        sx={{
          '& > div': {
            gridColumn: isNonMediumScreens ? undefined : 'span 12',
          },
        }}
        style={{ marginBottom: '64px' }}
      >
        <div
          className='MuiBox-root'
          style={{
            gridColumn: 'span 7',
            gridRow: 'span 3',
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
                  width: '100%', // Make sure the map container takes full width
                }}
                ref={mapContainerRef}
              />
              <div
                style={{
                  padding: '16px',
                }}
              >
                {address !== '' && (
                  <>
                    <p
                      style={{
                        maxWidth: '754.5px',
                        padding: '8px',
                        border: '2px solid gray',
                        borderRadius: '0.73rem',
                      }}
                    >
                      Location: {address}
                    </p>
                  </>
                )}
                <CustomButton onClick={handleButtonClick}>
                  Open in Maps
                </CustomButton>

                <ContentCopyIcon
                  onClick={copyLocation}
                  style={{ marginLeft: '500px' }}
                />
              </div>
            </>
          ) : (
            'Loading...'
          )}
        </div>
      </Box>
    </>
  );
};

export default MapboxMap;
