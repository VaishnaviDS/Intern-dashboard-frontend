import React from 'react'
import './footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} YourCompany. All rights reserved.</p>
        <p className="footer-madeby">
          Made with ❤️ by <a href="https://github.com/VaishnaviDS/" target="_blank" rel="noopener noreferrer">Vaishnavi Sakpal</a>
        </p>
      </div>
    </footer>
  )
}

export default Footer
