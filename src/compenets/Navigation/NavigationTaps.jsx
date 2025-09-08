import React, { useState, Suspense, lazy } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load components for performance
const Offers = lazy(() => import('../../pages/Offers'));
const ProductForYou = lazy(() => import('../productForYou'));
const TopSellingSection = lazy(() => import('../TopSellingSection'));
const BrandAdsSection = lazy(() => import('../ads_brand_section'));
const AlbaladEvents = lazy(() => import('../albaladEvents'));
const XYOffersSection = lazy(() => import('../XYOffersSection'));

// Memoize components to prevent unnecessary re-renders
const MemoizedOffers = React.memo(Offers);
const MemoizedProductForYou = React.memo(ProductForYou);
const MemoizedTopSellingSection = React.memo(TopSellingSection);
const MemoizedBrandAdsSection = React.memo(BrandAdsSection);
const MemoizedAlbaladEvents = React.memo(AlbaladEvents);
const MemoizedXYOffersSection = React.memo(XYOffersSection);

// Styles for clarity and maintainability
const styles = {
  container: {
    width: '100%',
    background: '#ffffff', // White background for the entire component
    borderRadius: 10,
    overflow: 'hidden',
  },
  nav: {
    background: '#fdfdfd', // Light gray nav background
    padding: '5px 5px 0',
    borderRadius: '10px 10px 0 0',
   
  },
  tab: {
    background: 'white', // Neutral tab background
    borderRadius: '5px 5px 0 0',
    padding: '10px 15px',
  },

};

// Navigation items for easy updates
const navItems = [
  { label: 'العروض', component: MemoizedOffers },
  { label: 'المقترحة من اجلك', component: MemoizedProductForYou },
  { label: 'الاكثر مبيعا', component: MemoizedTopSellingSection },
  { label: 'الفئات', component: MemoizedBrandAdsSection },
  { label: 'الفاعليات', component: MemoizedAlbaladEvents },
  { label: '  اشتري واحصل', component: MemoizedXYOffersSection },
];

// Accessibility props for tabs
const a11yProps = (index) => ({
  id: `simple-tab-${index}`,
  'aria-controls': `simple-tabpanel-${index}`,
});

// CustomTabPanel for content rendering with animation
const CustomTabPanel = ({ children, value, index }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`simple-tabpanel-${index}`}
    aria-labelledby={`simple-tab-${index}`}
  >
    {value === index && (
      <Box sx={{ p: 3 }}>
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
        </motion.div>
      </Box>
    )}
  </div>
);

const NavigationTaps = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    console.log('Switching to tab:', newValue); // Debug log
    setValue(newValue);
  };

  return (
    <Box sx={styles.container}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }} style={styles.nav}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          sx={{
            position: 'relative',
            '& .MuiTabs-indicator': { backgroundColor: '#b88c36 !important' }, // Hide default indicator
            '& .Mui-selected': { 
              color: '#b88c36 !important' ,
              
             },
          }}
        >
          {navItems.map((item, index) => (
            <Tab
              key={item.label}
              label={item.label}
              {...a11yProps(index)}
              sx={{
                textTransform: 'none', // Preserve Arabic text
                fontWeight: value === index ? 600 : 500,
                
                ...styles.tab,
                position: 'relative',
              }}
            />
          ))}
          <motion.div
            style={{
              ...styles.underline,
              width: `${100 / navItems.length}%`, // Match tab width
              left: `${(value * 100) / navItems.length}%`, // Position under active tab
            }}
            layoutId="underline"
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </Tabs>
      </Box>
      <AnimatePresence mode="wait">
        {navItems.map((item, index) => (
          <CustomTabPanel value={value} index={index} key={item.label}>
            {index === 2 ? (
              <div className="container">
                <item.component />
              </div>
            ) : (
              <item.component />
            )}
          </CustomTabPanel>
        ))}
      </AnimatePresence>
    </Box>
  );
};

export default NavigationTaps;