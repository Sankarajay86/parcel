import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './Home.css';
//import image1 from './img/safe.png';
import loc from './img/loc.jpg';
import img1 from './img/img1.png';
import din from './img/din.jpg';
import karur from './img/karur.jpg';
import erode from './img/erode.png';
import suit from './img/suit.png';
import suit1 from './img/suit1.png';
import Bolg from './blog.jsx'
function Home() {
  const imagePaths = [erode, din, karur];
  const imgsuit = [suit, suit1];

  return (
    <>
      <div  style={{
      marginRight:'3rem',
      height: '100vh', // Full viewport height
      width: '100vw', // Full viewport width
    }}>
        {/* Header */}
        <header className="header11" >
          <div className="container11">
            <p className="logo11">Sri Ganga Parcel Service</p>
            <nav className="navbar11">
              <ul className="navbar-list1">
                <li><a href="/serach" className="navbar-link1">Booking</a></li>
                <li><a href="#footer1"   className="navbar-link1">Contact</a></li>
                <li><a href="/blog"   className="navbar-link1">Blog</a></li>
              </ul>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className='main'><br /><br /><br />
          <article>
            {/* Features Section */}
            <div className="container2">
          <section className="section1-features1" >
              <div className="container1">
                <p className="section-subtitle2">Features</p>
                <h2 className="h2-section-title2">What We Provide</h2>
                <ul className="features-list2">
                  <li>
                    <div className="feature-card2">
                      <div className="card-icon2">
                        <img src='https://5.imimg.com/data5/SELLER/Default/2022/12/AV/FD/QS/33594867/overnight-delivery-courier-service-500x500.png' className="img1" alt="Safe & Secure Icon" /> 
                      </div>
                      <h3 className="h3-card-title2">Safe & Secure</h3>
                      <p className="card-text2">We provide top-notch security for your goods throughout the transportation process.</p>
                    </div>
                  </li>
                  <li>
                    <div className="feature-card2">
                      <div className="card-icon2">
                        <img src={loc} className="img1" alt="Multiple Locations Icon" />
                      </div>
                      <h3 className="h3-card-title2">Multiple Locations</h3>
                      <p className="card-text2">We provide multiple drop-off and pickup locations so you don't have to worry.</p>
                    </div>
                  </li>
                  <li>
                    <div className="feature-card2">
                      <div className="card-icon2">
                        <img src={img1} className="img1" alt="Tracking Made Easy Icon" />
                      </div>
                      <h3 className="h3-card-title2">Tracking Made Easy</h3>
                      <p className="card-text2">A tracking number for the entire process, so you can find the exact position.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </section></div>
            <br /><br /><br />
            {/* Projects Section */}
            <section className="section-project1" id="projects">
              <div className="container1">
                <p className="section-subtitle1">Projects</p>
                <h2 className="h2-section-title1">Featured Projects</h2>
                <ul className="project-list1">
                  {imagePaths.map((img, index) => (
                    <li className="project-item1" key={index}>
                      <div className="project-card1">
                        <figure className="card-banner1 img-holder">
                          <img src={img}  className="img-cover2" alt={`Project ${index + 1}`} />
                        </figure>
                        <div className="card-content1">
                          <p className="card-tag1">{index === 0 ? 'Erode' : index === 1 ? 'Dindigul' : 'Karur'}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
           

            {/* Blog Section */}
            <section className="section1-blog1" id="blog">
              <div className="container1">
                <p className="section-subtitle1">Sri Ganga</p>
                <h2 className="h2-section-title1">Delivery Suite of Solutions</h2>
                <ul className="blog-list1">
                  {imgsuit.map((img, index) => (
                    <li key={index}>
                      <div className="blog-card1">
                        <figure className="card-banner1">
                          <img src={img}  className="img-cover1" alt={`Blog ${index + 1}`} />
                        </figure>
                        <div className="card-content1">
                          <h3 className="h3 card-title1">{index === 0 ? 'B2B Enterprises' : 'Personal Courier'}</h3>
                          <p className="card-tag1">
                            {index === 0
                              ? 'We provide customized solutions for supply chain management.'
                              : 'India’s only online courier solution for personal shipping needs.'}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </article>
        </main>

        {/* Footer */}
        <footer className="footer1" id="footer1">
          <div className="container10">
            <div className="footer-top section1">
              <div className="footer-brand1">
                <Link to="/" className="logo1">GPS</Link>
                <p className="footer-text1">Many desktop publishing packages use Lorem Ipsum as default.</p>
              </div>
              <ul className="footer-list1">
                <li><Link to="/about" className="footer-link1">About</Link></li>
                <li><Link to="/services" className="footer-link1">Services</Link></li>
                <li><Link to="/blog" className="footer-link1">Blog</Link></li>
                <li><Link to="/contact" className="footer-link1">Contact</Link></li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Home;
