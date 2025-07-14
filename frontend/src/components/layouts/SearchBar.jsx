import React, { useEffect, useRef, useState } from 'react'
import "../../assets/searchbar.css"

export const SearchBar = ({ from, to, date, passengers, setFrom, setTo, setDate, setPassengers, onSearch }) => {

    const [fromSuggestions, setFromSuggestions] = useState([]);
    const [toSuggestions, setToSuggestions] = useState([]);
    const [showFromSuggestions, setShowFromSuggestions] = useState(false);
    const [showToSuggestions, setShowToSuggestions] = useState(false);

    const isTypingFrom = useRef(false);
    const isTypingTo = useRef(false);

    useEffect(() => {
        if (!window.google) return;
        const autocompleteService = new window.google.maps.places.AutocompleteService();

        if (isTypingFrom.current && from) {
            autocompleteService.getPlacePredictions({ input: from }, (predictions) => {
                if (predictions) {
                    setFromSuggestions(predictions.map(p => p.description));
                    setShowFromSuggestions(true);
                }
            });
        } else {
            setFromSuggestions([]);
            setShowFromSuggestions(false);
        }

        if (isTypingTo.current && to) {
            autocompleteService.getPlacePredictions({ input: to }, (predictions) => {
                if (predictions) {
                    setToSuggestions(predictions.map(p => p.description));
                    setShowToSuggestions(true);
                }
            });
        } else {
            setToSuggestions([]);
            setShowToSuggestions(false);
        }
    }, [from, to]);

    const handleFromSelect = (suggestion) => {
        const city = suggestion.split(',')[0];
        setFrom(city);
        setFromSuggestions([]);
        setShowFromSuggestions(false);
        isTypingFrom.current = false;
    };

    const handleToSelect = (suggestion) => {
        const city = suggestion.split(',')[0];
        setTo(city);
        setToSuggestions([]);
        setShowToSuggestions(false);
        isTypingTo.current = false;
    };
    const handleInputChange = (e, setter, setSuggestions, setShow, typingRef) => {
        setter(e.target.value);
        setSuggestions([]);
        setShow(true);
        typingRef.current = true;
    };

    return (
        <>

            <div className="search-bar-container">
                <div className="search-bar">
                    <div className="input-group">
                        <span className="circle-icon">⚪</span>
                        <input
                            type="text"
                            placeholder="Leaving from"
                            value={from}
                            onChange={(e) => handleInputChange(e, setFrom, setFromSuggestions, setShowFromSuggestions, isTypingFrom)}
                            onFocus={() => setShowFromSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowFromSuggestions(false), 100)}
                        />
                        {showFromSuggestions && fromSuggestions.length > 0 && (
                            <ul className="suggestions-list">
                                {fromSuggestions.map((suggestion, idx) => (
                                    <li key={idx} onMouseDown={() => handleFromSelect(suggestion)}>
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <button className="swap-btn">⇆</button>

                    <div className="input-group">
                        <span className="circle-icon">⚪</span>
                        <input
                            type="text"
                            placeholder="Going to"
                            value={to}
                            onChange={(e) => handleInputChange(e, setTo, setToSuggestions, setShowToSuggestions, isTypingTo)}
                            onFocus={() => setShowToSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowToSuggestions(false), 100)}
                        />
                        {showToSuggestions && toSuggestions.length > 0 && (
                            <ul className="suggestions-list">
                                {toSuggestions.map((suggestion, idx) => (
                                    <li key={idx} onMouseDown={() => handleToSelect(suggestion)}>
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="input-group">
                        <span className="icon">📅</span>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                        />
                    </div>

                    <div className="input-group">
                        <span className="icon">👤</span>
                        <input
                            type="number"
                            min="1"
                            value={passengers}
                            onChange={(e) => setPassengers(e.target.value)}
                        />
                    </div>

                    <button className="search-btn" onClick={onSearch}>Search</button>
                </div>
            </div>
        </>
    )
}
