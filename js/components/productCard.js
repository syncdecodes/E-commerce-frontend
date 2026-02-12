export const createProductCard = (products) => {
    const productCardsContainer = document.querySelector("#product-cards-container")
    products.forEach((product) => {
        const productCard = document.createElement("a")
        productCard.href = `product-gallery.html?productId=${product._id}`
        productCard.classList.add("product-card")

        productCard.innerHTML =
            `
            <img class="product-card-image" src="${product.images[0]}" />
            <div class="product-card-info">
                <h3 class="product-card-name" >${product.color} ${product.category.name}'s ${product.name}</h3>
                <p class="product-card-price">₹${product.price}</p>
            </div>
            `
        productCardsContainer.append(productCard)
    })
}