import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Badge,
} from "@mui/material";
import { Favorite, ShoppingCart, Visibility, Star } from "@mui/icons-material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { useAddToCartMutation } from "../../redux/Slices/productsApi";
import ProductDetailsDialog from "../ProductDetailsDialog";
import QuickAddToCart from "../../components/QuickAddToCart";
import { motion, AnimatePresence } from "framer-motion";

// Styled components with harmonious color palette
const StyledCard = styled(Card)(({ theme }) => ({
  position: "relative",
  maxWidth: "100%",
  borderRadius: "16px",
  overflow: "hidden",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
  background: "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)",
  border: "1px solid #f0f0f0",
  boxShadow: "0 4px 20px rgba(184, 140, 54, 0.08)",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 20px 40px rgba(184, 140, 54, 0.15)",
    "& .product-image": {
      transform: "scale(1.05)",
    },
    "& .action-buttons": {
      opacity: 1,
      visibility: "visible",
      transform: "translateY(0)",
    },
    "& .price-container": {
      transform: "translateY(-4px)",
    },
  },
}));

const StyledCardMedia = styled(CardMedia)({
  height: 240,
  width: "100%",
  position: "relative",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  overflow: "hidden",
  background: "linear-gradient(45deg, #f8f8f8 0%, #ffffff 100%)",
  "&.product-image": {
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  },
});

const ActionButtonsContainer = styled(Box)({
  position: "absolute",
  top: 12,
  right: 12,
  display: "flex",
  flexDirection: "column",
  gap: 8,
  opacity: 0,
  visibility: "hidden",
  transform: "translateY(-20px)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&.action-buttons": {
    transitionDelay: "0.1s",
  },
});

const ActionButton = styled(IconButton)({
  width: 40,
  height: 40,
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(184, 140, 54, 0.2)",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "#b88c36",
    color: "white",
    transform: "scale(1.1)",
  },
});

const DiscountBadge = styled(Chip)({
  position: "absolute",
  top: 12,
  left: 12,
  backgroundColor: "#d32f2f",
  color: "white",
  fontWeight: "bold",
  fontSize: "12px",
  height: 28,
  borderRadius: "14px",
  zIndex: 2,
  animation: "pulse 2s infinite",
  "@keyframes pulse": {
    "0%": { transform: "scale(1)" },
    "50%": { transform: "scale(1.05)" },
    "100%": { transform: "scale(1)" },
  },
});

const PriceContainer = styled(Box)({
  transition: "transform 0.3s ease",
  "&.price-container": {
    transitionDelay: "0.1s",
  },
});

const PrimaryPrice = styled(Typography)({
  fontWeight: "bold",
  color: "#b88c36",
  fontSize: "1rem",
  textShadow: "0 2px 4px rgba(184, 140, 54, 0.1)",
});

const OldPrice = styled(Typography)({
  textDecoration: "line-through",
  color: "#999",
  fontSize: "0.9rem",
  opacity: 0.8,
});

const StockBadge = styled(Chip)(({ stocklevel }) => ({
  fontSize: "10px",
  height: 20,
  backgroundColor:
    stocklevel === "low"
      ? " #ff9800"
      : stocklevel === "out"
      ? " #f44336"
      : "rgb(204, 156, 61)",
  color: "white",
  fontWeight: "bold",
  borderRadius: "10px",
}));

const RatingContainer = styled(Box)({
  display: "flex",
  justifyContent: "end",
  alignItems: "center",
  gap: 4,
  marginTop: 8,
});

const ProductNameContainer = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "8px",
  gap: "8px",
});

const ProductCard = ({ product }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();
  const [addToCart, { data, isLoading, error }] = useAddToCartMutation();
  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`); // <-- تمرير المنتج هنا
  };
  const handleAddToCart = async () => {
    setSelectedProductId(product.id);
    setDialogOpen(true);
  };
  // Calculate discount percentage
  const discountPercentage =
    product.old_price > product.price
      ? Math.round(
          ((product.old_price - product.price) / product.old_price) * 100
        )
      : 0;

  // Determine stock level
  const getStockLevel = (quantity, lowStock) => {
    if (quantity === 0) return "out";
    if (quantity <= lowStock) return "low";
    return "good";
  };

  const stockLevel = getStockLevel(
    product.quantity,
    product.low_stock_quantity
  );
  const stockText = {
    out: "نفدت الكمية",
    low: "كمية محدودة",
    good: "متوفر",
  };
  const handleAddToFavorites = () => {
    // Add product to favorites
  };

  return (
    <Box>
      <QuickAddToCart
        open={dialogOpen}
        productId={selectedProductId}
        onClose={() => setDialogOpen(false)}
      />

      <StyledCard>
        <StyledCardMedia
          className="product-image"
          image={product.medias[0]?.file_name || "/api/placeholder/320/240"}
          title={product.name}
        >
          {discountPercentage > 0 && (
            <DiscountBadge label={`-${discountPercentage}%`} size="small" />
          )}

          <ActionButtonsContainer className="action-buttons">
            <ActionButton
              onClick={() => setIsLiked(!isLiked)}
              sx={{ color: isLiked ? "#d32f2f" : "inherit" }}
            >
              <Favorite fontSize="small" />
            </ActionButton>

            <ActionButton onClick={() => handleAddToCart()}>
              <ShoppingCart fontSize="small" />
            </ActionButton>

            <ActionButton onClick={() => handleProductClick(product)}>
              <Visibility fontSize="small" />
            </ActionButton>
          </ActionButtonsContainer>
        </StyledCardMedia>

        <CardContent sx={{ padding: "16px" }}>
          <ProductNameContainer>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: "bold",
                color: "#333",
                fontSize: "1.1rem",
                lineHeight: 1.3,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                flex: 1,
              }}
            >
              {product.name}
            </Typography>

            <StockBadge
              label={stockText[stockLevel]}
              stocklevel={stockLevel}
              size="small"
            />
          </ProductNameContainer>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              maxWidth: "180px",
              marginBottom: "12px",
              fontSize: "0.9rem",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {product.description
              ?.replace(/<[^>]*>/g, "")
              .replace(/&nbsp;/g, "")
              .replace(/✨/g, "") || "منتج عالي الجودة"}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "12px",
            }}
          >
            <PriceContainer className="price-container">
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <PrimaryPrice>{parseInt(product.price)} ر.س</PrimaryPrice>
                {discountPercentage > 0 && (
                  <OldPrice>{parseInt(product.old_price)} ر.س</OldPrice>
                )}
              </Box>
            </PriceContainer>
            <RatingContainer>
              <Typography variant="body2" color="text.secondary">
                {parseInt(product.avg_rating)}
              </Typography>
              <Star sx={{ color: "#ffc107", fontSize: "16px" }} />
            </RatingContainer>
          </Box>

          {/* <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            marginTop: '8px',
            fontSize: '0.8rem',
            color: '#b88c36',
            maxWidth: '200px'
          }}
        >
          كود المنتج: {product.sku}
        </Typography> */}
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default ProductCard;
