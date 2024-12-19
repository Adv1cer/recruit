'use client'
import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Loader from './Loader';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const location = {
  lat: 13.722387977930463,
  lng: 100.52934504287424
};

const GoogleMapRouteComponent = () => {
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} loadingElement={<Loader />}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={location}
        zoom={15}
      >
        <Marker position={location} />
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapRouteComponent;