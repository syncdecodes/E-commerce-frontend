import { API_BASE_URL } from "../config/config.js";
import { showToast } from "../components/toast.js";


/* ======================= STATE ======================= */
const params = new URLSearchParams(window.location.search);
const email = params.get("email");


/* ======================= DOM ELEMENT ======================= */
const resetPassBtn = document.querySelector(".reset-pass-btn")


/* ======================= RESET PASSWORD ======================= */
const resetPass = async () => {
    const otp = document.querySelector("#otp").value
    const password = document.querySelector("#password").value

    try {
        if (!password || !otp) {
            throw new Error("Enter all the feilds", "error")
        }
        const res = await fetch(`${API_BASE_URL}/auth/forgot-password/verify`, {
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

        if (!res.ok) {
            throw new Error(data.msg || "Error")
        }

        if (res.ok) {
            const ress = await fetch(`${API_BASE_URL}/auth/forgot-password/reset`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    otp,
                    newPassword: password
                })
            })
            if (ress.ok) {
                showToast('password reseted')
                localStorage.removeItem("email")

                localStorage.setItem("redirectAfterPasswordReset", "login")
                setTimeout(() => {
                    window.location.href = "login.html"
                }, 1200);

            }
        }
    }
    catch (error) {
        showToast(error.message, "error")
    }
}


resetPassBtn.addEventListener("click", resetPass)