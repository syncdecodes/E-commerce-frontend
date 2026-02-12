import { API_BASE_URL } from "../config/config.js"
import { renderNavbar } from "../components/navbar.js"
import { showToast } from "../components/toast.js"
import { renderFooter } from "../components/footer.js"

const profileCard = document.querySelector(".profile-card")
const profileAddressCard = document.querySelector(".profile-address-card")
const profileActions = document.querySelector(".profile-actions")


/* ======================= HELPERS ======================= */
const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric"
    })
}

/* ======================= LOGOUT ======================= */
const handleLogout = () => {
    localStorage.removeItem("token")
    showToast("Logged out successfully", "info")

    setTimeout(() => {
        window.location.href = "index.html"
    }, 1200);

}


const renderUserDetails = async () => {
    const token = localStorage.getItem("token")

    const userRes = await fetch(`${API_BASE_URL}/auth/user`, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    const userData = await userRes.json()
    const user = userData.user
    console.log(userData)
    console.log(user)

    const addressRes = await fetch(`${API_BASE_URL}/address`, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })

    const adressData = await addressRes.json()
    const address = adressData.address
    console.log(adressData)
    console.log(address)


    profileCard.innerHTML =
        `
    <div class="profile-header">
        <div class="avatar">👤</div>
        <div>
          <h2 class="user-name">${address ? address.fullName : user.email.split("@")[0]}</h2>
          <p class="user-email">${user.email}</p>
        </div>
      </div>

      <div class="profile-details">
      ${address ?
            `<div class="detail-row">
          <span>Phone</span>
          <span>${address.phone}</span>
        </div>` : ""}
        

        <div class="detail-row">
          <span>Joined</span>
          <span>${formatDate(user.createdAt)}</span>
        </div>
    </div>
    `

    /* ADDRESS CARD */
    if (!address) {
        profileAddressCard.innerHTML =
            `
        <div class="empty-address">
          <p>No address saved</p>
          <a href="address.html" class="link">Add Address</a>
        </div>
        `
    }
    else {
        profileAddressCard.innerHTML =
            `
    <div class="section-header">
        <h2>Saved Address</h2>
        <a href="address.html" class="link">Edit</a>
      </div>

      <p class="address-name">${address.fullName}</p>
      <p>${address.addressLine}</p>
      <p>${address.state}, ${address.city} - ${address.pincode}</p>
      <p>📞 ${address.phone}</p>
    `
    }

    profileActions.innerHTML = ""

    const myOrders = document.createElement("a")
    myOrders.classList.add("action-btn")
    myOrders.href = "order.html"
    myOrders.textContent = "My Orders"

    const logoutBtn = document.createElement("button")
    logoutBtn.classList.add("action-btn", "logout")
    logoutBtn.textContent = "Logout"

    logoutBtn.addEventListener("click", handleLogout)

    profileActions.append(myOrders, logoutBtn)
}

document.addEventListener("DOMContentLoaded", () => {
    renderNavbar()
    renderUserDetails()
    renderFooter()
})