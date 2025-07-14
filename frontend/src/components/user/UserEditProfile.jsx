import React from 'react'
import "../../assets/usereditprofile.css"
import { useState } from 'react';
import { useEffect } from 'react';
import { FaUserEdit, FaEnvelope, FaPhone } from "react-icons/fa";
import { toast } from 'react-toastify';

export const UserEditProfile = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        mobile: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                fullName: initialData.fullName || "",
                email: initialData.email || "",
                mobile: initialData.mobile || "",
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.fullName.trim()) {
            toast.error("Full Name is required");
            return;
        }

        if (!validateEmail(formData.email)) {
            toast.error("Invalid email address");
            return;
        }

        if (formData.mobile.length !== 10) {
            toast.error("Mobile number must be 10 digits");
            return;
        }

        try {
            setIsSubmitting(true);
            await onSave(formData); // Passing to parent
            toast.success("Profile updated!");
        } catch (error) {
            toast.error("Failed to update profile");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="edit-profile-form animate-fade-slide">
            <h2 className="section-title"><FaUserEdit /> Edit Personal Details</h2>

            <form onSubmit={handleSubmit} className="form-wrapper">
                <label>
                    Full Name
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                    />
                </label>

                <label>
                    Email Address
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                    />
                </label>

                <label>
                    Mobile Number
                    <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="10-digit number"
                    />
                </label>

                <div className="form-btn-group">
                    <button type="submit" className="save-btn" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save"}
                    </button>
                    <button type="button" className="cancel-btn" onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}
