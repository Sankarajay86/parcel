import React from 'react';
import './blog.css'
const Blog = () => {
  return (
    <div className="blog-container">
      <h1 className="blog-title">Sri Ganga Parcel Service</h1>
      <p className="blog-intro">
        Sri Ganga Parcel Service is committed to providing reliable and efficient courier services across various locations. Whether you need to send packages for business or personal needs, we ensure safe and timely delivery.
      </p>

      <div className="blog-section">
        <h2>Why Choose Sri Ganga Parcel Service?</h2>
        <ul>
          <li><strong>Fast Delivery:</strong> We ensure timely pickup and delivery of your parcels.</li>
          <li><strong>Real-Time Tracking:</strong> Track your shipments with a unique tracking number.</li>
          <li><strong>Secure Handling:</strong> Safety of your parcels is our top priority.</li>
          <li><strong>Affordable Pricing:</strong> Competitive rates with no hidden charges.</li>
          <li><strong>Wide Network:</strong> We cover multiple locations for your convenience.</li>
        </ul>
      </div>

      <div className="blog-section">
        <h2>Our Services</h2>
        <p>
          We cater to both <strong>businesses</strong> and <strong>individuals</strong>, offering customized parcel delivery solutions. Our services include:
        </p>
        <ul>
          <li>Express Courier Services</li>
          <li>Same-Day & Next-Day Delivery</li>
          <li>Bulk Parcel Shipping</li>
          <li>Specialized B2B Logistics</li>
        </ul>
      </div>

      <div className="blog-section">
        <h2>How to Send a Parcel?</h2>
        <p>Sending a parcel with us is easy! Follow these simple steps:</p>
        <ol>
          <li>Book your parcel online or visit our nearest center.</li>
          <li>Pack your item securely.</li>
          <li>Choose your preferred delivery option.</li>
          <li>Track your parcel using our tracking system.</li>
          <li>Receive updates until it reaches its destination.</li>
        </ol>
      </div>

      <div className="blog-section">
        <h2>Customer Testimonials</h2>
        <p>
          "Sri Ganga Parcel Service has been a game-changer for our business. Their quick and reliable service has helped us grow immensely!" – <strong>Rajesh Kumar, Business Owner</strong>
        </p>
        <p>
          "I love how easy it is to send a parcel. The tracking system is accurate, and delivery is always on time!" – <strong>Sneha Patel</strong>
        </p>
      </div>
    </div>
  );
};

export default Blog;
