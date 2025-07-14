import React, { useContext, useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import "../../assets/userprofile.css"
import axios from 'axios';
import { Navbar } from '../layouts/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../common/AuthContext';
import { toast } from 'react-toastify';



export const UserProfile = () => {
    const [activeTab, setActiveTab] = useState("about");
    const [userProfile, setUserProfile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [miniBio, setMiniBio] = useState("");
    const [showBioInput, setShowBioInput] = useState(false);
    const [userRides, setUserRides] = useState([]);
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;
    // console.log("User ID:", userId);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await axios.get(`/profile/userprofile/${userId}`);
                console.log("User Profile Data:", res.data.data);
                setUserProfile(res.data.data);
                setMiniBio(res.data.data?.miniBio || "");
                // setShowBioInput(!res.data.data?.miniBio);
            } catch (error) {
                console.error(" Error fetching user profile:", error);
            }
        };

        // const fetchUserRides = async () => {
        //     try {
        //         const res = await axios.get(`/rides/myrides/${userId}`); 
        //         setUserRides(res.data.rides || []);
        //     } catch (error) {
        //         console.error("Error fetching user rides:", error);
        //     }
        // };

        fetchUserProfile();
        // fetchUserRides();

    }, [userId]);

    const updateProfile = async (bioText = "", file = null) => {
        const formData = new FormData();
        if (bioText.trim()) formData.append("miniBio", bioText.trim());
        if (file) formData.append("profile", file);

        setUploading(true);

        try {
            const res = await axios.put(`/profile/updateprofile/${userId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setUserProfile(res.data.data);
            setMiniBio(res.data.data?.miniBio || "");
            setShowBioInput(false);
            aleart("Profile updated successfully!");
        } catch (error) {
            console.error("Failed to update profile:", error);
            // toast.error("Profile update failed.");
        } finally {
            setUploading(false);
        }
    };



    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);

        const formData = new FormData();
        formData.append("profile", file);

        try {
            const res = await axios.put(
                `/profile/updateprofile/${userId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setUserProfile(res.data.data);
            // setUserProfile(updatedProfile);
            setUploading(false);
        } catch (error) {
            console.error("Image upload failed:", error);
            setUploading(false);
        }
        // console.log(res.data.data)       
    };
    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem("isLoggedIn");
        localStorage.clear();

        setIsLoggedIn(false);

        window.location.href = "/login";
    };

    const handleCloseAccount = async () => {
        const confirm = window.confirm(
            "Are you sure you want to close your account? This action cannot be undone!"
        );
        if (!confirm) return;

        try {
            const res = await axios.delete(`/profile/closemyaccount/${userId}`);
            toast.success("Account Closed successfully!");
            localStorage.clear();
            setTimeout(() => {
                navigate("/"); 
            }, 1500);
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Failed to delete account. Try again."
            );
        }
    };

    return (
        <>
            <Navbar />
            <div className={`user-profile-container ${activeTab === 'about' ? 'about-active' : 'account-active'}`}>
                <div className="tabs">
                    <div
                        className={`tab ${activeTab === "about" ? "active" : ""}`}
                        onClick={() => setActiveTab("about")}
                    >
                        About you
                    </div>
                    <div
                        className={`tab ${activeTab === "account" ? "active" : ""}`}
                        onClick={() => setActiveTab("account")}
                    >
                        Account
                    </div>
                </div>

                {activeTab === "about" && (
                    <div className="tab-content about-tab">
                        <div className="user-display-card">
                            <div className="user-avatar">
                                {uploading ? (
                                    <span className="uploading-text">Uploading...</span>
                                ) : userProfile?.profilePicture && !imgError ? (
                                    <img
                                        src={userProfile.profilePicture}
                                        alt="Profile"
                                        className="avatar-img"
                                        onError={() => setImgError(true)}
                                    />
                                ) : (
                                    <i className="fas fa-user avatar-placeholder"></i>
                                )}
                            </div>
                            <div className="user-info">
                                <div className="user-name">
                                    {userProfile?.userId?.userName || "User Name"}
                                </div>
                                <div className="user-role">{userProfile?.userId?.userType || "User Name"}</div>
                            </div>
                            {/* <div className="user-chevron">
                                <i className="fas fa-chevron-right"></i>
                            </div> */}
                        </div>

                        <div className="section">
                            <div className="section-item">
                                <FaPlus />
                                <label htmlFor="profile-upload" className="profile-upload-label" style={{ cursor: "pointer" }}>
                                    Add profile picture
                                </label>
                                <input
                                    type="file"
                                    id="profile-upload"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={handleImageUpload}
                                />
                            </div>
                            {/* <div className="section-item"><Link to="/usereditprofile" className='edit-details'>Edit personal details</Link></div> */}
                        </div>

                        <hr className='partition' />

                        <div className="section">
                            <h3>Verify your profile</h3>
                            <Link to="/usergovtid" style={{ textDecoration: "none" }}>
                                <div className="section-item">
                                    <FaPlus className="plus-icon" />
                                    Verify your Govt. ID
                                </div>
                            </Link>
                            {/* <div className="section-item">
                                <FaPlus />
                                Confirm email {userProfile?.userId?.email || "youremail@example.com"}
                            </div> */}
                        </div>

                        <hr className="divider" />

                        <div className="section">
                            <h3>About you</h3>
                            {/* {!userProfile?.miniBio && !showBioInput && (
                                <div className="section-item" onClick={() => setShowBioInput(true)} style={{ cursor: "pointer" }}>
                                    <FaPlus />
                                    <span style={{ marginLeft: "8px" }}>Add a mini bio</span>
                                </div>
                            )}

                            {showBioInput && (
                                <div className="mini-bio-form-wrapper">
                                    <h2 className="mini-bio-heading">What would you like other members to know about you?</h2>
                                    <textarea
                                        className="mini-bio-textarea"
                                        value={miniBio}
                                        onChange={(e) => setMiniBio(e.target.value)}
                                        placeholder='Example: "I\ m a student at Delhi University, and I often visit friends in Jaipur. I love photography and rock music."'
                                    />
                                    {miniBio.length > 0 && miniBio.length < 10 && (
                                        <p style={{ color: "red", marginBottom: "10px" }}>Bio must be at least 10 characters.</p>
                                    )}
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <button
                                            className="save-bio-btn"
                                            onClick={async () => {
                                                if (miniBio.length >= 10) {
                                                    await updateProfile(miniBio);
                                                    console.log("Mini bio submitted:", miniBio); // 👈 after successful update
                                                }
                                            }}
                                            disabled={miniBio.length < 10}
                                        >
                                            Save
                                        </button>
                                        <button
                                            className="save-bio-btn"
                                            style={{ backgroundColor: "#ddd", color: "#000" }}
                                            onClick={() => {
                                                setMiniBio("");
                                                setShowBioInput(false);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )} */}
                            <Link to="/riderrequestrides" style={{ textDecoration: "none" }}>
                                <div className="section-item">
                                    <FaPlus />
                                    Ride Requests
                                </div>
                            </Link>
                            <Link to="/driverrides" style={{ textDecoration: "none" }}>
                                <div className="section-item">
                                    <FaPlus />
                                    Posted Rides
                                </div>
                            </Link>
                        </div>

                        {/* <hr className='partition' /> */}

                        {/* <div className="section">
                            <h3>Vehicles</h3>
                            <div className="section-item">
                                <FaPlus />
                                Add Vehicles
                            </div>
                        </div> */}
                    </div>
                )}

                {activeTab === "account" && (
                    <>
                        <div className="section">
                            <div className="section-item" onClick={handleLogout}>Log out</div>
                            <div className="section-item" onClick={handleCloseAccount}>Close my account</div>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}
