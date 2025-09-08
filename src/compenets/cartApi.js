// دالة إضافة أو تعديل منتج في السلة
export async function addOrUpdateCartItem({
  product_id,
  product_variant_id,
  quantity,
}) {
  let userId = localStorage.getItem("user_id");
  let sessionId = localStorage.getItem("session_id");
  if (!userId && !sessionId) {
    sessionId = Math.floor(Math.random() * 1_000_000_000);
    localStorage.setItem("session_id", sessionId);
  } else if (userId) {
  } else if (sessionId) {
  }

  const headers = {
    "Content-Type": "application/json",
  };
  if (userId) {
    const userToken = localStorage.getItem("user_token");
    if (userToken) {
      headers["Authorization"] = `Bearer ${userToken}`;
    }
  }
  let bodyData = {
    user_id: userId ? userId : sessionId,
    quantity: quantity,
  };
  if (product_variant_id) {
    bodyData.product_variant_id = product_variant_id;
  } else if (product_id) {
    bodyData.product_id = product_id;
  }
  const response = await fetch("https://back.al-balad.sa/carts/add-item", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(bodyData),
  });
  const data = await response.json();
  return data;
}
