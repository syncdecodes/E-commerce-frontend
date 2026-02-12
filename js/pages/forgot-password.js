import { API_BASE_URL } from "../config/config.js";
import { showToast } from "../components/toast.js";


/* ======================= DOM ELEMENT ======================= */
const sendOTPBtn = document.querySelector(".forgot-pass-otp-btn")


/* ======================= SEND FORGOT PASSWORD OTP ======================= */
const sendForgotPassOTP = async () => {
    const email = document.querySelector("#email").value

    try {
        const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                email
            })
        })
        if (res.ok) {
            showToast("OTP for password reset sent successfully", "info")
            setTimeout(() => {
               window.location.href = `reset-password.html?email=${email}` 
            }, 1500);
            
        }
    }
    catch (error) {
        showToast(error.message)
    }

}

sendOTPBtn.addEventListener("click", sendForgotPassOTP)