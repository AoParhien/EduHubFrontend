import { useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import axios from "axios";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const MapWithPlusCode = ({ plusCode, coordinates }) => {
  const [mapCenter, setMapCenter] = useState(null);
  const [mapError, setMapError] = useState(null);

  const hasCoordinates = Array.isArray(coordinates) && coordinates.length === 2;

  useEffect(() => {
    setMapError(null);

    if (hasCoordinates) {
      // If coordinates are provided, use them directly
      setMapCenter({ lat: coordinates[0], lng: coordinates[1] });
      return;
    }

    if (!GOOGLE_MAPS_API_KEY) {
      setMapError("Location preview is unavailable right now.");
      return;
    }

    if (!plusCode) {
      setMapError("Location details have not been provided for this institute yet.");
      return;
    }

    const fetchCoordinates = async () => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(plusCode)}&key=${GOOGLE_MAPS_API_KEY}`
        );

        const location = response.data.results[0]?.geometry?.location;
        if (location) {
          setMapCenter(location);
        } else {
          setMapError("We couldn't resolve this location right now.");
        }
      } catch (error) {
        setMapError("Map services are unavailable at the moment.");
      }
    };

    fetchCoordinates();
  }, [plusCode, coordinates, hasCoordinates]); // Depend on both Plus Code and Coordinates

  if (mapError) {
    return (
      <Box
        width="100%"
        minH="220px"
        borderRadius="xl"
        border="1px dashed"
        borderColor="gray.300"
        bg="gray.50"
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={6}
        textAlign="center"
      >
        <Box>
          <Text fontWeight="700" color="gray.700" mb={2}>
            Map preview unavailable
          </Text>
          <Text color="gray.600">{mapError}</Text>
        </Box>
      </Box>
    );
  }

  if (!mapCenter) {
    return (
      <Box
        width="100%"
        minH="220px"
        borderRadius="xl"
        border="1px solid"
        borderColor="gray.200"
        bg="white"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text color="gray.500">Loading location preview...</Text>
      </Box>
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
      onError={() => setMapError("Map services are unavailable at the moment.")}
    >
      <GoogleMap mapContainerStyle={mapContainerStyle} center={mapCenter} zoom={13}>
        <Marker position={mapCenter} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapWithPlusCode;
