import React, { useState, useCallback, useEffect } from 'react';
import {
    GoogleMap,
    DirectionsService,
    DirectionsRenderer,
    useJsApiLoader
} from '@react-google-maps/api';
import "../../assets/mapmodal.css";

const containerStyle = {
    width: "100%",
    height: "400px"
};

const MapPopupModal = ({ origin, destination, focus, onClose }) => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: ["places"]
    });

    const [directions, setDirections] = useState(null);
    const [map, setMap] = useState(null);
    const [hasCentered, setHasCentered] = useState(false);

    const directionsCallback = useCallback((result) => {
        if (result?.status === "OK") {
            setDirections(result);
            setHasCentered(false);
        }
    }, []);

    const onMapLoad = useCallback((mapInstance) => {
        setMap(mapInstance);
    }, []);

    // 🔍 Focus on Point A or B based on 'focus' prop
    useEffect(() => {
        if (map && directions) {
            const route = directions.routes[0];
            const leg = route.legs[0];

            if (focus === "start" && leg.start_location) {
                map.panTo(leg.start_location);
                map.setZoom(15);
                setHasCentered(true);
            } else if (focus === "destination" && leg.end_location) {
                map.panTo(leg.end_location);
                map.setZoom(15);
                setHasCentered(true);
            }
        }
    }, [map, directions,focus,hasCentered]);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {/* Clean, simple close button */}
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "transparent",
                        border: "none",
                        fontSize: "18px",
                        cursor: "pointer",
                        zIndex: 2
                    }}
                >
                    ✖
                </button>

                {isLoaded ? (
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        zoom={12}
                        onLoad={onMapLoad}
                        options={{
                            disableDefaultUI: true,
                            gestureHandling: 'greedy'
                        }}
                    >
                        <DirectionsService
                            options={{
                                origin,
                                destination,
                                travelMode: "DRIVING"
                            }}
                            callback={directionsCallback}
                        />

                        {directions && (
                            <DirectionsRenderer
                                directions={directions}
                                options={{ preserveViewport: true }}
                            />
                        )}
                    </GoogleMap>
                ) : (
                    <p>Loading Map...</p>
                )}
            </div>
        </div>
    );
};

export default MapPopupModal;
