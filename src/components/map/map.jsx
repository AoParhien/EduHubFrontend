import { useEffect, useState } from "react";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import axios from "axios";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const MapWithPlusCode = ({ plusCode, coordinates }) => {

  console.log(coordinates)
  const [mapCenter, setMapCenter] = useState(null);

  useEffect(() => {
    if (coordinates?.length === 2) {
      // If coordinates are provided, use them directly
      setMapCenter({ lat: coordinates[0], lng: coordinates[1] });
      return;
    }

    if (!plusCode) return; // Return early if neither Plus Code nor coordinates are available

    const fetchCoordinates = async () => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(plusCode)}&key=${GOOGLE_MAPS_API_KEY}`
        );

        const location = response.data.results[0]?.geometry?.location;
        if (location) {
          setMapCenter(location);
        } else {
          console.error("Invalid Plus Code or no location found");
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    fetchCoordinates();
  }, [plusCode, coordinates]); // Depend on both Plus Code and Coordinates

  if (!mapCenter) return null; // Return nothing if no valid location

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={mapContainerStyle} center={mapCenter} zoom={13}>
        <Marker position={mapCenter} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapWithPlusCode;
