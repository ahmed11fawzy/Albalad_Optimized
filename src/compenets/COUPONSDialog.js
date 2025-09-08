import React, { useEffect, useState } from 'react';
import './COUPONSDialog.css';

const COUPONS = [
  {
    code: 'PDGCC3',
    discount: 'خصم 90 ر.س.',
    minOrder: 'الطلبات أكثر من 770 ر.س.',
  },
  {
    code: 'PDGCC2',
    discount: 'خصم 45 ر.س.',
    minOrder: 'الطلبات أكثر من 380 ر.س.',
  },
  {
    code: 'PDGCC1',
    discount: 'خصم 23 ر.س.',
    minOrder: 'الطلبات أكثر من 190 ر.س.',
  },
];

export default function COUPONSDialog({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="coupons-dialog-overlay" onClick={onClose}>
      <div className="coupons-dialog" onClick={e => e.stopPropagation()}>
        <button className="coupons-dialog-close" onClick={onClose}>&times;</button>
        <div className="coupons-dialog-header">
          <span className="coupons-dialog-title-main">يوم الرواتب 26 يونيو- 29 يونيو</span>
          <span className="coupons-dialog-title-sub">ألق نظرة: <b>أكواد الكوبونات</b></span>
        </div>
        <div className="coupons-dialog-list">
          {COUPONS.map((c, i) => (
            <div className="coupons-dialog-row" key={c.code}>
              <div className="coupons-dialog-code-box">
                <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="check" className="coupons-dialog-check" />
                <span className="coupons-dialog-code-label">الكود:</span>
                <span className="coupons-dialog-code">{c.code}</span>
              </div>
              <div className="coupons-dialog-discount-box">
                <span className="coupons-dialog-discount">{c.discount}</span>
                <span className="coupons-dialog-minorder">{c.minOrder}</span>
              </div>
            </div>
          ))}
        </div>
        <button className="coupons-dialog-cta" onClick={onClose}>تسوق الآن</button>
      </div>
    </div>
  );
} 