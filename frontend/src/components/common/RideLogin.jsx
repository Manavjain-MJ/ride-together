import React, { useContext } from 'react'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import "../../assets/ridelogin.css"
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { Navbar } from "../layouts/Navbar"
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export const RideLogin = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { setIsLoggedIn, setUser } = useContext(AuthContext);
    // const [loginData, setLoginData] = useState(null);
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);
    const [passwordValue, setPasswordValue] = useState("");
    // const [user, setUser] = useState(null);
    const togglePasswordVisibility = () => setShowPassword(prev => !prev);


    // const handleLogin = () => {
    //     setIsLoggedIn(true);
    //     localStorage.setItem("isLoggedIn", "true");
    //     setTimeout(() => {
    //         navigate("/");
    //         // window.location.reload();
    //     }, 500);
    // };

    const onSubmit = async (data) => {
        // setLoginData(data);
        try {
            // console.log("Login Data Submitted:", data);
            const res = await axios.post("/ride/login", data)
            // console.log(res.data)
            if (res.status == 200) {
                // alert("Login Success")
                toast('😁 Login Success!', {
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
                const user = {
                    id: res.data.data._id,
                    role: res.data.data.roleId.roleName,
                };
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("isLoggedIn", "true");
                // localStorage.setItem("id", res.data.data._id)
                // localStorage.setItem("role", res.data.data.roleId.roleName)

                setIsLoggedIn(true);
                setUser(user);
                setTimeout(() => {
                    const storedUser = JSON.parse(localStorage.getItem('user'));
                    if (storedUser) {
                        if (storedUser.role === "rider") {
                            navigate("/ridelisting")
                        }
                        else if (storedUser.role === "driver") {
                            navigate("/vehicledetails")
                        }
                    }
                }, 2000);
            } else {
                alert("Login Failed")

            }

        } catch (error) {
            toast.error("Login Failed! Please check your credentials.");
            console.error("Login Error:", error);
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
            <div className="auth-background">
                <div className="auth-container login">
                    <h2>Log In</h2>
                    {/* <p>Login to continue your RideTogether journey</p> */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input type="email" placeholder="Email" {...register("email", { required: true, pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ })} />
                        {errors.email && <span className="error">Email is required</span>}

                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={passwordValue}
                                // onChange={(e) => setPasswordValue(e.target.value)}
                                {...register("password", { required: true, minLength: 6, onChange: (e) => setPasswordValue(e.target.value) })}
                            />
                            {passwordValue && (
                                <span className="eye-icon" onClick={togglePasswordVisibility}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            )}
                        </div>
                        {errors.password && <span className="error">Password must be at least 6 characters</span>}

                        <button type="submit" className="auth-button">Login</button>
                    </form>
                    <p className="forgot-password">
                        <Link to="/forgetpassword">Forgot Password?</Link>
                    </p>
                    <p className="switch-auth">Don't have an account? <Link to="/signup">Sign Up</Link></p>
                </div>
            </div>
        </>
    )
}
