import { API_BASE_URL } from "../config/config.js"
import { renderNavbar } from "../components/navbar.js"
import { renderFooter } from "../components/footer.js"


/* ======================= DOM ELEMENT ======================= */
const orderHistory = document.querySelector(".order-history")


/* ======================= FORMAT DATE ======================= */
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  })
}


/* ======================= EMPTY ORDERS UI ======================= */
const emptyOrders = () => {
  const container = document.querySelector("#orders-container"); // Adjust selector if needed
  container.innerHTML = `
    <div class="empty-orders">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
      </div>
      <h2>No orders yet</h2>
      <p>When you place an order, it will appear here. Ready to find your next pair of DVL denim?</p>
      <a href="index.html" class="shop-now-btn">Explore Collections</a>
    </div>
  `;
};


/* ======================= RENDER ORDERS ======================= */
const renderOrder = async () => {

  const token = localStorage.getItem("token")
  if (!token) {
    window.location.href = "signup.html"
    return
  }

  const res = await fetch(`${API_BASE_URL}/order`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })

  const data = await res.json()
  const orders = data.order
  console.log(data)
  console.log(orders)

  if (orders.length === 0){
    emptyOrders()
  }

  orders.forEach(order => {
    const orderCard = document.createElement("a")
    orderCard.classList.add("order-card")
    orderCard.href = `order-details.html?orderId=${order._id}`

    const orderStatus = document.createElement("span")

    const orderDate = document.createElement("p")
    orderDate.classList.add("order-date")

    if (order.status === "Pending") {
      orderStatus.classList.add("order-status", "pending")
      orderStatus.textContent = "Pending"
      orderDate.textContent = `Order placed on ${formatDate(order.createdAt)}`
    }
    else if (order.status === "Shipped") {
      orderStatus.classList.add("order-status", "shipped")
      orderStatus.textContent = "Shipped"
      orderDate.textContent = `Order shipped on ${formatDate(order.shippedAt)}`
    }
    else if (order.status === "Delivered") {
      orderStatus.classList.add("order-status", "delivered")
      orderStatus.textContent = "Delivered"
      orderDate.textContent = `Order delivered on ${formatDate(order.deliveredAt)}`
    }
    else {
      orderStatus.classList.add("order-status", "cancelled")
      orderStatus.textContent = "Cancelled"
      orderDate.textContent = `Order cancelled on ${formatDate(order.cancelledAt)}`
    }

    const orderMetaTop = document.createElement("div")
    orderMetaTop.classList.add("order-meta-top")

    const paymentMethod = document.createElement("span")
    paymentMethod.classList.add("payment-method")
    paymentMethod.textContent = "COD"

    const orderTotal = document.createElement("span")
    orderTotal.classList.add("order-total")
    orderTotal.textContent = `₹${order.totalAmount}`

    const imageWrapper = document.createElement("div")
    imageWrapper.classList.add("order-image-wrapper")

    const orderImage = document.createElement("img")
    orderImage.classList.add("order-image")
    orderImage.src = order.items[0].images?.[0] || "placeholder.jpg"

    imageWrapper.append(orderImage)

    if (order.items.length > 1) {
      const moreCount = document.createElement("span")
      moreCount.classList.add("more-items")
      moreCount.textContent = `+${order.items.length - 1}`
      imageWrapper.append(moreCount)
    }

    const orderInfo = document.createElement("div")
    orderInfo.classList.add("order-info")

    const orderId = document.createElement("p")
    orderId.classList.add("order-id")
    orderId.textContent = `Order id: #${order._id}`

    // appending
    orderMetaTop.append(paymentMethod, orderTotal)
    orderInfo.append(orderId, orderDate)

    orderCard.append(orderStatus, orderMetaTop, imageWrapper, orderInfo)

    orderHistory.append(orderCard)
  });
}


/* ======================= INIT ======================= */
document.addEventListener("DOMContentLoaded", ()=>{
  renderNavbar()
  renderOrder()
  renderFooter()
})
