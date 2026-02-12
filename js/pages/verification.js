import { API_BASE_URL } from "../config/config.js"
import { showToast } from "../components/toast.js"


/* ======================= DOM ELEMENT ======================= */
const verifyBtn = document.querySelector(".verify-btn")

/* ======================= VERIFY ======================= */
const verify = async (e) => {
    e.preventDefault()

    const email = localStorage.getItem("email")
    console.log(email)
    const otp = document.querySelector("#otp").value

    try {
        const res = await fetch(`${API_BASE_URL}/auth/verifyotp`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                email,
                otp
            })
        })


        const data = await res.json()
        console.log(data)

        if (!res.ok) {
            throw new Error(data.msg || "otp verfication error")
        }

        if (data.token) {
            localStorage.setItem("token", data.token)
            localStorage.removeItem("email")

            const action = localStorage.getItem("redirectAfterLogin")

            if (action === "add-to-cart") {
                const productId = localStorage.getItem("pendingProductId")
                window.location.href = `product-gallery.html?productId=${productId}`
            }

            showToast("OTP verified")
            setTimeout(() => {
                window.location.href = "index.html"
            }, 1200);

        }

    }
    catch (error) {
        showToast(error.message)
    }
}

verifyBtn.addEventListener("click", verify)