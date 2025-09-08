import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './registerPage.css';
import LogoHeader from '../logoHeader';
import registerBg from '../../assest/images/register-bg.jpeg';

export default function RegisterPage() {
  const [accountType, setAccountType] = useState('buyer');
  const navigate = useNavigate();

  const handleContinue = () => {
    if (accountType === 'buyer') {
      navigate('/register-buyer');
    } else if (accountType === 'supplier') {
      navigate('/register-seller');
    }
  };

  return (
    <>
      <LogoHeader />
      <div className="register-page-root">
        <div className="register-form-section">
          <h2 className="register-title">ما نوع الحساب الذي تريد إنشاؤه؟</h2>
          <div className="register-account-types">
            <label className={`register-account-type${accountType === 'buyer' ? ' selected' : ''}`}>
              <input type="radio" name="accountType" checked={accountType === 'buyer'} onChange={() => setAccountType('buyer')} />
              <div className="register-type-content">
                <div className="register-type-icon buyer-icon" />
                <div>
                  <div className="register-type-title">المشتري</div>
                  <div className="register-type-desc">تمتع بوصول إلى أكثر من 200 مليون منتج من 200,000 مورد.</div>
                </div>
              </div>
            </label>
            <label className={`register-account-type${accountType === 'supplier' ? ' selected' : ''}`}>
              <input type="radio" name="accountType" checked={accountType === 'supplier'} onChange={() => setAccountType('supplier')} />
              <div className="register-type-content">
                <div className="register-type-icon supplier-icon" />
                <div>
                  <div className="register-type-title">المورد</div>
                  <div className="register-type-desc">بع منتجاتك إلى 40 مليون مشتري من القطاع التجاري بجميع أنحاء العالم<br /><span style={{ fontSize: '0.95em', color: '#888' }}>* سيتم إنشاء حساب مشتري أيضًا</span></div>
                </div>
              </div>
            </label>
          </div>
          <button className="register-continue-btn" onClick={handleContinue}>متابعة</button>
          <div className="register-login-link">لديك حساب بالفعل؟ <a href="/login">تسجيل الدخول</a></div>
        </div>
        <div className="register-image-section">
          <div className="register-image-bg">
            {/* صورة أو رسم توضيحي */}
            <img src={registerBg} alt="register-illustration" className="register-illustration-img" />
          </div>
        </div>
      </div>
    </>
  );
} 