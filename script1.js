document.addEventListener('DOMContentLoaded', () => {
    // --- Global Variables ---
    let cartItems = [];
    const productsContainer = document.querySelector('.product-grid');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalSpan = document.getElementById('cart-total');
    const cartCountSpan = document.getElementById('cart-count');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.querySelector('.close-cart-btn');
    const viewCartLink = document.querySelector('a[href="#cart-sidebar"]'); // The 'Cart (X)' link

    // --- Utility Functions ---

    /**
     * Renders/updates the cart display based on the cartItems array.
     */
    function renderCart() {
        cartItemsContainer.innerHTML = ''; // Clear existing items
        let total = 0;

        if (cartItems.length === 0) {
            emptyCartMessage.style.display = 'block';
            checkoutBtn.disabled = true;
        } else {
            emptyCartMessage.style.display = 'none';
            checkoutBtn.disabled = false;
            cartItems.forEach(item => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.setAttribute('data-product-id', item.id); // Add ID for removal

                total += item.price * item.quantity;

                cartItemDiv.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p>Quantity: ${item.quantity} x $${item.price.toFixed(2)}</p>
                    </div>
                    <button class="remove-item-btn" data-product-id="${item.id}">&times;</button>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
            });
        }

        cartTotalSpan.textContent = total.toFixed(2);
        cartCountSpan.textContent = cartItems.length; // Update the cart count in header
    }

    /**
     * Adds a product to the cart or increments its quantity if already present.
     * @param {object} product - The product object to add.
     */
    function addToCart(product) {
        const existingItem = cartItems.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cartItems.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        renderCart();
        cartSidebar.classList.add('open'); // Open cart sidebar on add
    }

    /**
     * Removes an item from the cart or decrements its quantity.
     * @param {string} productId - The ID of the product to remove.
     */
    function removeFromCart(productId) {
        const itemIndex = cartItems.findIndex(item => item.id === productId);

        if (itemIndex > -1) {
            if (cartItems[itemIndex].quantity > 1) {
                cartItems[itemIndex].quantity--;
            } else {
                cartItems.splice(itemIndex, 1); // Remove item if quantity is 1
            }
        }
        renderCart();
    }

    // --- Event Listeners ---

    // Add to Cart buttons
    productsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart-btn')) {
            const button = event.target;
            const productId = button.closest('.product-card').dataset.productId;
            const productName = button.dataset.productName;
            const productPrice = parseFloat(button.dataset.productPrice);
            const productImage = button.dataset.productImage;

            const product = {
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage
            };
            addToCart(product);
        }
    });

    // Remove from Cart buttons (delegated event)
    cartItemsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-item-btn')) {
            const productId = event.target.dataset.productId;
            removeFromCart(productId);
        }
    });

    // Toggle Cart Sidebar
    viewCartLink.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default anchor jump
        cartSidebar.classList.toggle('open');
    });

    closeCartBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });

    // Hamburger Menu Toggle
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    hamburgerMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close mobile nav when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });

    // Scroll-to-top button logic
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { // Show button after scrolling 300px
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Initial render of the cart (in case of pre-loaded items, not applicable for this dummy)
    renderCart();

    // Checkout Button (Non-functional)
    checkoutBtn.addEventListener('click', () => {
        alert('Checkout is not implemented in this prototype.');
    });
});
