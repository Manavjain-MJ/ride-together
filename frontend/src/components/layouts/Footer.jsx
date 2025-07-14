import React, { useState } from 'react'
import "../../assets/footer.css"

export const Footer = () => {
    const [language, setLanguage] = useState("English (India)");
    const destinations = [
        { from: "New Delhi", to: "Chandigarh" },
        { from: "New Delhi", to: "Jaipur" },
        { from: "New Delhi", to: "Agra" }
    ];
    return (
        <div>
            <section>
                <div className='footer-main'>
                    <footer className="footer">
                        <div className="footer-container">
                            {/* About Section */}
                            <div className="footer-section">
                                <h3>About</h3>
                                <ul>
                                    {/* <li><a href="#">How RideTogether Works</a></li> */}
                                    <li><a href="#">About Us</a></li>
                                    <li><a href="#">Our Mission</a></li>
                                    <li><a href="#">Safety & Security</a></li>
                                    <li><a href="#">Help Centre</a></li>
                                </ul>
                            </div>

                            {/* Language & Social Media */}
                            <div className="footer-right">
                                <div className="language-selector">
                                    {/* <button className="language-button">
                                        Language - {language}
                                    </button> */}
                                </div>

                                <div className="social-icons">
                                    <a href="#"><i className="fab fa-facebook"></i></a>
                                    <a href="#"><i className="fab fa-x-twitter"></i></a>
                                    <a href="#"><i className="fab fa-youtube"></i></a>
                                    <a href="#"><i className="fab fa-instagram"></i></a>
                                </div>
                            </div>
                        </div>
                    </footer>
                    {/* Bottom Bar */}
                    <div className="footer-bottom">
                        <a href="/termsandconditions">Terms and Conditions</a>
                        <div className="footer-brand">
                            {/* <img src="/logo.png" alt="RideTogether Logo" className="footer-logo" /> */}
                            <p>RideTogether, 2025 ©</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
