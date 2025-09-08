import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllProductsQuery } from "../redux/Slices/productsApi";
import ProductCard from "../compenets/styledComponents/productCard";
import Button from "./styledComponents/reusableButton";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Row component with animation
const MotionProductRow = ({ rowItems, onProductClick }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true, // Animate only once
    threshold: 0.2, // Trigger when 20% of row is visible
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: "easeOut" },
        },
        hidden: { opacity: 0, y: 50 },
      }}
      className="more-loves-products-container"
    >
      {rowItems.map((product) => (
        <ProductCard
          key={`product-${product.id}`}
          product={product}
          onProductClick={onProductClick}
        />
      ))}
    </motion.div>
  );
};

export default function MoreLovesProductSection() {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef();
  const loadingRef = useRef();
  const isInitialLoad = useRef(true);

  const ITEMS_PER_ROW = 5; // Adjust based on your grid (e.g., 2, 4)

  // Chunk products into rows
  const rows = useMemo(() => {
    const result = [];
    for (let i = 0; i < allProducts.length; i += ITEMS_PER_ROW) {
      result.push(allProducts.slice(i, i + ITEMS_PER_ROW));
    }
    return result;
  }, [allProducts]);

  // Fetch products for current page
  const {
    data,
    isLoading: isLoadingProducts,
    error,
    isFetching,
  } = useGetAllProductsQuery(currentPage, {
    refetchOnMountOrArgChange: false,
  });

  console.log("🚀 ~ MoreLovesProductSection ~ data:", data);
  console.log(
    "Current page:",
    currentPage,
    "Loading:",
    isLoadingProducts,
    "Fetching:",
    isFetching
  );

  // Update products when new data arrives
  useEffect(() => {
    if (data?.data?.products && !isFetching) {
      const newProducts = data.data.products;
      const totalPages = data.data.last_page;
      const hasMore = currentPage < totalPages;

      console.log(
        "Processing page:",
        currentPage,
        "Products:",
        newProducts.length,
        "Total pages:",
        totalPages
      );

      if (isInitialLoad.current || currentPage === 1) {
        setAllProducts(newProducts);
        isInitialLoad.current = false;
      } else {
        setAllProducts((prevProducts) => {
          const existingIds = new Set(prevProducts.map((p) => p.id));
          const uniqueNewProducts = newProducts.filter(
            (p) => !existingIds.has(p.id)
          );

          if (uniqueNewProducts.length === 0) {
            console.log("No new unique products found");
            return prevProducts;
          }

          console.log(
            "Adding",
            uniqueNewProducts.length,
            "new unique products"
          );
          return [...prevProducts, ...uniqueNewProducts];
        });
      }

      setHasMoreProducts(hasMore);
      setIsLoadingMore(false);
    }
  }, [data, currentPage, isFetching]);

  // Load next page
  const loadMoreProducts = useCallback(() => {
    if (
      !isLoadingMore &&
      !isLoadingProducts &&
      !isFetching &&
      hasMoreProducts
    ) {
      console.log("Loading more products, current page:", currentPage);
      setIsLoadingMore(true);
      setCurrentPage((prev) => prev + 1);
    } else {
      console.log("Cannot load more:", {
        isLoadingMore,
        isLoadingProducts,
        isFetching,
        hasMoreProducts,
      });
    }
  }, [
    isLoadingMore,
    isLoadingProducts,
    isFetching,
    hasMoreProducts,
    currentPage,
  ]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (
          target.isIntersecting &&
          hasMoreProducts &&
          !isLoadingProducts &&
          !isFetching &&
          !isLoadingMore &&
          allProducts.length > 0
        ) {
          console.log("Intersection observer triggered, loading more...");
          loadMoreProducts();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    if (loadingRef.current && hasMoreProducts) {
      observer.observe(loadingRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [
    loadMoreProducts,
    hasMoreProducts,
    isLoadingProducts,
    isFetching,
    isLoadingMore,
    allProducts.length,
  ]);

  // Handle product click
  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  // Skeleton loading component
  const SkeletonCard = () => (
    <div className="product-crad">
      <div className="product-image">
        <div className="skeleton skeleton-img" />
      </div>
      <div className="product-info-class">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-review" />
        <div className="skeleton skeleton-price" />
        <div className="skeleton skeleton-offer" />
        <div className="skeleton skeleton-btn" />
        <div className="skeleton skeleton-shipping" />
      </div>
    </div>
  );

  // Error handling
  if (error) {
    return (
      <div className="container">
        <h1 className="section-title">المزيد مما تحب</h1>
        <div className="error-message">
          <p>حدث خطأ في تحميل المنتجات. يرجى المحاولة مرة أخرى.</p>
          <Button onClick={() => window.location.reload()}>
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container">
        <h1 className="section-title">المزيد مما تحب</h1>

        {/* Initial loading state */}
        {isLoadingProducts && allProducts.length === 0 ? (
          <div className="more-loves-products-container">
            {[...Array(5)].map((_, idx) => (
              <SkeletonCard key={`skeleton-${idx}`} />
            ))}
          </div>
        ) : (
          <>
            {/* Products grid with animated rows */}
            <div className="">
              {rows.map((rowItems, index) => (
                <MotionProductRow
                  key={`row-${index}`}
                  rowItems={rowItems}
                  onProductClick={handleProductClick}
                />
              ))}
            </div>

            {/* Simple loading indicator for loading more */}
            {isLoadingMore && (
              <div className="loading-trigger">
                <div className="loading-spinner">
                  <span>جاري تحميل المزيد...</span>
                </div>
              </div>
            )}

            {/* Intersection observer target */}
            {hasMoreProducts && !isLoadingMore && (
              <div ref={loadingRef} className="loading-trigger">
                <div className="load-more-message">
                  <span>اسحب لأسفل لتحميل المزيد</span>
                </div>
              </div>
            )}

            {/* No more products message */}
            {!hasMoreProducts && allProducts.length > 0 && (
              <div className="no-more-products">
                <p>تم عرض جميع المنتجات المتاحة</p>
              </div>
            )}

            {/* No products found */}
            {!isLoadingProducts && allProducts.length === 0 && !error && (
              <div className="no-products">
                <p>لا توجد منتجات متاحة حالياً</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Styles */}
      <style>{`
        .skeleton {
          background: linear-gradient(90deg, #ececec 25%, #f5f5f5 37%, #ececec 63%);
          background-size: 400% 100%;
          animation: skeleton-shimmer 1.2s ease-in-out infinite;
          border-radius: 6px;
        }
        .skeleton-img { width: 100%; height: 140px; margin-bottom: 12px; }
        .skeleton-title { width: 80%; height: 18px; margin: 8px 0; }
        .skeleton-review { width: 60%; height: 14px; margin: 6px 0; }
        .skeleton-price { width: 40%; height: 16px; margin: 8px 0; }
        .skeleton-offer { width: 70%; height: 14px; margin: 8px 0; }
        .skeleton-btn { width: 50%; height: 28px; margin: 10px 0; }
        .skeleton-shipping { width: 60%; height: 14px; margin: 8px 0; }

        @keyframes skeleton-shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: 0 0; }
        }

        .loading-spinner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #666;
          font-size: 14px;
          padding: 16px;
        }

        .loading-spinner::before {
          content: '';
          width: 16px;
          height: 16px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #666;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loading-trigger {
          height: 60px;
          margin: 20px 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .load-more-message {
          color: #999;
          font-size: 12px;
          text-align: center;
          padding: 10px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-message, .no-more-products, .no-products {
          text-align: center;
          padding: 2rem;
          color: #666;
        }

        .error-message {
          background: #fee;
          border: 1px solid #fcc;
          border-radius: 8px;
          margin: 1rem 0;
        }

        .error-message p {
          color: #c33;
          margin-bottom: 1rem;
        }
      `}</style>
    </>
  );
}
