import { API_BASE_URL } from "../config/config.js";
import { showToast } from "../components/toast.js";
import { renderNavbar, updateCartCount } from "../components/navbar.js";
import { renderFooter } from "../components/footer.js";
import { createProductCard } from "../components/productCard.js";


/* ===================== STATE ===================== */
const params = new URLSearchParams(window.location.search);
const productId = params.get("productId");

const productGallery = document.querySelector(".product-gallery")

let selectedSize = null


/* ===================== SIZE SELECTION ===================== */
const initSizeSelection = () => {
    const sizeButtons = document.querySelectorAll(".size-btn")

    sizeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            sizeButtons.forEach(b => b.classList.remove("active"))
            btn.classList.add("active")
            selectedSize = btn.dataset.size
        })
    })
}


/* ===================== API ===================== */
const addToCart = async (productId, quantity) => {

    const token = localStorage.getItem("token")

    const res = await fetch(`${API_BASE_URL}/cart/add`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            productId,
            size: selectedSize,
            quantity
        })
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.msg || "Failed to add to cart")
    }

    return data;
}


/* ===================== AUTH FLOW ===================== */
const handleAddToCartClick = async (productId) => {
    const token = localStorage.getItem("token")

    if (!selectedSize) {
        showToast("Select a size", "info")
        return
    }

    if (!token) {

        localStorage.setItem("redirectAfterLogin", "add-to-cart")
        localStorage.setItem("pendingProductId", productId)
        localStorage.setItem("pendingQty", 1)
        localStorage.setItem("pendingSize", selectedSize)

        window.location.href = "signup.html"
        return
    }

    try {
        await addToCart(productId, 1)
        updateCartCount()
        showToast("Item added to cart", "cart")
    }
    catch (error) {
        console.log(error.message, "error")
    }
}


const handleAfterLogin = async () => {
    const token = localStorage.getItem("token")
    const pendingProductId = localStorage.getItem("pendingProductId")
    const pendingQty = localStorage.getItem("pendingQty")
    const pendingSize = localStorage.getItem("pendingSize")


    if (token && pendingProductId && pendingProductId === productId) {

        selectedSize = pendingSize

        try {
            await addToCart(pendingProductId, Number(pendingQty) || 1)
            showToast("Item added to cart")
        }
        catch (error) {
            console.log(error.message, "error")
        }
        finally {
            localStorage.removeItem("redirectAfterLogin")
            localStorage.removeItem("pendingProductId")
            localStorage.removeItem("pendingQty")
            localStorage.removeItem("pendingSize")
        }
    }
}


/* ===================== RENDER ===================== */
const renderProductDetails = async () => {

    try {
        const res = await fetch(`${API_BASE_URL}/product/${productId}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
            }
        })
        const data = await res.json()
        const product = data.product
        console.log(data)
        console.log(product)



        /* Images */
        const productImages = document.createElement("div")
        productImages.classList.add("product-images")

        const thumbnailList = document.createElement("div")
        thumbnailList.classList.add("thumbnail-list")

        const mainImage = document.createElement("div")
        mainImage.classList.add("main-image")

        const mainImg = document.createElement("img")
        mainImg.src = product.images[0]

        mainImage.append(mainImg)


        product.images.forEach(image => {
            const img = document.createElement("img")
            img.src = image

            img.addEventListener("click", () => {
                mainImg.src = image

                document.querySelectorAll(".thumbnail-list img")
                    .forEach(t => t.classList.remove("active"))

                img.classList.add("active")
            })
            thumbnailList.append(img)
        });



        /* Info */
        const productInfo = document.createElement("div")
        productInfo.classList.add("product-info")


        productInfo.innerHTML =
            `
        <h1 class="product-name">${product.color} ${product.category.name}'s ${product.name}</h1>
        <p class="product-price">₹${product.price}</p>
        <p class="product-description">${product.description}</p>

        <div class="size-section">
            <p class="size-label">Select Size</p>
            <div class="size-options">
                <button class="size-btn" data-size="28">28</button>
                <button class="size-btn" data-size="30">30</button>
                <button class="size-btn" data-size="32">32</button>
                <button class="size-btn" data-size="34">34</button>
            </div>
        </div>
        `

        const addToCartBtn = document.createElement("button")
        addToCartBtn.classList.add("add-to-cart-btn")
        addToCartBtn.textContent = "Add To Cart"

        productInfo.append(addToCartBtn)
        productImages.append(thumbnailList, mainImage)
        productGallery.append(productImages, productInfo)

        addToCartBtn.addEventListener("click", () => {
            handleAddToCartClick(productId)
        })
        initSizeSelection()
        renderRelatedProducts(product.category.slug, product.color, productId)
    }
    catch (error) {
        console.log(error.message, "error")
    }

}


const renderRelatedProducts = async (category, color, currentProductId) => {

    try {
        const res = await fetch(`${API_BASE_URL}/product?category=${category}&color=${color}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
            }
        })
        const data = await res.json()
        console.log(data)
        const products = data.products
        console.log(products)

        if (!res.ok) {
            throw new Error(data.msg || "Error occured")
        }

        const relatedProducts = products.filter(product => {
            return product._id !== currentProductId
        })

        createProductCard(relatedProducts)

    }
    catch (error) {
        console.log(error.message)
    }
}

/* ===================== INIT ===================== */
document.addEventListener("DOMContentLoaded", () => {
    renderNavbar()
    renderProductDetails()
    handleAfterLogin()
    renderFooter()
})
