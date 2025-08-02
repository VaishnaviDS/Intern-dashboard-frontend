import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './userProfile.css';
import { server } from '../../main';
const UserProfile = () => {
  const { referralCode } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserHistory = async () => {
      try {
        const res = await axios.get(`${server}/api/user/history/${referralCode}`);
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUserHistory();
  }, [referralCode]);

  if (!user) return <p>Loading user details...</p>;

  return (
    <div className="user-profile">
      <h2>{user.name}'s Profile</h2>
      <p><strong>Email:</strong>{user.email}</p>
      <p><strong>Referral Code:</strong> {user.referralCode}</p>
      <p><strong>Total Donations:</strong> ₹{user.totalDonations}</p>
      <p><strong>Rewards:</strong> {user.rewards?.join(', ') || '—'}</p>

      <h3>Donation History</h3>
      <ul>
        {user.donationHistory && user.donationHistory.length > 0 ? (
          user.donationHistory.map((donation, idx) => (
            <li key={idx}>
              ₹{donation.amount} on {new Date(donation.date).toLocaleDateString()}
            </li>
          ))
        ) : (
          <p>No donations found.</p>
        )}
      </ul>

      <Link to="/dashboard">⬅ Back to Dashboard</Link>
    </div>
  );
};

export default UserProfile;
