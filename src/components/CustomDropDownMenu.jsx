import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Box,
  useTheme,
  styled,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CategoryIcon from "@mui/icons-material/Category";
import { useGetCategoriesQuery } from "../redux/Slices/categoriesApi";
import { height } from "@mui/system";

const complementaryColors = [
  "#b88c36",
  "#d4a437",
  "#8b6f2a",
  "#e0b565",
  "#a67c00",
  "#c89b3c",
  "#f4c430",
  "#8c5523",
  "#d9a441",
  "#b88c36",
];

const getRandomColor = () => {
  return complementaryColors[
    Math.floor(Math.random() * complementaryColors.length)
  ];
};

const StyledMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 8,
    width: "100%",
    maxWidth: "1200px",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
    backgroundColor: theme.palette.background.paper,
    height: "auto",
    overflow: "hidden",
    // Ensure the menu has proper layering
    zIndex: theme.zIndex.modal + 1,
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  color: "#111111",
  textTransform: "none",
  fontWeight: 500,
  fontSize: "1rem",

  direction: "ltr",
}));

const CategoryBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  minWidth: 200,
  /* padding: theme.spacing(1), */
  // Add will-change for better performance
  willChange: "transform",
}));

const MenuWrapper = styled(Box)(({ theme }) => ({
  height: "210px",
  overflowY: "auto",
  overflowX: "hidden",
  padding: theme.spacing(2),
  scrollbarWidth: "thin",
  // Optimize scrolling performance
  scrollBehavior: "smooth",
  willChange: "scroll-position",

  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.grey[400],
    borderRadius: "4px",
    "&:hover": {
      backgroundColor: theme.palette.grey[500],
    },
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: theme.palette.grey[100],
  },

  // Optimize for touch devices
  "-webkit-overflow-scrolling": "touch",

  // Improve scroll performance
  "&": {
    transform: "translateZ(0)", // Force hardware acceleration
  },
}));

const CategoriesGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: theme.spacing(2),
  width: "100%",
  // Performance optimization for large grids
  containIntrinsicSize: "auto 500px",
  contentVisibility: "auto",

  "& .category-box": {
    paddingBottom: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  [theme.breakpoints.down("lg")]: {
    gridTemplateColumns: "repeat(3, 1fr)",
  },
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "repeat(2, 1fr)",
  },
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
  },
}));

const CategoryTitle = styled(Box)(({ theme }) => ({
  position: "relative",
  marginBottom: theme.spacing(1),
  cursor: "pointer",
  // Improve interaction performance
  "&:hover": {
    transform: "translateY(-1px)",
    transition: "transform 0.2s ease",
  },
}));

const CategoryHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const CategoryLine = styled(Box)(({ theme }) => ({
  content: '""',
  display: "block",
  width: "100%",
  height: "1px",
  backgroundColor: getRandomColor(),
  marginTop: theme.spacing(0.5),
}));

const CategoryImage = styled("img")(({ theme }) => ({
  width: 24,
  height: 24,
  objectFit: "contain",
  borderRadius: "50%",
  // Optimize image loading
  loading: "lazy",
}));

const SubCategoriesWrapper = styled(Box)(({ theme, isOpen }) => ({
  maxHeight: isOpen ? "1000px" : "0",
  overflow: "hidden",
  transition: "max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  // Performance optimization
  willChange: isOpen ? "max-height" : "auto",
}));

const SkeletonCategory = React.memo(() => (
  <CategoryBox className="category-box">
    <CategoryTitle>
      <CategoryHeader>
        <div className="skeleton skeleton-icon" />
        <div className="skeleton skeleton-title" />
      </CategoryHeader>
      <CategoryLine />
    </CategoryTitle>
    <SubCategoriesWrapper isOpen={false}>
      <div className="skeleton skeleton-subcategory" />
      <div className="skeleton skeleton-subcategory" />
    </SubCategoriesWrapper>
  </CategoryBox>
));

const CustomDropDownMenu = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreCategories, setHasMoreCategories] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isMenuActive, setIsMenuActive] = useState(false);

  const observerRef = useRef();
  const loadingRef = useRef();
  const menuRef = useRef();
  const scrollTimeoutRef = useRef();
  const lastScrollTop = useRef(0);
  const originalBodyOverflow = useRef("");

  const {
    data,
    isLoading: isLoadingCategories,
    isFetching,
    error,
  } = useGetCategoriesQuery(currentPage);
  console.log("🚀 ~ CustomDropDownMenu ~ data:", data);
  console.log("🚀 ~ CustomDropDownMenu ~ categories:1", categories);

  // Memoized scroll handler for better performance
  const handleMenuScroll = useCallback(
    (event) => {
      // Throttle scroll events for performance
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        const { scrollTop, scrollHeight, clientHeight } = event.target;
        const scrollPercentage = Math.round(
          (scrollTop / (scrollHeight - clientHeight)) * 100
        );

        // Only log significant scroll changes
        if (Math.abs(scrollTop - lastScrollTop.current) > 50) {
          /* console.log('📜 Menu Scrolling:', {
          scrollTop,
          scrollHeight,
          clientHeight,
          scrollPercentage: `${scrollPercentage}%`,
          isNearBottom: scrollPercentage > 80
        }); */
          lastScrollTop.current = scrollTop;
        }

        // Trigger load more when near bottom
        if (
          scrollPercentage > 50 &&
          hasMoreCategories &&
          !isLoadingMore &&
          !isFetching
        ) {
          // console.log('🎯 Scroll triggered - loading more categories');
          loadMoreCategories();
        }
      }, 16); // ~60fps throttling
    },
    [hasMoreCategories, isLoadingMore, isFetching]
  );

  // Enhanced scroll isolation with proper cleanup
  const handleMenuMouseEnter = useCallback(() => {
    if (!originalBodyOverflow.current) {
      originalBodyOverflow.current = document.body.style.overflow || "";
    }
    document.body.style.overflow = "hidden";
    setIsMenuActive(true);

    // console.log('🖱️ Mouse entered menu - body scroll disabled');
  }, []);

  const handleMenuMouseLeave = useCallback(() => {
    document.body.style.overflow = originalBodyOverflow.current;
    setIsMenuActive(false);

    // console.log('🖱️ Mouse left menu - body scroll restored');
  }, []);

  // Handle keyboard events for accessibility
  const handleMenuKeyDown = useCallback((event) => {
    if (event.key === "Escape") {
      handleMenuClose();
    }
  }, []);

  // Cleanup scroll isolation when menu closes or component unmounts
  useEffect(() => {
    if (!anchorEl) {
      document.body.style.overflow = originalBodyOverflow.current;
      setIsMenuActive(false);
    }

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      document.body.style.overflow = originalBodyOverflow.current;
    };
  }, [anchorEl]);

  // Update categories when new data arrives with deduplication
  useEffect(() => {
    if (data?.data && Array.isArray(data.data)) {
      const newCategories = data.data;
      const totalPages = data.last_page || Infinity;
      const hasMore = currentPage < totalPages && newCategories.length > 0;

      // console.log('🔄 New Categories Loaded:', {
      //   count: newCategories.length,
      //   page: currentPage,
      //   totalPages,
      //   hasMore,
      //   categories: newCategories.map(cat => ({ id: cat.id, name: cat.name }))
      // });

      if (currentPage === 1) {
        setCategories(newCategories);
        console.log("🚀 ~ CustomDropDownMenu ~ categories:1", categories);
      } else {
        setCategories((prev) => {
          // Use Map for better deduplication performance
          const categoriesMap = new Map(prev.map((cat) => [cat.id, cat]));
          newCategories.forEach((newCat) => {
            if (!categoriesMap.has(newCat.id)) {
              categoriesMap.set(newCat.id, newCat);
            }
          });
          return Array.from(categoriesMap.values());
        });
      }

      setHasMoreCategories(hasMore);
      setIsLoadingMore(false);
    } else if (!isLoadingCategories && !isFetching) {
      setHasMoreCategories(false);
      setIsLoadingMore(false);
    }
  }, [data, currentPage, isLoadingCategories, isFetching]);

  // Optimized load more function
  const loadMoreCategories = useCallback(() => {
    if (!isLoadingMore && !isFetching && hasMoreCategories) {
      // console.log('📄 Loading more categories, page:', currentPage + 1);
      setIsLoadingMore(true);
      setCurrentPage((prev) => prev + 1);
    }
  }, [isLoadingMore, isFetching, hasMoreCategories, currentPage]);

  // Enhanced Intersection Observer with performance optimizations
  useEffect(() => {
    if (!menuRef.current || !loadingRef.current || !anchorEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (
          entry.isIntersecting &&
          hasMoreCategories &&
          !isFetching &&
          !isLoadingMore
        ) {
          // console.log('🎯 Intersection Observer triggered - loading more categories');
          loadMoreCategories();
          console.log("new categories loaded", categories);
        }
      },
      {
        root: menuRef.current,
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    const currentLoadingRef = loadingRef.current;
    if (currentLoadingRef) {
      observer.observe(currentLoadingRef);
    }
    observerRef.current = observer;

    return () => {
      if (currentLoadingRef) {
        observer.unobserve(currentLoadingRef);
      }
      observer.disconnect();
    };
  }, [
    loadMoreCategories,
    hasMoreCategories,
    isFetching,
    isLoadingMore,
    anchorEl,
  ]);

  const handleMenuOpen = useCallback(
    (event) => {
      setAnchorEl(event.currentTarget);
      // Reset pagination when reopening
      if (currentPage > 1) {
        setCurrentPage(1);
        setCategories([]);
      }
    },
    [currentPage]
  );

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    setExpandedCategories({}); // Reset expanded state
  }, []);

  const handleCategoryToggle = useCallback((categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  }, []);

  // Memoize skeleton loaders for better performance
  const skeletonLoaders = useMemo(
    () =>
      [...Array(8)].map((_, idx) => (
        <SkeletonCategory key={`skeleton-${idx}`} />
      )),
    []
  );

  return (
    <>
      <Toolbar>
        <StyledButton
          onClick={handleMenuOpen}
          endIcon={<ArrowDropDownIcon />}
          aria-label="فتح قائمة الفئات"
        >
          الفئات
        </StyledButton>
        <StyledMenu
          id="scrollableMenu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
          disableScrollLock
          keepMounted={false}
          onMouseEnter={handleMenuMouseEnter}
          onMouseLeave={handleMenuMouseLeave}
          onKeyDown={handleMenuKeyDown}
          // Prevent click outside from closing when scrolling
          disableAutoFocus
          disableEnforceFocus
        >
          <MenuWrapper
            id="scrollableDiv"
            ref={menuRef}
            onScroll={handleMenuScroll}
            role="listbox"
            aria-label="قائمة الفئات"
          >
            {isLoadingCategories && !categories.length ? (
              <CategoriesGrid>{skeletonLoaders}</CategoriesGrid>
            ) : error ? (
              <Typography
                sx={{ textAlign: "center", padding: "20px", color: "#f44336" }}
                role="alert"
              >
                حدث خطأ أثناء تحميل الفئات. يرجى المحاولة لاحقاً.
              </Typography>
            ) : (
              <>
                <CategoriesGrid>
                  {categories.map((category) => (
                    <CategoryBox key={category.id} className="category-box">
                      <CategoryTitle
                        onClick={() => handleCategoryToggle(category.id)}
                        role="button"
                        tabIndex={0}
                        aria-expanded={expandedCategories[category.id] || false}
                        aria-label={`توسيع فئة ${category.name}`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleCategoryToggle(category.id);
                          }
                        }}
                      >
                        <CategoryHeader>
                          {category.image ? (
                            <CategoryImage
                              src={category.image}
                              alt={`أيقونة ${category.name}`}
                              loading="lazy"
                            />
                          ) : (
                            <CategoryIcon
                              sx={{ fontSize: 24, color: getRandomColor() }}
                            />
                          )}
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                              color: getRandomColor(),
                            }}
                          >
                            {category.name}
                          </Typography>
                        </CategoryHeader>
                        <CategoryLine />
                      </CategoryTitle>
                      <SubCategoriesWrapper
                        isOpen={expandedCategories[category.id]}
                      >
                        {category.children_all &&
                        category.children_all.length > 0 ? (
                          category.children_all.map((subCategory) => (
                            <StyledMenuItem
                              key={subCategory.id}
                              component={RouterLink}
                              to={`/sub-categories/${subCategory.id}`}
                              onClick={handleMenuClose}
                              role="menuitem"
                            >
                              {subCategory.name}
                            </StyledMenuItem>
                          ))
                        ) : (
                          <StyledMenuItem disabled>
                            لا توجد فئات فرعية
                          </StyledMenuItem>
                        )}
                      </SubCategoriesWrapper>
                    </CategoryBox>
                  ))}
                </CategoriesGrid>

                {hasMoreCategories && (
                  <Box
                    ref={loadingRef}
                    className="loading-trigger"
                    role="status"
                    aria-live="polite"
                  >
                    {isLoadingMore && (
                      <Box className="loading-spinner">
                        <Typography>جاري تحميل المزيد من الفئات...</Typography>
                      </Box>
                    )}
                  </Box>
                )}

                {!hasMoreCategories && categories.length > 0 && (
                  <Typography
                    sx={{ textAlign: "center", padding: "10px", color: "#666" }}
                    role="status"
                  >
                    تم عرض جميع الفئات المتاحة
                  </Typography>
                )}

                {!isLoadingCategories && categories.length === 0 && (
                  <Typography
                    sx={{ textAlign: "center", padding: "10px", color: "#666" }}
                    role="status"
                  >
                    لا توجد فئات متاحة حالياً
                  </Typography>
                )}
              </>
            )}
          </MenuWrapper>
        </StyledMenu>
      </Toolbar>

      <style>{`
        .skeleton {
          background: linear-gradient(90deg, #ececec 25%, #f5f5f5 37%, #ececec 63%);
          background-size: 400% 100%;
          animation: skeleton-shimmer 1.2s ease-in-out infinite;
          border-radius: 6px;
          will-change: background-position;
        }
        .skeleton-icon { width: 24px; height: 24px; }
        .skeleton-title { width: 80%; height: 18px; margin: 8px 0; }
        .skeleton-subcategory { width: 60%; height: 14px; margin: 6px 0; }
        
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
          will-change: transform;
        }

        .loading-trigger {
          height: 60px;
          margin: 20px 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Smooth scroll behavior for supported browsers */
        @supports (scroll-behavior: smooth) {
          #scrollableDiv {
            scroll-behavior: smooth;
          }
        }

        /* Optimize performance for large lists */
        .category-box {
          contain: layout style paint;
        }
      `}</style>
    </>
  );
};

export default CustomDropDownMenu;
