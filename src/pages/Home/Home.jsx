import React from 'react';
import './home.css';
import heroImg from '../../assets/i1.jpg'; 
import { useNavigate } from 'react-router-dom';
const features = [
  { title: "Live Leaderboard", desc: "Track top donors and real-time rankings.", icon: "🏆" },
  { title: "User Stats", desc: "Instant overview of users, donations, and rewards.", icon: "📊" },
  { title: "Interactive Charts", desc: "Visualize donation trends with dynamic graphs.", icon: "📈" },
  { title: "Profile Management", desc: "Users can view detailed personal donation history.", icon: "👤" },
  { title: "Smart Pagination", desc: "Easily navigate donation records by pages.", icon: "📄" },
  { title: "Real-Time Updates", desc: "Dashboard refreshes stats and charts every 10 seconds.", icon: "🔄" },
  { title: "Responsive Design", desc: "Looks great on all devices and screen sizes.", icon: "📱" },
  { title: "Reward System", desc: "Automatic reward allocation based on donations.", icon: "🎁" },
];

const Home = () => {
  const navigate=useNavigate();
  return (
<div className="home-container">
  <section className="hero-section">
    <div className="hero-content">
      <div className="hero-text">
        <h1>Empowering Change Through Data</h1>
        <p>Track donations, view live leaderboards, and reward top contributors — all in one dashboard.</p>
        <button onClick={() => navigate('/dashboard')}>Get Started</button>
      </div>
      <div className="hero-image">
        <img src={heroImg} alt="Donation Dashboard" />
      </div>
    </div>
  </section>

      <section className="features-section">
        {features.map((item, i) => (
          <div className="feature-card" key={i}>
            <div className="icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
