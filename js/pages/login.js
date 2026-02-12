import { API_BASE_URL } from "../config/config.js";
import { showToast } from "../components/toast.js";

if (localStorage.getItem("redirectAfterPasswordReset")) {
    showToast("Login to your DVL account", "info")
    localStorage.removeItem("redirectAfterPasswordReset")
}

/* ======================= DOM ELEMENT ======================= */
const loginBtn = document.querySelector(".login-btn")


/* ======================= LOGIN ======================= */
const login = async () => {
    const email = document.querySelector("#email").value
    const password = document.querySelector("#password").value

    try {

        if (!email || !password) {
            throw new Error("Enter all the feilds")
        }
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        })

        const data = await res.json()
        const token = data.token
        console.log(data)
        console.log(token)

        if (!res.ok) {
            throw new Error(data.msg || "Something went wrong")
        }

        if (res.ok) {
            localStorage.setItem("token", token)

            const pendingProductId = localStorage.getItem("pendingProductId")
            if (pendingProductId) {
                window.location.href = `product-gallery.html?productId=${pendingProductId}`
                return
            }
            showToast("Logged in successfully", "success")
            setTimeout(() => {
                window.location.href = "index.html"
            }, 1200);

        }
    } catch (error) {
        showToast(error, "error")
    }

}


loginBtn.addEventListener("click", login)

