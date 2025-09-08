import React from 'react';
import '../css/logoHeader.css';
import logoImg from '../assest/images/logo-img.jpeg';

export default function LogoHeader() {
  return (
    <div className="logo-header">
      <img src={logoImg} alt="شعار البلد" className="logo-header-img" />
    </div>
  );
} 