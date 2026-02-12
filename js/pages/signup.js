import { API_BASE_URL } from "../config/config.js"
import { showToast } from "../components/toast.js"


/* ======================= DOM ELEMENT ======================= */
const signupBtn = document.querySelector(".signup-btn")


/* ======================= SIGN UP ======================= */
const signup = async () => {

    const email = document.querySelector("#email").value
    const password = document.querySelector("#password").value

    localStorage.setItem("email", email)

    try {

        if (!email || !password) {
            throw new Error("Enter all the feilds")
        }

        const res = await fetch(`${API_BASE_URL}/auth/sendotp`, {
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

        if (!res.ok) {
            throw new Error(data.msg || "OTP not sent")
        }

        if (res.ok) {
            showToast("OTP sent successfully")
            setTimeout(() => {
                window.location.href = "verification.html"
            }, 1200);
        }
    }
    catch (error) {
        showToast(error.message, "error")
    }
}

signupBtn.addEventListener("click", signup)