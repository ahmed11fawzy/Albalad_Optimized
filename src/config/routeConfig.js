import { lazy } from "react";

// Lazy load all components
const Home = lazy(() => import("../compenets/home_compenent"));
const ProductDetail = lazy(() => import("../compenets/productDetailes"));
const Cart = lazy(() => import("../compenets/cart"));
const Payment = lazy(() => import("../compenets/payment"));
const AddNewAddressDialog = lazy(() =>
  import("../compenets/addnewAddressDialog")
);
const LoginDialog = lazy(() =>
  import("../compenets/Auth").then((module) => ({
    default: module.LoginDialog,
  }))
);
const RegisterPage = lazy(() =>
  import("../compenets/Auth").then((module) => ({
    default: module.RegisterPage,
  }))
);
const RegisterBuyerPage = lazy(() =>
  import("../compenets/Auth").then((module) => ({
    default: module.RegisterBuyerPage,
  }))
);
const RegisterSellerPage = lazy(() =>
  import("../compenets/Auth").then((module) => ({
    default: module.RegisterSellerPage,
  }))
);
const StoreProfile = lazy(() => import("../compenets/store_profile"));
const MyWallet = lazy(() => import("../compenets/myWallet"));
const SubCategory = lazy(() => import("../compenets/subCategory"));
const CategoryProducts = lazy(() => import("../compenets/CategoryProducts"));
const SearchProduct = lazy(() => import("../compenets/searchProduct"));
const HistoricJeddah = lazy(() => import("../compenets/HistoricJeddah"));
const ComplaintForm = lazy(() => import("../compenets/ComplaintForm"));
const ContactForm = lazy(() => import("../compenets/contactForm"));
const BoundleOffers = lazy(() => import("../compenets/boundleOffers"));
const OrderTracking = lazy(() => import("../compenets/trackingOrders"));
const WishList = lazy(() => import("../compenets/wishList"));
const BuyXGetYOffers = lazy(() => import("../compenets/BuyXGetYOffers"));
const MyCoupons = lazy(() => import("../compenets/MyCoupons"));
const SelectedForYou = lazy(() => import("../compenets/SelectedForYou"));
const Chats = lazy(() => import("../pages/Chats"));
const EventDetails = lazy(() => import("../pages/EventDetails"));
const PlaceDetailsPage = lazy(() => import("../pages/HistoricJeddahCategory"));
const SuperOffers = lazy(() => import("../compenets/supperOffers"));
const Market = lazy(() => import("../compenets/Market/Market"));

// Route configurations
export const mainLayoutRoutes = [
  { path: "", element: Home, index: true },
  { path: "product/:id", element: ProductDetail },
  { path: "cart", element: Cart },
  { path: "payment", element: Payment },
  { path: "store-profile/:storeId", element: StoreProfile },
  { path: "my-wallet", element: MyWallet },
  { path: "sub-categories/:id", element: SubCategory },
  { path: "category/:id", element: CategoryProducts },
  { path: "searchProduct/:query", element: SearchProduct },
  { path: "historic-jeddah", element: HistoricJeddah },
  { path: "historic-jeddah/:id", element: PlaceDetailsPage },
  { path: "markets-stores/:marketId", element: Market },
  { path: "boundle-offers", element: BoundleOffers },
  { path: "supper-offers", element: SuperOffers },
  { path: "tracking-orders", element: OrderTracking },
  { path: "wishlist", element: WishList },
  { path: "buy-x-get-y-offers", element: BuyXGetYOffers },
  { path: "choice-for-you", element: SelectedForYou },
  { path: "my-coupons", element: MyCoupons },
  { path: "event/:id", element: EventDetails },
  { path: "chats", element: Chats },
];

export const minimalLayoutRoutes = [
  { path: "complaints", element: ComplaintForm },
  { path: "contact", element: ContactForm },
];

export const authLayoutRoutes = [
  { path: "register", element: RegisterPage },
  { path: "register-buyer", element: RegisterBuyerPage },
  { path: "register-seller", element: RegisterSellerPage },
];

export const modalRoutes = [
  {
    path: "add-address",
    element: () => (
      <AddNewAddressDialog open={true} onClose={() => {}} onSave={() => {}} />
    ),
  },
  {
    path: "login",
    element: () => <LoginDialog open={true} onClose={() => {}} />,
  },
];
