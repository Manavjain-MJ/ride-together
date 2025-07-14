import axios from 'axios'
import React, { useState } from 'react'
import { data, useNavigate } from 'react-router-dom'
import "../../assets/forgetpassword.css"
import { Bounce, toast, ToastContainer } from 'react-toastify'

export const ForgetPassword = () => {
    const [email, setEmail] = useState()
    const navigate = useNavigate()
    const onSubmit = async (data) => {
        data.preventDefault()

        try {
            const res = await axios.post("/ride/forgetpassword", { email })
            if (res.data.message) {
                toast('😁 Password reset link sent to your email!', {
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
            // console.error(error.response?.data || error.message)
            toast.error('User not found please register', {
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
            // alert("Failed to send email")
        }
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
            <div className="forgot-password-container">
                <div className="forgot-password-card">
                    <h2>Forgot Password</h2>
                    <p>Enter your email address below, and we'll send you a link to reset your password.</p>
                    <form onSubmit={onSubmit}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit">Send Reset Link</button>
                    </form>
                </div>
            </div>
        </>
    )
}
