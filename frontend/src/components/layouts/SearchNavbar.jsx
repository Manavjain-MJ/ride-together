import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import "../../assets/searchnavbar.css"
import { SearchBar } from './SearchBar';
import { AuthContext } from '../common/AuthContext';

export const SearchNavbar = () => {
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem("isLoggedIn");
        localStorage.clear();

        setIsLoggedIn(false);

        window.location.reload();
    };
    return (
        <>
            <nav className="navbar">
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        🚗 RideTogether
                    </Link>

                    <button className="navbar-toggler">
                        <span className="toggler-icon">&#9776;</span>
                    </button>

                    <div className="nav-links">
                        <ul className="nav-menu">
                            <li>
                                <Link className="nav-link" to="/ridelisting">Find Rides</Link>
                            </li>
                            <li>
                                <Link className="nav-link" to="/rideposting">Offer a Ride</Link>
                            </li>

                            {isLoggedIn ? (
                                <>
                                    <li>
                                        <Link className="nav-link profile-link" to="/userprofile">👤 </Link>
                                    </li>
                                    <li>
                                        <button
                                            className="nav-button logout-btn"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link className="nav-button" to="/signup">Signup</Link>
                                    </li>
                                    <li>
                                        <Link className="nav-button" to="/login">Login</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

        </>
    )
}
