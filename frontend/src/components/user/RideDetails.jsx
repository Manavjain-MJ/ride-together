import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import "../../assets/ridedetails.css"
import axios from 'axios';
import { Navbar } from '../layouts/Navbar';
import { Footer } from '../layouts/Footer';
// import { ChatBoxPage } from '../common/ChatBoxPage';
import MapPopupModal from '../common/MapPopupModal'

export const RideDetails = ({ rideId, userId }) => {
    const { id } = useParams();
    const [ride, setRide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [focusPoint, setFocusPoint] = useState("start");
    const navigate = useNavigate();
    const currentDate = new Date().toDateString();

    const riderDetails = async () => {
        try {
            const res = await axios.get(`/liveride/getridebyid/${id}`)
            setRide(res.data.data)
            // console.log(res)
        } catch (error) {
            console.log("error", error)

        }
    }
    useEffect(() => {
        riderDetails()
        const currentUser = JSON.parse(localStorage.getItem("user"));  // Get user from localStorage
        setUser(currentUser);
    }, [])

    const handleBookClick = () => {
        navigate(`/riderequest/${id}`); // assuming ride._id is the ID of the current ride
    };

    const handleLocationClick = (point) => {
        setFocusPoint(point);
        setShowMap(true);
    };

    // if (loading) return <p>Loading ride details...</p>;
    if (error) return <p>{error}</p>;
    if (!ride) return <p>No ride data available.</p>;
    return (
        <>
            <Navbar />
            <div className="ride-details-container">
                {/* Date Header */}
                <h2 className="ride-date">{currentDate}</h2>

                {/* Ride Info Box */}
                <div className="ride-info-box">
                    <div className="ride-time">
                        <p className="time">
                            Start: {ride.departureTime ? new Date(ride.departureTime).toLocaleTimeString('en-GB') : "N/A"}
                        </p>
                        {/* <p className="duration">End:{ride.arrivalTime}</p> */}
                    </div>
                    <div className="ride-route">
                        <h3 onClick={() => handleLocationClick("start")} style={{ cursor: "pointer", color: "#005f73" }}>{ride.startLocation} 📍</h3>
                        <h3 onClick={() => handleLocationClick("end")} style={{ cursor: "pointer", color: "#005f73" }}>{ride.destination} 📍</h3>
                    </div>
                </div>

                {/* Driver Info */}
                <div className="driver-info-box">
                    <i className="fas fa-user driver-details-avatar"></i>
                    <div className="driver-details">
                        <h3>{ride.driverId?.userName}</h3>
                        <p>Your booking will be confirmed Shortly</p>
                        <p>🚗 {ride.vehicleId?.vehicleBrand}-{ride.vehicleId?.vehicleModel}</p>
                        <p>📧 {ride.driverId?.email || "N/A"}</p>
                        <p>📞 {ride.driverId?.mobileNumber || "N/A"}</p>
                    </div>
                </div>

                {/* Booking Section */}
                <div className="booking-summary">
                    <h3>{currentDate}</h3>
                    <div className="ride-summary">
                        <h4>{ride.startLocation} → {ride.destination}</h4>
                        <p>Time:  {ride.departureTime ? (() => {
                            const date = new Date(ride.departureTime);
                            const day = String(date.getDate()).padStart(2, '0');
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const year = date.getFullYear();
                            return `${day}-${month}-${year}`;
                        })() : "N/A"} - {ride.arrivalTime}</p>
                    </div>
                    <div className="price-section">
                        <p>{ride.seatsAvailable} Seats Available</p>
                        <h2>₹{ride.pricePerSeat}.00</h2>
                    </div>
                    {/* <div className="ride-details">
                        <button onClick={() => setShowChat(true)}>Chat with Driver</button>

                        {showChat && <ChatBoxPage rideId={rideId} userId={userId} />}
                    </div> */}
                    <button className="book-button" onClick={handleBookClick}>⚡ Book</button>
                </div>
            </div>
            <Footer />
            {showMap && (
                <MapPopupModal
                    origin={ride.startLocation}
                    destination={ride.destination}
                    focus={focusPoint}
                    onClose={() => setShowMap(false)}
                />
            )}
        </>
    )
}
