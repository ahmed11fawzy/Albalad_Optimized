# Redux Products API Documentation

This document explains how to use the Redux queries for product operations in the application.

## Available Queries and Mutations

### 1. Get Product Details

Fetches detailed information about a specific product.

```javascript
import { useGetProductDetailsQuery } from "../redux/Slices/productsApi";

function ProductComponent({ productId }) {
  const {
    data: productData,
    isLoading,
    error,
    refetch,
  } = useGetProductDetailsQuery(productId, {
    skip: !productId, // Skip if no productId
  });

  const product = productData?.data;

  if (isLoading) return <div>جاري التحميل...</div>;
  if (error) return <div>حدث خطأ في تحميل المنتج</div>;
  if (!product) return <div>لم يتم العثور على المنتج</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>السعر: {product.price} ر.س</p>
      {/* Other product details */}
    </div>
  );
}
```

### 2. Get Products by Category

Fetches products that belong to a specific category.

```javascript
import { useGetProductsByCategoryQuery } from "../redux/Slices/productsApi";

function CategoryProducts({ categoryId }) {
  const {
    data: categoryData,
    isLoading,
    error,
  } = useGetProductsByCategoryQuery(categoryId, {
    skip: !categoryId,
  });

  const products = categoryData?.data?.products || [];

  if (isLoading) return <div>جاري تحميل المنتجات...</div>;
  if (error) return <div>حدث خطأ في تحميل المنتجات</div>;

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.price} ر.س</p>
        </div>
      ))}
    </div>
  );
}
```

### 3. Get All Products

Fetches all available products.

```javascript
import { useGetAllProductsQuery } from "../redux/Slices/productsApi";

function AllProducts() {
  const {
    data: productsData,
    isLoading,
    error,
  } = useGetAllProductsQuery();

  const products = productsData?.data?.products || [];

  return (
    <div>
      {isLoading && <div>جاري التحميل...</div>}
      {error && <div>حدث خطأ في تحميل المنتجات</div>}
      {products.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

### 4. Add to Cart (Mutation)

Adds a product or product variant to the shopping cart.

```javascript
import { useAddToCartMutation } from "../redux/Slices/productsApi";

function AddToCartButton({
  product,
  selectedVariant,
  quantity = 1,
}) {
  const [addToCart, { isLoading, error }] =
    useAddToCartMutation();

  const handleAddToCart = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      const sessionId =
        localStorage.getItem("session_id") ||
        Math.floor(Math.random() * 1_000_000_000);

      const cartData = {
        user_id: userId || sessionId,
        quantity: quantity,
      };

      if (selectedVariant) {
        cartData.product_variant_id = selectedVariant.id;
      } else {
        cartData.product_id = product.id;
      }

      const result = await addToCart(cartData).unwrap();

      if (result.status) {
        alert("تمت إضافة المنتج إلى العربة بنجاح!");
      } else {
        alert("فشل في إضافة المنتج إلى العربة");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("حدث خطأ أثناء إضافة المنتج إلى العربة");
    }
  };

  return (
    <button onClick={handleAddToCart} disabled={isLoading}>
      {isLoading ? "جاري الإضافة..." : "أضف إلى العربة"}
    </button>
  );
}
```

## Query Options

### Skip Query

Use the `skip` option to conditionally execute queries:

```javascript
const { data } = useGetProductDetailsQuery(productId, {
  skip: !productId || !shouldFetch,
});
```

### Refetch

Manually refetch data when needed:

```javascript
const { data, refetch } =
  useGetProductDetailsQuery(productId);

// Later, refetch the data
const handleRefresh = () => {
  refetch();
};
```

### Error Handling

Handle errors gracefully:

```javascript
const { data, error, isLoading } =
  useGetProductDetailsQuery(productId);

if (error) {
  console.error("API Error:", error);
  return <div>حدث خطأ: {error.message}</div>;
}
```

## Cache Management

The queries automatically cache data and invalidate when necessary:

- `getProductDetails` is tagged with specific product ID and general "Product" tag
- `getProductsByCategory` is tagged with category ID and "Product" tag
- `getAllProducts` is tagged with "Product" tag
- `addToCart` invalidates "Cart" tag

This ensures that:

1. Product data is cached and reused efficiently
2. Related queries are automatically refetched when data changes
3. Cart operations properly update related UI components

## Best Practices

1. **Always handle loading states**: Show appropriate loading indicators
2. **Handle errors gracefully**: Display user-friendly error messages
3. **Use skip option**: Avoid unnecessary API calls when data isn't needed
4. **Leverage caching**: RTK Query automatically caches data, reducing redundant requests
5. **Use mutations properly**: Handle success and error cases for mutations like addToCart
