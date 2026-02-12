import { API_BASE_URL } from "../config/config.js";
import { renderNavbar } from "../components/navbar.js";
import { renderFooter } from "../components/footer.js";
import { createProductCard } from "../components/productCard.js";

const productCardsContainer = document.querySelector("#product-cards-container")

const categoryFilter = document.querySelector("#category-filter")
const colorFilter = document.querySelector("#color-filter")
const priceFilter = document.querySelector("#price-filter")

const clearFilters = document.querySelector(".clear-filters")


const updateURLFromFilters = () => {
    const params = buildQueryParms()
    if (params) {
        window.history.replaceState({}, "", `?${params}`)
    }
    else {
        window.history.replaceState({}, "", window.location.pathname)
    }
}


const params = new URLSearchParams(window.location.search)
const category = params.get("category")

let currentPage = 1
const limit = 4
let isLoading = false
let hasMore = true

const resetAndRender = () => {
    productCardsContainer.innerHTML = ""
    currentPage = 1
    hasMore = true
    isLoading = false
    updateURLFromFilters()
    renderProducts()
}


clearFilters.addEventListener("click", () => {
    categoryFilter.value = ""
    colorFilter.value = ""
    priceFilter.value = ""
    resetAndRender()
})


/* ===================== BUILD QUERY PARAMS ===================== */
const buildQueryParms = () => {
    const params = new URLSearchParams() // URLSearchParams is a built-in JavaScript class for working with URL query parameters safely and cleanly.

    if (categoryFilter.value) {
        params.append("category", categoryFilter.value)
    }
    if (colorFilter.value) {
        params.append("color", colorFilter.value)
    }
    if (priceFilter.value === "low") {
        params.append("sort", "price")
    }
    if (priceFilter.value === "high") {
        params.append("sort", "-price")
    }
    if (priceFilter.value === "latest") {
        params.append("sort", "latest")
    }

    return params.toString()
}

[categoryFilter, colorFilter, priceFilter].forEach(filter => {
    filter.addEventListener("change", () => {
        resetAndRender()
    })
})


const applyURLParamsToFilters = () => {
    if (category) {
        categoryFilter.value = category
    }
}

/* ===================== RENDER ===================== */
const renderProducts = async () => {

    if (isLoading || !hasMore) return;
    isLoading = true;

    try {
        const query = buildQueryParms()
        const res = await fetch(`${API_BASE_URL}/product?page=${currentPage}&limit=${limit}&${query}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            }
        })

        const data = await res.json()
        const products = data.products
        console.log(data)
        console.log(products)

        if (!res.ok) {
            throw new Error(data.msg || "Error")
        }

        if (products.length < limit) {
            hasMore = false // no more products
        }

        createProductCard(products)

        currentPage++;
    }
    catch (error) {
        console.log(error.message, "error")
    }
    finally {
        isLoading = false;
    }
}


/* ===================== INIT ===================== */
document.addEventListener("DOMContentLoaded", () => {
    applyURLParamsToFilters()
    renderNavbar()
    renderProducts()
    renderFooter()
})

window.addEventListener("scroll", () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement
    if (scrollTop + clientHeight >= scrollHeight - 1000) {
        renderProducts()
    }
})
