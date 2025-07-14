import React from 'react'
import "../../assets/termsandconditions.css"
import { Footer } from '../layouts/Footer'
import { Navbar } from '../layouts/Navbar'

export const TermsAndConditions = () => {
    return (
        <>
        <Navbar/>
        <div className="terms-container">
            <h1 className="terms-title">Terms and Conditions</h1>
            <div className="terms-content">
                <p>
                    Welcome to Ride-Together. By accessing or using our platform, you agree to the following
                    terms and conditions. Please read them carefully.
                </p>

                <h2>1. User Accounts</h2>
                <p>
                    Users must provide accurate and complete information when registering. You are responsible
                    for maintaining the confidentiality of your account and password.
                </p>

                <h2>2. Ride Sharing</h2>
                <p>
                    Drivers are responsible for the accuracy of their ride details. Passengers must respect
                    the driver’s rules and schedules. Ride-Together is not responsible for personal disputes
                    or conduct between users.
                </p>

                <h2>3. Payments</h2>
                <p>
                    All payments made through the platform are final unless otherwise specified. Drivers set
                    their own prices, and Ride-Together may charge a service fee.
                </p>

                <h2>4. Cancellations</h2>
                <p>
                    Cancellations should be made in advance. Frequent cancellations may result in temporary or
                    permanent suspension of your account.
                </p>

                <h2>5. Safety and Behavior</h2>
                <p>
                    Users must behave respectfully and lawfully. Abuse, harassment, or unsafe conduct will not
                    be tolerated and may lead to suspension or legal action.
                </p>

                <h2>6. Liability</h2>
                <p>
                    Ride-Together acts only as a platform for connecting drivers and passengers. We are not
                    liable for accidents, losses, or damages resulting from ride-sharing.
                </p>

                <h2>7. Changes to Terms</h2>
                <p>
                    We reserve the right to update these terms at any time. Continued use of the platform
                    means you accept any revised terms.
                </p>

                <p>
                    By using Ride-Together, you confirm that you agree to abide by these terms and conditions.
                    If you do not agree, please do not use our services.
                </p>
            </div>
        </div>
        <Footer/>
        </>
    )
}
