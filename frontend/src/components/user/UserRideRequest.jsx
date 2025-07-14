import React, { useEffect, useState } from 'react'
import "../../assets/userriderequest.css"
import axios from 'axios';
import { Navbar } from "../layouts/Navbar";
import { ChatBoxPage } from "../common/ChatBoxPage"

export const UserRideRequest = () => {
    const [rideRequests, setRideRequests] = useState({});
    const [selectedChatInfo, setSelectedChatInfo] = useState(null);
    const [showChatId, setShowChatId] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const userId = user.id;

    // Fetch ride requests and their details dynamically
    useEffect(() => {
        const fetchUserRideRequests = async () => {
            try {
                const res = await axios.get(`/riderequest/getriderequestbyid/${userId}`);
                const requestsData = res.data.data || [];
                // console.log("hi",requestsData)

                if (requestsData.length === 0) {
                    setRideRequests({}); 
                    setError("No ride requests found.");
                    setIsLoading(false);
                    return;
                }

                const requestsMap = {};
                await Promise.all(
                    requestsData.map(async (request) => {
                        try {
                            const rideRes = await axios.get(`/liveride/getridebyid/${request.rideId._id}`);
                            const rideDetails = rideRes.data.data;
                            // console.log("ride:-", request.rideId._id);   

                            requestsMap[request._id] = { ...request, rideDetails };
                        } catch (err) {
                            console.error("Error fetching ride details", err);
                            requestsMap[request._id] = { ...request, rideDetails: null };  // fallback
                        }
                    })
                );

                setRideRequests(requestsMap);
                setIsLoading(false);
            } catch (err) {
                setError("Failed to load ride requests.");
                setRideRequests({})
                setIsLoading(false);
            }
        };

        fetchUserRideRequests();
    }, [userId]);

    // const handleChat = (id) => {
    //     setShowChatId(id === showChatId ? null : id);
    // };

    const handleCancelRide = async (rideRequestId) => {
        try {
            await axios.delete(`/riderequest/deleteriderequest/${rideRequestId}`);
            alert("Ride request cancelled.");
            setRideRequests((prevRequests) => {
                const updatedRequests = { ...prevRequests };
                delete updatedRequests[rideRequestId];
                return updatedRequests;
            });
        } catch (err) {
            alert("Failed to cancel ride request.");
            console.error("Error canceling ride:", err);
        }
    };

    const handlePayment = async (request) => {
        try {
            const res = await axios.post('/payments/create_order', {
                amount: request.rideDetails.pricePerSeat,
                currency: 'INR',
                receipt: `receipt_${request._id}`,
            });
            const options = {
                key: 'rzp_test_xLITjHmCvR82HS', // replace with your live key in production
                amount: res.data.amount,
                currency: res.data.currency,
                name: 'RideTogether',
                description: 'Ride Payment',
                order_id: res.data.id,
                handler: async (response) => {
                    const verification = await axios.post('/payments/verify_order', {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    });

                    if (verification.data.status === 'success') {
                        alert('Payment Successful');


                        await axios.put(`/riderequest/updatepaymentstatus/${request._id}`, {
                            status: 'paid',
                        });

                        setRideRequests((prev) => ({
                            ...prev,
                            [request._id]: {
                                ...prev[request._id],
                                paymentStatus: 'paid',
                            },
                        }));
                    } else {
                        alert('Payment Verification Failed');
                    }
                },
                prefill: {
                    name: user.name || 'Customer',
                    email: user.email || 'customer@example.com',
                    contact: user.phone || '9876543210',
                },
                theme: {
                    color: '#F37254',
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error('Payment error:', err);
            alert('Failed to initiate payment');
        }
    };

    if (isLoading) return <div style={{ textAlign: "center" }}>Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    return (
        <>
            <Navbar />
            <div className="userRideRequests-container">
                {/* Left Side – Ride Requests List */}
                <div className="userRideRequest-list">
                    {Object.keys(rideRequests).length === 0 ? (
                        <p>
                            No ride requests yet.
                        </p>
                    ) : (Object.values(rideRequests).map((request) => (
                        <div key={request._id} className="userRideRequest-card">
                            <div className="userRide-driver-info">
                                <h3>Driver: {request.rideDetails?.driverId?.userName || "N/A"}</h3>
                                <p>Vehicle: {request.rideDetails?.vehicleId?.vehicleModel || "N/A"}</p>
                            </div>

                            <div className="userRide-ride-details">
                                <p>Pickup: {request.pickupLocation}</p>
                                <p>Dropoff: {request.dropoffLocation}</p>
                                <p>
                                    Price:{" "}
                                    {request.rideDetails?.pricePerSeat
                                        ? new Intl.NumberFormat('en-IN', {
                                            style: 'currency',
                                            currency: 'INR',
                                            minimumFractionDigits: 2,
                                        }).format(request.rideDetails.pricePerSeat)
                                        : "N/A"}
                                </p>
                            </div>

                            <div className="userRide-status">
                                <h4>
                                    Request Status:{" "}
                                    <span className={`status-${request.ridestatus}`}>
                                        {request.ridestatus}
                                    </span>
                                </h4>
                                <h4>
                                    Ride Status:{" "}
                                    <span className={`status-${request.rideDetails?.status || "not-started"}`}>
                                        {request.rideDetails?.status || "Not Started"}
                                    </span>
                                </h4>
                                <h4>
                                    Payment Status:{" "}
                                    <span className={`status-${request.rideDetails?.paymentStatus || "pending"}`}>
                                        {request.rideDetails?.paymentStatus || "pending"}
                                    </span>
                                </h4>

                                <div className="userRide-status-buttons">
                                    {request.ridestatus !== "cancelled" &&
                                        request.rideDetails?.status !== "cancelled" && (
                                            <>
                                                {
                                                    request.ridestatus !== "accepted" && (
                                                        <button onClick={() => handleCancelRide(request._id)}>
                                                            Cancel Ride
                                                        </button>
                                                    )}
                                                {request.rideDetails?.status === "completed" &&
                                                    request.rideDetails?.paymentStatus !== "paid" && (
                                                        <button onClick={() => handlePayment(request)}>
                                                            Pay Now
                                                        </button>
                                                    )}

                                                {request.rideDetails?.status === "completed" &&
                                                    request.paymentStatus === "paid" && (
                                                        <span className="paid-label">Paid</span>
                                                    )}
                                                {request.ridestatus === "accepted" && (
                                                    <button onClick={() => {
                                                        const rideId = request.rideDetails?._id;
                                                        const senderId = userId;
                                                        const receiverId = request.rideDetails?.driverId?._id;
                                                        const receiverName = request.rideDetails?.driverId?.userName

                                                        console.log("Opening chat with:");
                                                        console.log("Ride ID:", rideId);
                                                        console.log("senderId ID:", senderId);
                                                        console.log("receiverId ID:", receiverId);

                                                        setSelectedChatInfo({ rideId, receiverId, receiverName });
                                                    }}>
                                                        Message
                                                    </button>
                                                )}
                                            </>
                                        )}
                                </div>
                            </div>
                        </div>
                    ))
                    )}
                </div>

                {/* Right Side – Chat Section */}
                <div className="userRideRequest-chat">
                    <div className="userRideRequest-chat-card">
                        <div className="userRide-messages">
                            {selectedChatInfo ? (
                                <ChatBoxPage
                                    rideId={selectedChatInfo.rideId}
                                    receiverId={selectedChatInfo.receiverId}
                                    receiverName={selectedChatInfo.receiverName}
                                />
                            ) : (
                                <p>Select a ride request to start chatting</p>
                            )}
                        </div>
                    </div>
                </div>
            </div >
        </>
    );

}
