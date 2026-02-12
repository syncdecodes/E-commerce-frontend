import { API_BASE_URL } from "../config/config.js"

const navbarContainer = document.querySelector("#navbar")

export const renderNavbar = async () => {

    const token = localStorage.getItem("token")
    navbarContainer.innerHTML =
        `
    <div class="navbar">
        <a class="logo" href="index.html">DVL</a>

        <nav>
            <a href = "index.html" class="home" >Home</a>
            <a href = "cart.html" class="cart">
                Cart <span class="cart-count" id="cart-count">0</span>
            </a>
            <a href="order.html" class="orders" >Orders</a>
            <a href="${token ? "profile.html" : "login.html"}" class="login-account">
                ${token ? "Account" : "Login"}
            </a>
        </nav>
    </div>
    `

    if (token) {
        updateCartCount()
    }
}

export const updateCartCount = async () => {

    const token = localStorage.getItem("token")
    if (!token) return null;

    try {
        const res = await fetch(`${API_BASE_URL}/cart/total`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

        const data = await res.json()

        const countEl = document.querySelector("#cart-count")
        if (countEl) {
            countEl.textContent = data.totalQuantity || 0
        }
        return data;
    }
    catch (error) {
        console.log("Failed to fetch cart total", error.message)
        return null;
    }
}