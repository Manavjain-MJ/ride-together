import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import "../../assets/ridesignup.css"
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navbar } from '../layouts/Navbar';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export const RideSignup = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate()
    const [passwordValue, setPasswordValue] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword(prev => !prev);

    const userType = watch("userType", "rider");

    const onSubmit = async (data) => {
        const riderRoleId = "67c86417a357949d7d5d7400";
        const driverRoleId = "67c86430a357949d7d5d7402";
        const roleId = data.userType === "driver" ? driverRoleId : riderRoleId;
        const updatedData = { ...data, roleId };
        // console.log(data);
        setSubmitted(true);
        const res = await axios.post("/ride/signup", updatedData)
        // console.log(res.data)
        if (res.status === 201) {
            // alert("signup success")
            toast('😁 Signin Success!', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            setTimeout(() => {
                navigate("/login")

            }, 3000);
        } else {
            alert("invalid.....")
        }
    };


    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
            <Navbar />
            <div className="signup-container">
                <div className="signup-box">
                    <h2>Sign Up</h2>
                    {submitted ? <p className="success-msg">Signup Successful!</p> : null}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input type="text" placeholder="Full Name" {...register("userName", { required: true })} />
                        {errors.fullName && <span className="error">Full Name is required</span>}

                        <input type="email" placeholder="Email" {...register("email", { required: true, pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ })} />
                        {errors.email && <span className="error">Valid Email is required</span>}

                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                {...register("password", {
                                    required: true,
                                    minLength: 6,
                                    onChange: (e) => setPasswordValue(e.target.value),
                                })}
                            />
                            {passwordValue && (
                                <span className="eye-icon" onClick={togglePasswordVisibility}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            )}
                        </div>
                        {errors.password && (
                            <span className="error">Password must be at least 6 characters</span>
                        )}
                        <input type="text" placeholder="Phone Number" {...register("mobileNumber", { required: true, pattern: /[6-9]{1}[0-9]{9}/ })} />
                        {errors.phone && <span className="error">Enter a valid 10-digit phone number</span>}

                        <select {...register("userType", { required: true })}>
                            <option value="" >Select User Type</option>
                            <option value="rider">Rider</option>
                            <option value="driver">Driver</option>
                        </select>
                        {errors.userType && <span className="error">Please select a user type</span>}

                        {userType === "driver" && (
                            <>
                                <input type="text" placeholder="Vehicle Make & Model" {...register("vehicleModel", { required: true })} />
                                {errors.vehicle && <span className="error">Vehicle details are required</span>}

                                <input type="text" placeholder="License Plate Number" {...register("licensePlate", { required: true })} />
                                {errors.licensePlate && <span className="error">License plate is required</span>}
                            </>
                        )}

                        {/* <input type="text" placeholder="Pickup Location" {...register("pickup", { required: true })} />
                    {errors.pickup && <span className="error">Pickup location is required</span>}

                    <input type="text" placeholder="Destination" {...register("destination", { required: true })} />
                    {errors.destination && <span className="error">Destination is required</span>} */}

                        {/* <label> 
                        <input type="checkbox" {...register("terms", { required: true })} />
                        I agree to the terms and conditions
                    </label>
                    // {errors.terms && <span className="error">You must agree to the terms</span>} */}

                        <button type="submit">Sign Up</button>
                    </form>
                    <p className="login-link">Already have an account? <Link to="/login">Login</Link></p>
                </div>
            </div>
        </>
    )
}
