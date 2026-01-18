let editIndex = null;
let currentProductCategory = 'all';
let products = [];
let categories = [];

const overlay = document.getElementById("overlay");
const productList = document.getElementById("productList");
const formTitle = document.getElementById("formTitle"); // Title of the modal
    
//     // Inputs
const nameInput = document.getElementById("name");
const categoryInput = document.getElementById("category");
const subcategoryInput = document.getElementById("subcategory");
const descInput = document.getElementById("desc");
const priceInput = document.getElementById("price");
const imageInput = document.getElementById("image");
const pId = document.getElementById("id");
        initAppData();

    async function initAppData() {
        try {
            const [catResponse, prodResponse] = await Promise.all([
                fetch('category_render'),
                fetch('product_render')
            ]);

            categories = await catResponse.json();
            products = await prodResponse.json();
                
            if (document.getElementById("productList")) {
                    initProductPage();
            }

                // Check if we are on the Category Page
            if (document.getElementById("categoryList")) {
                    initCategoryPage();
            }
            // initProductPage();
            // initCategoryPage();
            
        } catch (error) {
            console.error("Critical error during initialization:", error);
        }
    }

    function initProductPage() {
        renderFilters();
        renderProducts();
    }

    // --- Render Functions ---
    async function renderFilters() {
        const filterContainer = document.getElementById("filterContainer");
        if (!filterContainer) return;

        filterContainer.innerHTML = `
            <button class="filter-btn ${currentProductCategory === 'all' ? 'active' : ''}" onclick="setCategory('all', this)">
                All
            </button>
        `;

        if (categories.length > 0) {
            categories.forEach(cat => {
                const isActive = currentProductCategory === cat.name ? 'active' : '';
                filterContainer.innerHTML += `
                    <button class="filter-btn ${isActive}" onclick="setCategory('${cat.name}', this)">
                        ${cat.name}
                    </button>
                `;
            });
        }
    }
    
    // --- Interaction Functions ---
    function setCategory(catName, btn) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentProductCategory = catName;
        renderProducts();
    }

    function renderProducts() {
        const productList = document.getElementById("productList");
        if (!productList) return;

        productList.innerHTML = "";
        let hasItems = false;

        products.forEach((p, index) => {
            if (currentProductCategory !== 'all' && p.category !== currentProductCategory) {
                return;
            }
            hasItems = true;
            productList.innerHTML += `
                <div class="card">
                    <img src="${p.image}" alt="Product Image">
                    <h3>${p.name}</h3>
                    <p><b>${p.category}</b> / ${p.subcategory || 'General'}</p>
                    <p style="flex-grow:1; color:#666;">${p.desc}</p>
                    <p style="font-size:18px; color:#2563EB;"><b>₹${p.price}</b></p>
                    <div class="card-actions">
                        <button class="edit-btn" onclick="editProduct(${index})">Edit</button>
                        <button class="delete-btn" onclick="deleteProduct(${index})">Delete</button>
                    </div>
                </div>
            `;
        });

        if (!hasItems) {
            productList.innerHTML = `<p style="text-align:center; grid-column:1/-1; color:#777;">No products found.</p>`;
        }
    }


    function openAddForm() {
        resetForm(); 
        formTitle.innerText = "Add New Product";
        overlay.style.display = "flex";
    }

    function openForm() {
        overlay.style.display = "flex";
    }

    function closeForm() {
        overlay.style.display = "none";
        resetForm();
    }

    function resetForm() {
        nameInput.value = "";
        categoryInput.value = "";
        subcategoryInput.innerHTML = "<option value=''>Select Category First</option>";
        descInput.value = "";
        priceInput.value = "";
        imageInput.value = ""; 
        editIndex = null;
    }

    async function updateSub() {
        const catid = categoryInput.value;
        subcategoryInput.innerHTML = "<option>Loading...</option>";
        if (catid) {
            try {
                subcategoryInput.innerHTML = "";
                const selectedcategory = categories.find(cat => cat.id == catid);
                if (selectedcategory && selectedcategory.subs.length > 0) {
                    subcategoryInput.innerHTML = "<option>Select SubCategory</option>";
                    selectedcategory.subs.forEach(sub => {
                        subcategoryInput.innerHTML += `<option value="${sub.id}">${sub.name}</option>`;
                    });
                } else {
                    subcategoryInput.innerHTML = "<option value=''>No subcategories found</option>";
                }
            } catch (error) {
                console.error("Error fetching subcategories:", error);
                subcategoryInput.innerHTML = "<option value=''>Error loading data</option>";
            }
        }
          else {
             subcategoryInput.innerHTML = "<option value=''>Select Category First</option>";
        }
    }

    function saveProduct() {
        const form = document.getElementById('productForm');
        if (editIndex !== null) {
            form.action = 'update_product';
        } else {
            form.action = 'add_product';
        }
        form.submit();
    }

    async function editProduct(index) {
        editIndex = index;
        const p = products[index];

        formTitle.innerText = "Edit Product"; // Change Title

        pId.value = p.id;
        nameInput.value = p.name;
        categoryInput.value = p.category_id;
        
        await updateSub();
        subcategoryInput.value = p.subcategory_id;

        descInput.value = p.desc;
        priceInput.value = p.price;

        openForm();
    }

    function deleteProduct(index) {
        const product = products[index];
        const id = product.id;

        if (confirm("Are you sure you want to delete this product?")) {

            window.location.href = `delete_product?id=${id}`;
        }
    }

    function scrollFilter(direction) {
        const container = document.getElementById('filterContainer');
        const scrollAmount = 200;
        if (direction === 'left') {
            container.scrollLeft -= scrollAmount;
        } else {
            container.scrollLeft += scrollAmount;
        }
    }
    function toggleMenu() {
    const navLinks = document.getElementById("navLinks");
    if (navLinks) {
        navLinks.classList.toggle("active");
    }
}

/* =========================================
   4. CATEGORY PAGE LOGIC
   ========================================= */

// Variables specific to Category Page
let isAddingSub = false;

function initCategoryPage() {
    renderCategories();
}

async function renderCategories() {    
    const categoryList = document.getElementById("categoryList");
    if (!categoryList) return;
    categoryList.innerHTML = "";

    if (categories.length === 0) {
        categoryList.innerHTML = `<p style="text-align:center; grid-column:1/-1; color:#777; margin-top:20px;">No categories found. Please add one.</p>`;
        return;
    }

    categories.forEach((cat, index) => {
        let subsHtml = cat.subs.map((sub, subIndex) =>
            `<span class="sub-chip">
                ${sub.name}
                <span class="sub-delete" onclick="deleteSub(event, ${sub.id})" title="Remove">×</span>
            </span>`
        ).join("");

        if(cat.subs.length === 0) subsHtml = `<span style="font-size:12px; color:#999; font-style:italic;">No sub-categories added yet.</span>`;

        const openClass = cat.isOpen ? "open" : "";

        categoryList.innerHTML += `
            <div class="cat-card ${openClass}">
                <div class="cat-header" onclick="toggleCategory(${index})">
                    <h3 class="cat-title">${cat.name}</h3>
                    <i class="fas fa-chevron-down toggle-arrow"></i>
                </div>

                <div class="sub-list">${subsHtml}</div>

                <div class="card-actions">
                    <button class="delete-cat-btn" onclick="deleteCategory(event, ${cat.id})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    });
}

function toggleCategory(index) {
    const cards = document.querySelectorAll('.cat-card');
    const selectedCard = cards[index];
    if (selectedCard) {
        selectedCard.classList.toggle('open');
    }
}

// --- Category Modal Handling ---
function openCategoryModal() {
    isAddingSub = false;
    document.getElementById("modalTitle").innerText = "Add Main Category";
    document.getElementById("categoryForm").style.display = "block";
    document.getElementById("subCategoryForm").style.display = "none";
    document.getElementById("overlay").style.display = "flex";
}

function openSubCategoryModal() {

     if (categories.length === 0) {
        alert("Please add at least one Main Category first!");
        return;
    }

    isAddingSub = true;
    document.getElementById("modalTitle").innerText = "Add Sub-Category";
    document.getElementById("categoryForm").style.display = "none";
    document.getElementById("subCategoryForm").style.display = "block";
    
    // Fill the dropdown with current categories
    const select = document.getElementById("parentCategorySelect");
    select.innerHTML = "";
    categories.forEach(cat => {
        select.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
    });

    document.getElementById("overlay").style.display = "flex";

    
}

function deleteCategory(event, catid) {
    event.stopPropagation();
    if(confirm("Delete this category and all its sub-categories?")) {
        window.location.href = `/delete_category?id=${catid}`;
    }
}

function deleteSub(event, subid) {
    event.stopPropagation();
    if(confirm("Remove this sub-category?")) {
        window.location.href = `/delete_subcategory?id=${subid}`;
    }
}

function closeModal() {
    document.getElementById("overlay").style.display = "none";
}