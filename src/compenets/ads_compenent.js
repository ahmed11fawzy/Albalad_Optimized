import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ADS({ data }) {  // Changed prop to destructured { data } for clarity
   
    return (
        <div className="adds-card">
                        <img 
                            src={data.img} 
                            alt="ads-image" // Always include alt text
                            className="ads-image"  // Added class for styling
                        />
                    </div>
    );
}