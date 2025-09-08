import React from 'react';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
  CircularProgress,
} from '@mui/material';
import { CalendarToday, LocationOn, Category } from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useGetEventQuery } from '../../redux/Slices/events';

const EventCard = ({ eventId }) => {

    const { data: eventData, isLoading, error } = useGetEventQuery(eventId);
    
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress sx={{ color: '#b88c36' }} />
      </Box>
    );
  }
  if (error) {
    return (
      <Typography color="error" align="center">
        Error loading event
      </Typography>
    );
  }
  if (!eventData?.status || !eventData?.data) return null;

  const event = eventData.data;
  const startDate = new Date(event.start_datetime);
  const endDate = new Date(event.end_datetime);

  return (
    <Card
      sx={{
        maxWidth: 400,
        mx: 'auto',
        boxShadow: 3,
        border: '1px solid',
        borderColor: '#b88c36',
        transition: 'box-shadow 0.3s',
        '&:hover': { boxShadow: 6 },
      }}
    >
      {/* Image Swiper */}
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        style={{
          '--swiper-navigation-color': '#b88c36',
          '--swiper-pagination-color': '#b88c36',
          '--swiper-navigation-size': '24px',
        }}
        className="h-48"
      >
        {event.images.map((image, index) => (
          <SwiperSlide key={index}>
            <CardMedia
              component="img"
              height="192"
              image={image || 'https://via.placeholder.com/400x200'}
              alt={event.name}
              sx={{ objectFit: 'cover', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <Chip
        label={event.status}
        size="small"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          bgcolor: '#b88c36',
          color: 'white',
          fontWeight: 'bold',
        }}
      />

      {/* Event Details */}
      <CardContent>
        <Typography variant="h6" component="h2" color="#b88c36" gutterBottom>
          {event.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {event.description}
        </Typography>

        {/* Event Meta */}
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CalendarToday sx={{ color: '#b88c36', fontSize: 18 }} />
            <Typography variant="body2" color="text.secondary">
              {format(startDate, 'MMM d, yyyy HH:mm')} - {format(endDate, 'MMM d, yyyy HH:mm')}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <LocationOn sx={{ color: '#b88c36', fontSize: 18 }} />
            <Typography variant="body2" color="text.secondary">
              {event.market.name}, {event.market.location_hierarchy.province.name}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Category sx={{ color: '#b88c36', fontSize: 18 }} />
            <Typography variant="body2" color="text.secondary">
              {event.event_category.name}
            </Typography>
          </Stack>
        </Stack>

        {/* Call to Action */}
        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            bgcolor: '#b88c36',
            '&:hover': { bgcolor: '#a07b2f' },
            textTransform: 'none',
            fontWeight: 'bold',
          }}
        >
          Learn More
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventCard;