import React, { useEffect } from 'react'
import './App.css'
import AOS from 'aos';
import 'aos/dist/aos.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import Home from './pages/Home/Home'
import Dashboard from './pages/Dashboard/Dashboard';
import UserProfile from './pages/profile/UserProfile';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

const App = () => {
  useEffect(() => {
  AOS.init({ duration: 800, once: true });
}, []);
  return (
    <BrowserRouter>
      <div className='app-layout'>
        <Header />
        <main className='main'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
             <Route path="/user/:referralCode" element={<UserProfile />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
