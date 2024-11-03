import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
    height: "500px",
    width: "100%"
};

const OSMMap = ({ location }) => {
    // Convert [latitude, longitude] array to { lat, lng } object
    const mapCenter = {
        lat: location[0],
        lng: location[1]
    };

    return (
        <LoadScript googleMapsApiKey="AIzaSyBELPFJULi_B_gOij60Tfe_Yd3utXQljKE">
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={13}
            >
                <Marker position={mapCenter} />
            </GoogleMap>
        </LoadScript>
    );
};

export default OSMMap;
