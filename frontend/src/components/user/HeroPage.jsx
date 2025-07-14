import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import "../../assets/heropage.css"
import { Footer } from '../layouts/Footer';
import { Navbar } from '../layouts/Navbar';

export const HeroPage = () => {
  const [language, setLanguage] = useState("English (India)");
  const destinations = [
    { from: "New Delhi", to: "Chandigarh" },
    { from: "New Delhi", to: "Jaipur" },
    { from: "New Delhi", to: "Agra" }
  ];
  const faqs = [
    {
      question: "What is the main goal of Ride-together?",
      answer:
        "Ride-Together is designed to connect drivers and passengers traveling in the same direction to make transportation more affordable, convenient, and sustainable. It helps reduce the number of vehicles on the road, lowering fuel costs and carbon emissions while promoting shared mobility.",
    },
    {
      question: "Who can use the Ride-Together app?",
      answer:
        "Both drivers and passengers can use the app. Drivers can post available rides by setting their route and available seats, while passengers can search and book rides that match their schedule and destination. The platform is built for urban and intercity commuters alike.",
    },
    {
      question: "How does Ride-Together ensure safety?",
      answer:
        "Safety is a top priority on Ride-Together. All users must create verified profiles, and both passengers and drivers can leave ratings and reviews. The app also includes real-time GPS tracking and secure in-app communication to enhance trust and transparency.",
    },
    {
      question: "What are the benefits of using this app?",
      answer:
        "Using Ride-Together helps reduce travel expenses, traffic congestion, and your environmental footprint. It also offers a more social and enjoyable commuting experience by allowing users to connect with others heading the same way, all while ensuring ease of use and reliability.",
    },
  ];

  const [expanded, setExpanded] = useState(null);
  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
  };
  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="home-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className='hero-image'>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          {/* <h2>Ride Smarter, Save More, Go Greener!</h2> */}
          <div className="features">
            <div className="feature-box">
              <h1>🤝</h1>
              <h3>Ride Smart, Ride Together</h3>
              <p>Connect with reliable riders and make every trip more affordable. Share the journey, cut costs, and enjoy the ride!</p>
            </div>
            <div className="feature-box">
              <h1>🌱</h1>
              <h3>Eco-Friendly & Wallet-Friendly</h3>
              <p>Reduce your carbon footprint while saving money. Every shared ride helps build a greener and more sustainable future!</p>
            </div>
            <div className="feature-box">
              <h1>⚡</h1>
              <h3> Fast, Safe & Convenient</h3>
              <p>Find trusted ride partners in seconds. Enjoy a smooth, secure, and hassle-free travel experience!</p>
            </div>
            {/* <div className="feature-box">
          <span>🔔</span>
          <h3>Smart Reminders</h3>
          <p>Stay on track with real-time notifications and alerts.</p>
        </div> */}
          </div>
        </section>
        <section>
          <div className='blockmain'>
            <div className='block1'>
            </div>
            <div className='block2'>
              <h2>Your Safety, Our Priority</h2>
              <p style={{ margin: "35px 0px" }}>At RideTogether, we are committed to making your ride-sharing experience safe and reliable.We want you to stay informed about potential risks and how to avoid them.</p>
              {/* <button className='learn-more'>Learn More</button> */}
            </div>
          </div>
        </section>
        <section>
          <div className='driving'>
            <div className='driving-block2'>
              <h2>Hitting the road soon?</h2>
              <p style={{ margin: "35px 0px" }}>Make your trip smarter share your ride and save more on the journey!</p>
              <Link to="/vehicledetails"><button className='offer'>Offer A Ride</button></Link>
            </div>
            <div className='driving-block1'>
            </div>
          </div>
        </section >
        <section>
          <hr />
          {/* <div className='freq-places'>
            <div className="freq-container">
              <h2 className="heading">Where’s Your Next Ride?</h2>
              <div className="button-container">
                {destinations.map((route, index) => (
                  <button key={index} className="destination-button">
                    {route.from} → {route.to}
                  </button>
                ))}
              </div>
              <a href="#" className="link">See our most popular rides</a>
            </div>
          </div> */}
        </section>
        <section>
          <div>
            <div className="help-centre">
              <h1 className="title">Ride-Together Help Centre</h1>
              <div className="faq-container">
                {faqs.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <h3 className="faq-question">{faq.question}</h3>
                    <p className="faq-answer">
                      {faq.answer}
                      {expanded === index && <span className="faq-more"> {faq.more}</span>}
                    </p>
                    {/* <button className="read-more" onClick={() => toggleExpand(index)}>
                      {expanded === index ? "" : "Read more"}
                    </button> */}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="read-button-container">
            {/* <button className="help-button">Read our Help Centre</button> */}
          </div>
        </section>
        <section>
          <Footer />
        </section>
      </div >
    </>
  )
}
