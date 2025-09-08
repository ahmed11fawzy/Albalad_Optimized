import React, { useEffect } from 'react'
import { useGetForYouProductsQuery } from '../redux/Slices/productsApi';
import ProductCard from './styledComponents/productCard';
import { Grid } from '@mui/material';

const ProductForYou = () => {
  const { data: products, isLoading, error } = useGetForYouProductsQuery();

  
  if (isLoading) return <div>جاري تحميل المنتجات...</div>;
  if (error) return <div>حدث خطاء في تحميل المنتجات</div>;
  
  return (
     <div className="more-loves-products-container">
      {products?.data?.map((product) => (
          <ProductCard product={product} />
        ))}
     </div>
    
  );
}

export default ProductForYou;