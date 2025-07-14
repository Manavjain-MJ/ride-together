import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import "../../assets/usergovtprofile.css"
import { FaChevronRight } from 'react-icons/fa';
import { Navbar } from '../layouts/Navbar';



const idRegexMap = {
    Aadhaar: /^[2-9]{1}[0-9]{11}$/,
    PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    DL: /^[A-Z]{2}[0-9]{13}$/,
};

export const UserGovtProfile = () => {
    const [selectedType, setSelectedType] = useState('');
    const [savedIds, setSavedIds] = useState([]);
    const userId = localStorage.getItem('id');
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        fetchSavedIds();
    }, []);

    const fetchSavedIds = async () => {
        try {
            const res = await axios.get(`/profile/govtid/${userId}`);
            setSavedIds(res.data.govtIds || []);
        } catch (err) {
            console.error('Error fetching saved IDs:', err);
        }
    };

    const onSubmit = async (data) => {
        try {
            const res = await axios.post(`/profile/govtid/${userId}`, data);
            setSelectedType('');
            reset();
            fetchSavedIds();
        } catch (err) {
            console.error('Error submitting ID:', err);
        }
    };

    const handleEdit = (idType, value) => {
        setSelectedType(idType);
        setValue('type', idType);
        setValue('value', value);
    };

    const handleDelete = async (type) => {
        try {
            await axios.delete(`/profile/govtid/${userId}/${type}`);
            fetchSavedIds();
        } catch (err) {
            console.error('Error deleting ID:', err);
        }
    };

    const idOptions = [
        { type: "Aadhaar", label: "Aadhaar Card" },
        { type: "PAN", label: "PAN Card" },
        { type: "DL", label: "Driving License" },
    ]

    return (
        <>
        <Navbar/>
            <div className="govtid-container">
                <h2 className="govtid-title">Which document would you like to verify?</h2>
                <p className="govtid-note">
                    Please select a document and enter its ID number.
                </p>

                <div className="govtid-options-list">
                    {idOptions.map((option) => {
                        const isSaved = savedIds.some((id) => id.type === option.type);
                        const isSelected = selectedType === option.type;

                        return (
                            <div
                                key={option.type}
                                className={`govtid-option-item ${isSelected ? "selected" : ""} ${isSaved ? "disabled" : ""}`}
                                onClick={() => !isSaved && setSelectedType(option.type)}
                            >
                                <div className="govtid-option-title">{option.label}</div>
                                <FaChevronRight className="govtid-chevron" />
                            </div>
                        );
                    })}
                </div>

                {selectedType && (
                    <form className="govtid-form" onSubmit={handleSubmit(onSubmit)}>
                        <input type="hidden" {...register("type")} value={selectedType} />
                        <label htmlFor="value" className="govtid-form-label">
                            Enter {selectedType} Number
                        </label>
                        <input
                            type="text"
                            className="govtid-input"
                            placeholder={`Enter ${selectedType} number`}
                            {...register("value", {
                                required: `${selectedType} number is required`,
                                pattern: {
                                    value: idRegexMap[selectedType],
                                    message: `Invalid ${selectedType} number`,
                                },
                            })}
                        />
                        {errors.value && <p className="error-msg">{errors.value.message}</p>}
                        <button type="submit" className="govtid-submit-btn">
                            Submit
                        </button>
                    </form>
                )}

                {savedIds.length > 0 && (
                    <div className="saved-id-section">
                        <h3>Submitted IDs</h3>
                        <ul className="saved-id-list">
                            {savedIds.map((id) => (
                                <li key={id.type} className="saved-id-item">
                                    <div>
                                        <strong>{id.type}:</strong> {id.value}
                                    </div>
                                    <div className="actions">
                                        <button onClick={() => handleEdit(id.type, id.value)}>Edit</button>
                                        <button onClick={() => handleDelete(id.type)}>Delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </>
    )
}
