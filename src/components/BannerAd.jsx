import React from 'react';
import { Box, Card, CardMedia, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const BannerAd = ({ imageUrl, altText, title, subtitle, width = '100%', height = 200, onClick }) => {
  return (
    <Card
      sx={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 2,
        boxShadow: 3,
        '&:hover': {
          boxShadow: 6,
          cursor: onClick ? 'pointer' : 'default',
        },
      }}
      onClick={onClick}
    >
      <CardMedia
        component="img"
        image={imageUrl}
        alt={altText}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      {(title || subtitle) && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {title && (
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body2" component="div">
              {subtitle}
            </Typography>
          )}
        </Box>
      )}
    </Card>
  );
};

BannerAd.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  altText: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClick: PropTypes.func,
};

BannerAd.defaultProps = {
  altText: 'Banner Ad',
  title: '',
  subtitle: '',
  onClick: null,
};

export default BannerAd;