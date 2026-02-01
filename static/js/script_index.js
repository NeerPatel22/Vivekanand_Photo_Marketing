 // --- NAV LOGIC ---
    function toggleUserMenu() {
        document.getElementById("navLinks").classList.toggle("active");
    }

    // --- SLIDER LOGIC ---
    let slideIndex = 0;
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    setInterval(() => { moveSlide(1); }, 5000);

    function moveSlide(n) {
        slides[slideIndex].classList.remove('active');
        slideIndex += n;
        if (slideIndex >= totalSlides) slideIndex = 0;
        if (slideIndex < 0) slideIndex = totalSlides - 1;
        slides[slideIndex].classList.add('active');
    }

    // --- STORE LOGIC ---
    let products = [];
    let categories = [];
    let cartItems = 0;
    let currentCategory = 'all';

    const grid = document.getElementById("productsGrid");
    const filterContainer = document.getElementById("filterContainer");
    const searchInput = document.getElementById("searchInput");

    window.onload = async () => {
        const [catResponse, prodResponse] = await Promise.all([
            fetch('category_render'),
            fetch('product_render')
        ]);

        categories = await catResponse.json();
        products = await prodResponse.json();
        renderFilters();
        renderProducts(products);
    };

    function renderFilters() {
        if (categories.length > 0) {
            categories.forEach(cat => {
                const btn = document.createElement("button");
                btn.className = "filter-btn";
                btn.innerText = cat.name;
                btn.onclick = function() { filterCategory(cat.name, this); };
                filterContainer.appendChild(btn);
            });
        }
    }

    function renderProducts(data) {
        grid.innerHTML = "";
        if (data.length === 0) {
            grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:50px; color:#94a3b8;">No products found.</div>`;
            return;
        }

        data.forEach(p => {
            const card = document.createElement("div");
            card.className = "product-card";
            const imgUrl = p.image || 'https://via.placeholder.com/300?text=No+Image';

            card.innerHTML = `
                <div class="card-img-box" onclick='openModal(${JSON.stringify(p)})'>
                    <img src="${imgUrl}" alt="${p.name}">
                </div>
                <div class="card-details">
                    <div class="card-cat">${p.category}</div>
                    <h3 class="card-title">${p.name}</h3>
                    <div class="card-price">₹${p.price}</div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    function filterCategory(catName, btn) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = catName;
        
        if (catName === 'all') {
            renderProducts(products);
        } else {
            const filtered = products.filter(p => p.category === catName);
            renderProducts(filtered);
        }
    }

    function searchProducts() {
        const term = searchInput.value.toLowerCase();
        const filtered = products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(term) || (p.desc && p.desc.toLowerCase().includes(term));
            const matchesCat = currentCategory === 'all' || p.category === currentCategory;
            return matchesSearch && matchesCat;
        });
        renderProducts(filtered);
    }

    // function addToCart() {
    //     cartItems++;
    //     document.getElementById("cartCount").innerText = cartItems;
    //     const btn = event.target;
    //     const originalText = btn.innerHTML;
    //     btn.innerHTML = `<i class="fas fa-check"></i>`;
    //     btn.style.background = "#10b981";
    //     setTimeout(() => {
    //         btn.innerHTML = originalText;
    //         btn.style.background = "";
    //     }, 1500);
    // }

    function openModal(product) {
        document.getElementById("modalImg").src = product.image || 'https://via.placeholder.com/300';
        document.getElementById("modalCat").innerText = product.category;
        document.getElementById("modalTitle").innerText = product.name;
        document.getElementById("modalDesc").innerText = product.desc || "No description available.";
        document.getElementById("modalPrice").innerText = "₹" + product.price;
        document.getElementById("productModal").style.display = "flex";
    }

    function closeModal() {
        document.getElementById("productModal").style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target === document.getElementById("productModal")) {
            closeModal();
        }
    }