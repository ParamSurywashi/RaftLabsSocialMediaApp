import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faLinkedin, faTwitterSquare} from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <div className="ui vertical footer segment">
      <div className="ui center aligned container horizontal small divided link list">
      <div>
    &copy; 2024 <a href="https://www.param.com" style={{ color: '#61dafb', textDecoration: 'none' }}>Param.com</a>
  </div>
  <div style={{ fontSize: '16px', marginTop: '5px' }}>
    I ❤️ Social Media App
  </div>
      </div>
    </div>
  );
};

export default Footer;
