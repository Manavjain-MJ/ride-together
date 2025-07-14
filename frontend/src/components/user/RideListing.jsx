import React, { useEffect, useState } from 'react'
import "../../assets/ridelisting.css"
import "../../assets/searchBar.css"
import { Navbar } from '../layouts/Navbar';
import { FaClock, FaFilter, FaHourglassHalf, FaMoneyBillWave, FaWalking } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { SearchBar } from '../layouts/SearchBar';



export const RideListing = () => {
  const [rideLists, setRideLists] = useState([]);
  const [selectedSort, setSelectedSort] = useState("");
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [filteredRides, setFilteredRides] = useState(rideLists);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const navigate = useNavigate();

  const toggleTimeSelection = (time) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const convertToDateFormat = (date) => {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`;
  };

  const fetchRidesList = async () => {
    if (!from || !to || !date || passengers <= 0) {
      setRideLists([]);
      setValidationError("Please fill in all the fields before searching.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const formattedDate = convertToDateFormat(date);
      const res = await axios.get(`/liveride/searchrides`, {
        params: {
          startLocation: from.trim().toLowerCase(),
          destination: to.trim().toLowerCase(),
          date: formattedDate
        }
      });
      setRideLists(res.data.data);
      setSearchPerformed(true);
      console.log("API Response:", res.data);
    } catch (err) {
      setError("Failed to fetch rides. Please try again.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (from && to && date) {
      fetchRidesList();
    }
  }, [from, to, date]);

  useEffect(() => {
    let filtered = [...rideLists];
    if (selectedSort) {
      switch (selectedSort) {
        case 'Earliest Departure':
          filtered = filtered.sort((a, b) => new Date(a.departureTime) - new Date(b.departureTime));
          break;
        case 'Shortest Duration':
          filtered = filtered.sort((a, b) => a.duration - b.duration);
          break;
        case 'Lowest Price':
          filtered = filtered.sort((a, b) => a.pricePerSeat - b.pricePerSeat);
          break;
        default:
          break;
      }
    }

    // Filter by departure time
    if (selectedTimes.length > 0) {
      filtered = filtered.filter((ride) => {
        const departureTime = new Date(ride.departureTime);
        if (selectedTimes.includes('Before 06:00') && departureTime.getHours() < 6) return true;
        if (selectedTimes.includes('06:00 - 12:00') && departureTime.getHours() >= 6 && departureTime.getHours() < 12) return true;
        if (selectedTimes.includes('12:01 - 18:00') && departureTime.getHours() >= 12 && departureTime.getHours() < 18) return true;
        return false;
      });
    }
    setFilteredRides(filtered);
  }, [rideLists, selectedSort, selectedTimes]);

  return (
    <>
      <Navbar />
      <SearchBar
        from={from}
        to={to}
        date={date}
        passengers={passengers}
        setFrom={setFrom}
        setTo={setTo}
        setDate={setDate}
        setPassengers={setPassengers}
        onSearch={fetchRidesList}
      />

      {validationError && !from && !to && !date && (
        <p className="error-message" style={{ textAlign: "center" }}>
          {validationError}
        </p>
      )}
      {searchPerformed && filteredRides.length === 0 && !isLoading && !error && (
        <p style={{ textAlign: "center" }}>No rides found.</p>
      )}

      {from && to && date && !isLoading && rideLists.length > 0 ? (
        <div className="ride-container">
          {/* <button className="filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
          <FaFilter /> Filters
        </button> */}
          {/* Filters Sidebar */}
          {/* <div className={`filters ${showFilters ? "open" : ""}`}> */}
          {/* <button className="close-btn" onClick={() => setShowFilters(false)}>✖</button> */}
          {/* <h3>Filters</h3> */}
          {/* Left Side - Filters */}
          <div className="filters">
            <div className="sort-section">
              <button
                className="clear-button"
                onClick={() => {
                  setSelectedSort("");
                  setSelectedTimes([]);
                }}
              >
                Clear All
              </button>
              <h3>Sort by</h3>
              {[
                { label: "Earliest Departure", icon: <FaClock /> },
                { label: "Shortest Duration", icon: <FaHourglassHalf /> },
                { label: "Lowest Price", icon: <FaMoneyBillWave /> },
              ].map(({ label, icon }) => (
                <label key={label} className="filter-option">
                  <input
                    type="radio"
                    name="sort"
                    value={label}
                    checked={selectedSort === label}
                    onChange={() => setSelectedSort(label)}
                  />
                  <span className="radio-custom"></span>
                  {label}
                  <span className="icon">{icon}</span>
                </label>
              ))}
            </div>
            <hr />
            <h3>Departure time</h3>
            {["Before 06:00", "06:00 - 12:00", "12:01 - 18:00"].map((time) => (
              <label key={time} className="departure-option">
                <input
                  type="checkbox"
                  checked={selectedTimes.includes(time)}
                  onChange={() => toggleTimeSelection(time)}
                />
                <span className="checkbox-custom"></span>
                {time}
              </label>
            ))}
          </div>
          {/* </div> */}
          {/* Right Side - Ride Listings */}
          <div className="rides">
            {isLoading ? (
              <p>Loading rides...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : (
              filteredRides?.map((ride) => {
                return (
                  <div key={ride._id} className={`ride-card ${ride.seatsAvailable === 0 ? 'disabled' : ''}`}
                    onClick={() => {
                      if (ride.seatsAvailable > 0) {
                        navigate(`/ridedetails/${ride._id}`);
                      }
                    }}>
                    <div className="ride-info">
                      <span className="time" style={{ fontWeight: "600" }}>
                        {/* {ride.departureTime ? new Date(ride.departureTime).toISOString().split("T")[0]:"N/A"}  */}
                        {ride.departureTime ? (() => {
                          const date = new Date(ride.departureTime);
                          const day = String(date.getDate()).padStart(2, '0');
                          const month = String(date.getMonth() + 1).padStart(2, '0');
                          const year = date.getFullYear();
                          return `${day}-${month}-${year}`;
                        })() : "N/A"}
                      </span>
                      <h4>{ride.startLocation} → {ride.destination}</h4>
                      <div className="price">₹{ride.pricePerSeat}.00</div>
                      {ride.seatsAvailable === 0 && (
                        <div style={{ color: 'red', fontWeight: 'bold' }}>No seats available</div>
                      )}
                    </div>
                    {/* Divider Line */}
                    <hr className="ride-divider" />
                    <div className="driver-info">
                      <i className="fas fa-user driver-avatar"></i>
                      <div className="driver-rating">
                        <span>{ride.driverId?.userName}</span>
                        {/* <span className="rating">⭐ {ride.driverId?.rating}</span> */}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div >
      ) : null}
    </>
  )
}
