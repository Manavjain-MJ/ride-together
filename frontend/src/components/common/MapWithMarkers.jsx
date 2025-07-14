import React from "react";
import { GoogleMap, Marker, Polyline, useLoadScript } from "@react-google-maps/api";

const MapWithMarkers = ({ pickupCoords, dropoffCoords }) => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    });

    if (!isLoaded || !pickupCoords || !dropoffCoords) return <div>Loading map...</div>;

    const defaultCenter = pickupCoords || { lat: 20.5937, lng: 78.9629 }; // India center as fallback

    const center = pickupCoords && dropoffCoords
        ? { lat: (pickupCoords.lat + dropoffCoords.lat) / 2, lng: (pickupCoords.lng + dropoffCoords.lng) / 2 } // Center between the pickup and dropoff
        : pickupCoords || dropoffCoords || defaultCenter;


    // console.log("Center:", center);
    // console.log("Pickup Coords:", pickupCoords);
    // console.log("Dropoff Coords:", dropoffCoords);

    return (
        <div style={{ marginTop: "20px", height: "400px", width: "100%", border: "2px solid #ccc" }}>
            <GoogleMap
                zoom={13}
                center={center}
                mapContainerStyle={{ width: "100%", height: "100%" }}
            >
                {pickupCoords && <Marker position={pickupCoords} label="P" />}
                {dropoffCoords && <Marker position={dropoffCoords} label="D" />}
                {pickupCoords && dropoffCoords && (
                    <Polyline
                        path={[pickupCoords, dropoffCoords]}
                        options={{
                            strokeColor: "#4285F4", // Blue line color
                            strokeOpacity: 0.8,
                            strokeWeight: 4,
                        }}
                    />
                )}
            </GoogleMap>
        </div>
    );
};

export default MapWithMarkers;