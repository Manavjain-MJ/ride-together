import axios from 'axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import "../../assets/resetpassword.css"
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { Bounce, toast, ToastContainer } from 'react-toastify'

export const ResetPassword = () => {

    const token = useParams().token
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const onSubmit = async (data) => {
        const obj = {
            token: token,
            password: data.password
        }
        try {
            const res = await axios.post("/ride/resetpassword", obj)
            if (res.data.message) {
                toast('😁 Password Updated Successfully!', {
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
            }
            setTimeout(() => {
                navigate("/login")
            }, 3000)

        } catch (error) {
            console.error(error.response?.data || error.message)
            alert("Failed to reset your password")
        }
        console.log(res.data)
    }
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
            <div className="reset-password-wrapper">
                <div className="reset-password-container">
                    <h2>Reset Your Password</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="reset-form">
                        <label>New Password</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Minimum 6 characters required" },
                                })}
                                placeholder="Enter new password"
                            />
                            <span className="eye-icon" onClick={togglePasswordVisibility}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        {errors.password && <p className="error-message">{errors.password.message}</p>}

                        <button type="submit" className="reset-btn">Reset Password</button>
                    </form>
                </div>
            </div>
        </>
    )
}
