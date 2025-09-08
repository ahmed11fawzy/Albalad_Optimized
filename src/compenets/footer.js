import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaSnapchatGhost,
} from "react-icons/fa";
import CallIcon from "@mui/icons-material/Call";
import { SiTiktok } from "react-icons/si";
import { Link } from "react-router-dom";
import "../css/footer.css";
import visaLogo from "../assest/images/VISA-logo.png";

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-top">
        <div className="footer-about">
          <h2 className="footer-title">
            البلد: منصتك الأفضل للتسوق الإلكتروني
          </h2>
          <div className="footer-desc">ما هي منصة البلد؟</div>
          <div className="footer-text">
            منصة البلد هي وجهتك العربية للتسوق الإلكتروني، حيث نوفر لك مجموعة
            واسعة من المنتجات الأصلية بأسعار تنافسية وتجربة تسوق آمنة وسهلة.
            استمتع بخيارات دفع متعددة، وخدمة عملاء مميزة، وتوصيل سريع إلى باب
            منزلك. هدفنا هو تلبية جميع احتياجاتك وتقديم أفضل العروض من متاجر
            موثوقة في العالم العربي.
          </div>
        </div>
        <div className="footer-social-pay">
          <div className="footer-social">
            <div className="footer-social-title">تابعنا على</div>
            <div className="footer-social-icons">
              <a
                href="https://www.facebook.com/share/1JX8HU3BjA/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="فيسبوك"
              >
                <FaFacebook />
              </a>
              <a
                href="https://www.youtube.com/channel/UCNBRW86xARbTQ7jKBlPII5A"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="يوتيوب"
              >
                <FaYoutube />
              </a>
              <a
                href="https://www.snapchat.com/add/albaladec"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="سناب شات"
              >
                <FaSnapchatGhost />
              </a>
              <a
                href="https://www.tiktok.com/@albaladec"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="تيك توك"
              >
                <SiTiktok />
              </a>
              <a
                href="https://www.instagram.com/albaladec/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="انستجرام"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
          <div className="footer-pay">
            <div className="footer-pay-title">الدفع بواسطة</div>
            <div className="footer-pay-icons">
              {/* <img src={require('../assest/images/images (4).png')} alt="GPay" /> */}
              <img src={visaLogo} alt="Apple Pay" />
            </div>
          </div>
        </div>
        <div className="footer-links">
          <div className="footer-links-col">
            <div className="footer-links-title">خدمة العملاء</div>
            <ul>
              <li>
                <a href="/complaints" target="_blank" rel="noopener noreferrer">
                  الشكاوى والبلاغات
                </a>
              </li>
              <li>
                <a
                  href="/policies/سياسة الإرجاع والاستبدال.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  سياسة الاسترجاع والاستبدال
                </a>
              </li>
              <li>
                <a
                  href="/policies/الشروط والاحكام.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  الشروط والأحكام
                </a>
              </li>
              {/* <li><a href="/documents/yourfile.pdf" target="_blank" rel="noopener noreferrer">حماية المشتري</a></li> */}
              <li>
                <a
                  href="/policies/القانون وتسوية النزاعات.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  القانون وتسوية النزاعات
                </a>
              </li>
              <li>
                <a
                  href="/policies/حدود المسولية والالتزامات.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  حدود المسولية والالتزامات
                </a>
              </li>
              <li>
                <a
                  href="/policies/حقوق الملكية الفكرية.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  حقوق الملكية الفكرية
                </a>
              </li>
              <li>
                <a href="/contact" target="_blank" rel="noopener noreferrer">
                  تواصل معنا
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-links-col">
            <div className="footer-links-title">انضم لنا</div>
            <ul>
              <li>
                <Link to="/register-seller">سجّل كبائع</Link>
              </li>
              <li>برنامج الشركاء</li>
              <li>الأسئلة الشائعة للبائعين</li>
              <li>سياسة البائعين</li>
              <li>كن شريك دفع</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-row">
          <div className="footer-bottom-links">
            {/* <span><a href="/policies/الدعم الفني.pdf" target="_blank" rel="noopener noreferrer">الدعم الفني</a></span> */}
            <span>
              <a
                href="/policies/سياسة الاستخدام.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                سياسة الاستخدام
              </a>
            </span>
            <span>
              <a
                href="/policies/سياسة الخصوصية.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                سياسة الخصوصية
              </a>
            </span>
            <span>
              <a
                href="/policies/سياسة الدفع والمحافظ الإلكترونية.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                سياسة الدفع والمحافظ الإلكترونية
              </a>
            </span>
            <span>
              <a
                href="/policies/سياسة المنتجات.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                سياسة المنتجات
              </a>
            </span>
            <span>
              <a
                href="/policies/سياسة غسل الاموال.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                سياسة غسل الاموال
              </a>
            </span>
          </div>
          <div className="footer-bottom-categories">
            <span>منتجات شعبية، عروض، أسعار منافسة، تقييمات، مدونة، فيديو</span>
          </div>
          <div className="footer-bottom-multilang">
            <span>البلد متوفر بعدة لغات</span>
            <span>العربية، الإنجليزية</span>
          </div>
          <div className="footer-bottom-alibaba">
            <span>جميع الحقوق محفوظة لمنصة البلد - Albalad Platform</span>

            <p>
              <a href="tel:+966553473490">
                <CallIcon /> +966553473490
              </a>
            </p>
          </div>
        </div>
        <div className="footer-bottom-legal">
          <span>
            خريطة الموقع - الشروط والأحكام - سياسة الخصوصية - دليل الاستفسارات
            القانونية © 2025 al-balad.sa. جميع الحقوق محفوظة
          </span>
        </div>
      </div>
    </footer>
  );
}
