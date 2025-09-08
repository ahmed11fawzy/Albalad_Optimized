// SupplierCarousel.jsx
import React from 'react';
import { SupplierDataList } from './supplierData';


const SupplierCarousel = () => {
  return (
    <div className="suppliers-container">
      {SupplierDataList.map((supplier, index) => (
        <div 
          key={supplier.id}
          className="supplier-logo"
          style={{ zIndex: SupplierDataList.length - index , right: `${index * 2.5}px`,}}
          
        >
          <img 
            src={supplier.logo} 
            alt={supplier.name} 
          />
        </div>
      ))}
    </div>
  );
};

export default SupplierCarousel;