import React, { useEffect, useRef, useState } from 'react'
import "../../assets/riderequestpage.css"
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Autocomplete } from "@react-google-maps/api";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import MapWithMarkers from '../common/MapWithMarkers';
import { toast, ToastContainer } from 'react-toastify';
import { Navbar } from '../layouts/Navbar';

export const RideRequestPage = () => {
    const { id: rideId } = useParams();
    // console.log(rideId)
    const navigate = useNavigate();
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropoffLocation, setDropoffLocation] = useState('');
    const [rideDetails, setRideDetails] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [preferences, setPreferences] = useState({
        quietRide: false,
        nonSmoking: false,
        petFriendly: false,
        moreSpace: false,
    });
    const pickupAutoRef = useRef(null);
    const dropoffAutoRef = useRef(null);
    const inputPickupRef = useRef(null);
    const inputDropoffRef = useRef(null);
    const [pickupCoords, setPickupCoords] = useState(null);
    const [dropoffCoords, setDropoffCoords] = useState(null);
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const riderId = user.id;
    console.log(riderId)

    // Fetch ride details (optional, if you want to show them)
    useEffect(() => {
        const fetchRideDetails = async () => {
            try {
                const res = await axios.get(`/liveride/getridebyid/${rideId}`);
                console.log(res);

                setRideDetails(res.data.data);
            } catch (err) {
                console.error("Error fetching ride details", err);
            }
        };
        fetchRideDetails();
    }, [rideId]);

    const handleCheckboxChange = (e) => {
        setPreferences({
            ...preferences,
            [e.target.name]: e.target.checked,
        });
    };


    const handleRequest = async () => {
        if (!pickupLocation || !dropoffLocation) {
            toast.error("Please fill in both pickup and dropoff locations.")
            setError("Please fill in both pickup and dropoff locations.");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post("/riderequest/addriderequest", {
                riderId,
                rideId,
                pickupLocation,
                dropoffLocation,
                ridestatus: "pending",
                preferences,
            });
            console.log(res.data)
            toast.success("Request sent successfully!");
            // setMessage("Request sent successfully!");
            setTimeout(() => navigate("/userprofile"), 1500); // Navigate after 1.5 sec
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send request.");
        }
        setLoading(false);
    };
    return (
        <>
            <Navbar />
            <ToastContainer position="top-right" autoClose={1500} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

            <div className="ride-request-container">
                <h2>Send Ride Request</h2>

                {rideDetails && (
                    <div className="ride-info-card">
                        <p><strong>From:</strong> {rideDetails.startLocation}</p>
                        <p><strong>To:</strong> {rideDetails.destination}</p>
                        <p><strong>Price:</strong> ₹{rideDetails.pricePerSeat}</p>
                        <p><strong>Driver:</strong> {rideDetails.driverId?.userName || "N/A"}</p>
                    </div>
                )}

                <Autocomplete
                    onLoad={(autocomplete) => (pickupAutoRef.current = autocomplete)}
                    onPlaceChanged={() => {
                        const place = pickupAutoRef.current.getPlace();
                        if (!place || !place.geometry) return;
                        setPickupLocation(place.formatted_address);
                        setPickupCoords({
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng(),
                        })
                    }}
                >
                    <input
                        ref={inputPickupRef}
                        type="text"
                        placeholder="Pickup Location"
                        className="input-field"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                    />
                </Autocomplete>

                <Autocomplete
                    onLoad={(autocomplete) => (dropoffAutoRef.current = autocomplete)}
                    onPlaceChanged={() => {
                        const place = dropoffAutoRef.current.getPlace();
                        if (!place || !place.geometry) return;
                        setDropoffLocation(place.formatted_address);
                        setDropoffCoords({
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng(),
                        });
                    }}
                >
                    <input
                        ref={inputDropoffRef}
                        type="text"
                        placeholder="Dropoff Location"
                        className="input-field"
                        value={dropoffLocation}
                        onChange={(e) => setDropoffLocation(e.target.value)}
                    />
                </Autocomplete >
                {pickupCoords && dropoffCoords && (
                    <MapWithMarkers
                        pickupCoords={pickupCoords}
                        dropoffCoords={dropoffCoords}
                    />
                )}

                <div className="preferences">
                    {Object.entries(preferences).map(([key, value]) => (
                        <label key={key}>
                            <input
                                type="checkbox"
                                name={key}
                                checked={value}
                                onChange={handleCheckboxChange}
                            />
                            {key === "quietRide" && "I prefer a quiet ride"}
                            {key === "nonSmoking" && "I need a non-smoking car"}
                            {key === "petFriendly" && "I need a pet-friendly car"}
                            {key === "moreSpace" && "I need more space"}
                        </label>
                    ))}
                </div>
                <button className="send-request-btn" onClick={handleRequest} disabled={loading}>
                    {loading ? "Sending..." : "Send Request"}
                </button>
                {message && <p className="message-success">{message}</p>}
                {error && <p className="message-error">{error}</p>}
            </div>
        </>
    )
}
