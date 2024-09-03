import React, { useEffect } from 'react';

const MapComponent = () => {
    useEffect(() => {
        // Ensure the HERE Maps API scripts have been loaded
        if (window.H && !window.map) {
            try {
                // Initialize the HERE Maps platform
                const platform = new window.H.service.Platform({
                    apikey: 'RR9BXK19HSAjZo3rDT-KGWAEGHihclqTzQq2x8SJ2NM' // Replace with your actual API key
                });

                // Create default map layers
                const defaultLayers = platform.createDefaultLayers();

                // Initialize the map
                const map = new window.H.Map(
                    document.getElementById('mapContainer'),
                    defaultLayers.vector.normal.map,
                    {
                        center: { lat: 24.8833, lng: 67.066073 }, // Example coordinates (Berlin)
                        zoom: 10,
                        pixelRatio: window.devicePixelRatio || 1
                    }
                );

                // Enable map interactions
                const behavior = new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(map));

                // Create default UI components
                const ui = window.H.ui.UI.createDefault(map, defaultLayers);

                // Add a marker
                const marker = new window.H.map.Marker({ lat: 24.8833, lng: 67.066073 });
                map.addObject(marker);

                // Store map reference to avoid re-initialization
                window.map = map;

            } catch (error) {
                console.error('Error initializing HERE Maps:', error);
            }
        }
    }, []);

    return (
        <div id="mapContainer" style={{ height: '500px', width: '100%' }}>
            {/* Map will be rendered here */}
        </div>
    );
};

export default MapComponent;
