import React from 'react';
import { useGetEventQuery } from '../../redux/Slices/events';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import bgImage from "../../assest/images/Event/image.png";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import { LocationOn } from '@mui/icons-material';

const HeroSection = ({ eventId }) => {
  const { data: eventData, isLoading, error } = useGetEventQuery(eventId);

  if (isLoading) return <div className="text-center text-[#b88c36] animate-pulse">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error loading event</div>;
  if (!eventData?.status || !eventData?.data) return null;

  const event = eventData.data;
  const marketName = event.market ? event.market.name : null;

  return (
    <Box
      sx={{
        position: 'relative',
        height: '80vh',
        overflow: 'hidden',
        display: 'flex',
        gap: 2,
        justifyContent: 'space-between',
        width: '100%',
        padding: '0 20px',
        
      }}
    >
      {/* Glassmorphism Card for Text */}
      {<Card
        sx={{
          position: 'relative',
          zIndex: 1,
          background: 'transparent',
          boxShadow: "none",
          paddingInline: '20px',
          maxWidth: '50%',
          color: '#333',
         
        }}
      >
        <CardContent>
          <Typography
            variant="h2"
            sx={{
              color: '#b88c36',
              mb: 2,
              position: 'relative',
              
            }}
          >
            {event.name}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 2,
              color: '#555',
              position: 'relative',
              
              
            }}
          >
            {event.description}
           
          </Typography>
          {marketName && (
            <Stack direction="row" alignItems="center" sx={{ color: '#666' }}>
              <LocationOn sx={{ color: '#b88c36', mr: 1 }} />
              <Typography variant="body2">{marketName}</Typography>
            </Stack>
          )}
        </CardContent>
      </Card>}

      {/* Swiper for Images */}
      <Box sx={{ flexShrink: 0, maxWidth: '45%', position: 'relative', zIndex: 1 }}>
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          style={{
            '--swiper-navigation-color': '#b88c36',
            '--swiper-pagination-color': '#b88c36',
            '--swiper-navigation-size': '24px',
          }}
          className="h-[400px]"
        >
          {event.images.map((image, index) => (
            <SwiperSlide key={index}>
              <Box
                sx={{
                  height: '400px',
                  overflow: 'hidden',
                  borderRadius: '15px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                }}
              >
                <img
                  src={image || 'https://via.placeholder.com/400x400'}
                  alt={event.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
      
      </Box>
    // </Box>
  );
};

export default HeroSection;