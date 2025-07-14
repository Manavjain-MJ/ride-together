import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import "../../assets/rideposting.css"
import { Navbar } from '../layouts/Navbar';
import { Footer } from '../layouts/Footer';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

export const RidePosting = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();
    const [isAutoAccept, setIsAutoAccept] = useState(false);
    const [allowVerifiedUsers, setAllowVerifiedUsers] = useState(false);
    const navigate = useNavigate();
    const [minDateTime, setMinDateTime] = useState("");


    useEffect(() => {
        const updateMinDateTime = () => {
            setMinDateTime(new Date().toISOString().slice(0, 16));
        };
        updateMinDateTime();
        const interval = setInterval(updateMinDateTime, 60000);
        return () => clearInterval(interval);
    }, []);


    const onSubmit = async (data) => {
        try {
            const vehicleId = localStorage.getItem("vehicleId");
            const user = JSON.parse(localStorage.getItem("user"));
            const driverId = user?.id
            if (!vehicleId || !driverId) {
                alert("Vehicle or User is not properly linked!");
                return;
            }

            const rideData = { ...data, vehicleId, driverId }
            const res = await axios.post("/liveride/addliveride", rideData)
            if (res.status === 201) {
                localStorage.removeItem("vehicleId");
                toast.success("Ride Posted Succesfully")
                // console.log("Ride Data:", res.data);
                navigate("/ridelisting");
            } else {
                alert("ride was not posted")

            }
        } catch (error) {
            console.log("error", error)
        }
        // navigate("/vehicledetails");
    };
    return (
        <>
            <Navbar />
            <ToastContainer position="top-right" autoClose={1500} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

            <div className="ride-posting-container">
                <h2>Post a Ride</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="ride-form">
                    {/* Ride Details */}
                    <label>Starting Location:</label>
                    <input
                        type="text"
                        {...register("startLocation", { required: "Starting location is required" })}
                        placeholder="Enter pickup location"
                    />
                    {errors.startLocation && <p className="error">{errors.startLocation.message}</p>}

                    <label>Destination:</label>
                    <input
                        type="text"
                        {...register("destination", { required: "Destination is required" })}
                        placeholder="Enter drop-off location"
                    />
                    {errors.destination && <p className="error">{errors.destination.message}</p>}

                    <label>Date & Time of Departure:</label>
                    <input
                        type="datetime-local"
                        {...register("departureTime", { required: "Departure time is required" })}
                        min={minDateTime}
                    />
                    {errors.departureTime && <p className="error">{errors.departureTime.message}</p>}

                    <label>Estimated Arrival Time (Optional):</label>
                    <input type="time" {...register("arrivalTime")} />

                    <label>Number of Available Seats:</label>
                    <input
                        type="number"
                        {...register("seatsAvailable", { required: "Seats are required", min: { value: 1, message: "At least 1 seat is required" } })}
                        placeholder="Seats available"
                    />
                    {errors.seats && <p className="error">{errors.seats.message}</p>}

                    <label>Ride Price Per Seat (₹):</label>
                    <input
                        type="number"
                        {...register("pricePerSeat", { required: "Price is required", min: { value: 1, message: "Price must be at least $1" } })}
                        placeholder="Enter price per seat"
                    />
                    {errors.pricePerSeat && <p className="error">{errors.pricePerSeat.message}</p>}

                    {/* <label>Ride Type:</label>
                    <select {...register("rideType")}>
                        <option value="one-time">One-time</option>
                        <option value="recurring">Recurring</option>
                    </select>

                    <label>Ride Description (Optional):</label>
                    <textarea {...register("rideDescription")} placeholder="Add any additional details"></textarea>

                    {/* Route Information *
                    <label>Via Locations (Optional Stops):</label>
                    <input
                        type="text"
                        {...register("viaLocations", {
                            pattern: { value: /^[a-zA-Z0-9, ]*$/, message: "Enter valid locations separated by commas" },
                        })}
                        placeholder="Enter via locations (comma-separated)"
                    />
                    {errors.viaLocations && <p className="error">{errors.viaLocations.message}</p>}

                    <label>Preferred Route:</label>
                    <select {...register("preferredRoute")}>
                        <option value="fastest">Fastest Route</option>
                        <option value="shortest">Shortest Route</option>
                        <option value="highway">Highway Preferred</option>
                    </select>

                    {/* Privacy & Settings *
                    <label>
                        <input
                            type="checkbox"
                            {...register("allowVerifiedUsers")}
                            checked={allowVerifiedUsers}
                            onChange={() => {
                                setAllowVerifiedUsers(!allowVerifiedUsers);
                                setValue("allowVerifiedUsers", !allowVerifiedUsers);
                            }}
                        />
                        Allow Only Verified Users
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            {...register("autoAccept")}
                            checked={isAutoAccept}
                            onChange={() => {
                                setIsAutoAccept(!isAutoAccept);
                                setValue("autoAccept", !isAutoAccept);
                            }}
                        />
                        Auto Accept Requests
                    </label>
                    <label>Contact Preference:</label>
                    <select {...register("contactPreference")}>
                        <option value="in-app">In-app Chat</option>
                        <option value="phone">Phone Call</option>
                        <option value="any">Any</option>
                    </select> */}

                    {/* Submit Button */}
                    <button type="submit"><Link to="/vehicledetails" />Post Ride</button>
                </form>
            </div>
            <Footer />
        </>
    )
}
