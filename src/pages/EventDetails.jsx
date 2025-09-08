
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { useLocation, useParams } from 'react-router-dom';
// import EventCard from '../compenets/Event/EventCard';
import HeroSection from '../compenets/Event/HeroSection';
import Market from '../compenets/Market/Market';
const EventDetails = () => {
  const { state } = useLocation();
  const marketId = state?.marketId;
  const {id}=useParams();
 
  return (
   <Box sx={{   marginTop: '100px' }} >
      
        <HeroSection eventId={id} />
        
       {marketId && <Market marketId={marketId} />}

  </Box>
  )
}

export default EventDetails