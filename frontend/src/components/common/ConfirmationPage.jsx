import React, { useEffect, useState } from 'react'
import { Navbar } from '../layouts/Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import "../../assets/confirmationpage.css"
import { Footer } from '../layouts/Footer';

export const ConfirmationPage = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const res = await axios.get(`/liveride/getridebyid/${id}`);
                setBooking(res.data);
            } catch (err) {
                setError("Failed to load booking details.");
            }
            setLoading(false);
        };
        fetchBookingDetails();
    }, [bookingId]);

    if (loading) return <p className="loading">Loading booking details...</p>;
    if (error) return <p className="error">{error}</p>;

    const handleContactDriver = () => {
        alert("Contact Driver feature coming soon!");
    };

    const handleCancelBooking = () => {
        alert("Cancel Booking feature coming soon!");
    };
    return (
        <>
            <Navbar />
            <div className="booking-confirmation-container">
                <div className="confirmation-card">
                    <h2 className="confirmation-title">🎉 Booking Confirmed!</h2>
                    <p className="confirmation-text">
                        Your ride from <span className="highlight">{booking.ride.startLocation}</span> to <span className="highlight">{booking.ride.destination}</span> is successfully booked.
                    </p>
                    <div className="ride-details">
                        <div className="detail-item">
                            <span className="detail-label">Departure:</span>
                            <span className="detail-value">{new Date(booking.ride.departureTime).toLocaleTimeString()}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Seats Booked:</span>
                            <span className="detail-value">{booking.seatsBooked}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Total Price:</span>
                            <span className="detail-value">₹{booking.totalPrice}.00</span>
                        </div>
                    </div>
                    <div className="action-buttons">
                        <button className="btn contact-btn" onClick={handleContactDriver}>📞 Contact Driver</button>
                        <button className="btn cancel-btn" onClick={handleCancelBooking}>❌ Cancel Booking</button>
                    </div>
                </div>
            </div>
            <Footer />
        </>

    )
}
