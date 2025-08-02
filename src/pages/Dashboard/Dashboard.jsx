import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './dashboard.css'
import { server } from '../../main';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 5;

const Dashboard = () => {
  const navigate = useNavigate();

  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalDonations: 0, totalRewardsDistributed: {} });
  const [chartData, setChartData] = useState([]);
  const [viewMode, setViewMode] = useState("days");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [page, setPage] = useState(0);

  const [fadeChart, setFadeChart] = useState(false);
  const [fadeStats, setFadeStats] = useState(false);
  const [fadeLeaderboard, setFadeLeaderboard] = useState(false);

  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get(`${server}/api/user/all`);
      const sorted = res.data
        .sort((a, b) => b.totalDonations - a.totalDonations)
        .map((user, index) => ({ ...user, rank: index + 1 }));
      setLeaderboard(sorted);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${server}/api/user/stats`);
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchChartData = async () => {
    setFadeChart(true);
    try {
      const res = await axios.get(
        `${server}/api/user/donations/aggregated/${viewMode}?month=${month}&year=${year}`
      );
      const filteredData = res.data?.filter(item => item.totalDonations > 0);
      setChartData(filteredData || []);
      setPage(0);
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setChartData([]);
    } finally {
      setFadeChart(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchLeaderboard();
    fetchStats();
    fetchChartData();
  }, []);

  useEffect(() => {
    fetchChartData();
  }, [viewMode, month, year]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const [leaderRes, statsRes, chartRes] = await Promise.all([
          axios.get(`${server}/api/user/all`),
          axios.get(`${server}/api/user/stats`),
          axios.get(`${server}/api/user/donations/aggregated/${viewMode}?month=${month}&year=${year}`)
        ]);

        const newLeaderboard = leaderRes.data.sort((a, b) => b.totalDonations - a.totalDonations).map((user, index) => ({
          ...user,
          rank: index + 1
        }));

        const filteredChartData = chartRes.data?.filter(item => item.totalDonations > 0) || [];

        const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

        if (!isEqual(newLeaderboard, leaderboard)) setLeaderboard(newLeaderboard);
        if (!isEqual(statsRes.data, stats)) setStats(statsRes.data);
        if (!isEqual(filteredChartData, chartData)) {
          setChartData(filteredChartData);
          setPage(0);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [viewMode, month, year, leaderboard, stats, chartData]);

  const renderMonthDropdown = () => (
    <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
      {[...Array(12)].map((_, i) => (
        <option key={i + 1} value={i + 1}>
          {new Date(0, i).toLocaleString('default', { month: 'long' })}
        </option>
      ))}
    </select>
  );

  const renderYearDropdown = () => {
    const currentYear = new Date().getFullYear();
    return (
      <select value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
        {[...Array(5)].map((_, i) => (
          <option key={i} value={currentYear - i}>
            {currentYear - i}
          </option>
        ))}
      </select>
    );
  };

  const paginatedData = chartData.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
  const hasNextPage = (page + 1) * ITEMS_PER_PAGE < chartData.length;
  const hasPrevPage = page > 0;
  const shouldPaginate = chartData.length > ITEMS_PER_PAGE;

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">📊 Intern Donation Dashboard</h2>

      {/* Top Section */}
      <div className="top-section">
  <div className="stats-wrapper">
    <h2 className="section-heading">📈 Stats</h2>
    <div className={`stats-cards ${fadeStats ? "fade-out" : "fade-in"}`}>
      <div className="card"><h3>Total Users</h3><p>{stats.totalUsers}</p></div>
      <div className="card"><h3>Total Donations</h3><p>₹{stats.totalDonations}</p></div>
      <div className="card">
        <h3>Rewards Given</h3>
        <ul>
          {Object.entries(stats.totalRewardsDistributed).map(([reward, count]) => (
            <li key={reward}>{reward}: {count}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>

  {/* Leaderboard Section */}
  <div className={`leaderboard ${fadeLeaderboard ? "fade-out" : "fade-in"}`}>
    <h3 className="section-heading">🏆 Leaderboard</h3>
    <table className="leaderboard-table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Name</th>
          <th>Referral Code</th>
          <th>Donations</th>
          <th>Rewards</th>
        </tr>
      </thead>
      <tbody>
        {leaderboard.map(user => (
          <tr key={user.email} onClick={() => navigate(`/user/${user.referralCode}`)} style={{ cursor: 'pointer' }}>
            <td>{user.rank}</td>
            <td>{user.name}</td>
            <td>{user.referralCode}</td>
            <td>₹{user.totalDonations}</td>
            <td>{user.rewards?.join(', ') || '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


      {/* Chart Section */}
      <div className="chart-section">
      <h2 className="section-heading">📉 Visualize Donations</h2>
        <div className="toggle-buttons">
          <button onClick={() => setViewMode("days")} className={viewMode === "days" ? "active" : ""}>Days</button>
          <button onClick={() => setViewMode("months")} className={viewMode === "months" ? "active" : ""}>Months</button>
          <button onClick={() => setViewMode("years")} className={viewMode === "years" ? "active" : ""}>Years</button>
        </div>

        <div className="filter-bar">
          {viewMode === "days" && renderMonthDropdown()}
          {viewMode !== "years" && renderYearDropdown()}
        </div>

        <div className={`chart-container ${fadeChart ? "fade-out" : "fade-in"}`}>
          {paginatedData.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '20px' }}>No donations available for the selected filter.</p>
          ) : (
<ResponsiveContainer width="100%" height={300}>
  <LineChart
    key={`${viewMode}-${month}-${year}`}
    data={paginatedData}
    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="label" stroke="#ccc" />
    <YAxis stroke="#ccc" />
    <Tooltip
      contentStyle={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(6px)",
        color: "#fff",
        borderRadius: "10px"
      }}
      labelStyle={{ color: "#fff" }}
      itemStyle={{ color: "#fff" }}
    />
    <Legend />
    <Line
      type="monotone"
      dataKey="totalDonations"
      stroke="#ffffff"
      strokeWidth={3}
      dot={{ r: 4 }}
      isAnimationActive={true}
      animationDuration={300}
    />
  </LineChart>
</ResponsiveContainer>

          )}

          {shouldPaginate && (
            <div className="pagination-controls">
              <button onClick={() => setPage(prev => prev - 1)} disabled={!hasPrevPage}>⬅ Prev</button>
              <span style={{ margin: '0 12px' }}>Page {page + 1}</span>
              <button onClick={() => setPage(prev => prev + 1)} disabled={!hasNextPage}>Next ➡</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
