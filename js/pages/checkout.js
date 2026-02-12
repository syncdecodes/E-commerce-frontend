import { API_BASE_URL } from "../config/config.js";
import { renderNavbar } from "../components/navbar.js";
import { showToast } from "../components/toast.js";


/* ======================= DOM ELEMENTS ======================= */
const checkoutContainer = document.querySelector(".checkout-container")
const addressSection = document.querySelector(".address-section")
const summarySection = document.querySelector(".summary-section")



/* ======================= PLACE ORDER ======================= */
const placeOrder = async (address) => {
    const token = localStorage.getItem("token")

    if (!token) {
        window.location.href = "signup.html"
    }

    const cartTotalsRes = await fetch(`${API_BASE_URL}/cart/total`, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })

    const cartTotalsData = await cartTotalsRes.json()

    if (cartTotalsData.totalQuantity === 0) {
        showToast("Cart is empty", "error")
        return
    }

    const res = await fetch(`${API_BASE_URL}/order`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            fullName: address.fullName,
            phone: address.phone,
            addressLine: address.addressLine,
            city: address.city,
            state: address.state,
            pincode: address.pincode
        })
    })
    const data = await res.json()
    console.log(data)

    if (res.ok) {
        showToast("Order placed successfully")
        setTimeout(() => {
            window.location.href = "order.html"
        }, 1500);
    }
}


/* ======================= RENDER ADDRESS ======================= */
const renderAddress = async (address) => {

    /* ADDRESS SECTION */
    const sectionHeader = document.createElement("div")
    sectionHeader.classList.add("section-header")

    const title = document.createElement("h2")
    title.textContent = "Delivery Address"

    const editAddress = document.createElement("a")
    editAddress.classList.add("change-link")
    editAddress.textContent = "Edit Address"
    editAddress.href = "address.html"

    editAddress.addEventListener("click", () => {
        localStorage.setItem("redirectAfterAddress", "checkout")
    })

    sectionHeader.append(title, editAddress)

    const addressDetails = document.createElement("div")
    addressDetails.classList.add("address-details")

    addressDetails.innerHTML =
        `
        <p class="name">${address.fullName}</p>
        <p class="phone">${address.phone}</p>
        <p class="line">${address.addressLine}</p>
        <p class="city">${address.city}, ${address.state} - ${address.pincode}</p>
        `
    addressSection.append(sectionHeader, addressDetails)

    /* APPEND */
    checkoutContainer.append(addressSection, summarySection)
}


/* ======================= RENDER SUMMARY ======================= */
const renderSummary = async (address, orderTotalsData) => {

    /* ORDER SUMMARY */
    summarySection.innerHTML =
        `
        <h2>Order Summary</h2>

        <div class="summary-row">
            <span>Total Items</span>
            <span id="total-items">${orderTotalsData.totalQuantity}</span>
        </div>

        <div class="summary-row">
            <span>Subtotal</span>
            <span id="subtotal">₹${orderTotalsData.totalPrice}</span>
        </div>

        <div class="summary-row">
            <span>Delivery</span>
            <span class="free">FREE</span>
        </div>

        <div class="summary-row total">
            <span>Total</span>
            <span id="total-price">₹${orderTotalsData.totalPrice}</span>
        </div>
        `

    /* PLACE ORDER */
    const placeOrderBtn = document.createElement("button")
    placeOrderBtn.classList.add("place-order-btn")
    placeOrderBtn.textContent = "Place Order"

    placeOrderBtn.addEventListener("click", () => {
        try {
            placeOrder(address)
        }
        catch (error) {
            alert(error.message)
        }
    })

    checkoutContainer.append(placeOrderBtn)
}



/* ======================= INIT ======================= */
document.addEventListener("DOMContentLoaded", async () => {

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "signup.html";
        return;
    }

    /* ADDRESS RESPONSE */
    const addressResponse = await fetch(`${API_BASE_URL}/address`, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    if (!addressResponse.ok) {
        localStorage.setItem("redirectAfterAddress", "checkout")
        window.location.href = "address.html"
        return
    }

    const addressData = await addressResponse.json()
    const address = addressData.address

    /* ORDER TOTALS RESPONSE */
    const orderTotalResponse = await fetch(`${API_BASE_URL}/cart/total`, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    const orderTotalsData = await orderTotalResponse.json()


    renderNavbar()
    renderAddress(address)
    renderSummary(address, orderTotalsData)
})
