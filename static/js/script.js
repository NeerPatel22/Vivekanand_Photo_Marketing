let editIndex = null;
let products = JSON.parse(localStorage.getItem("products")) || [];

const overlay = document.getElementById("overlay");
const productList = document.getElementById("productList");
const formTitle = document.getElementById("formTitle"); // Title of the modal
    
    // Inputs
const nameInput = document.getElementById("name");
const categoryInput = document.getElementById("category");
const subcategoryInput = document.getElementById("subcategory");
const descInput = document.getElementById("desc");
const priceInput = document.getElementById("price");
const imageInput = document.getElementById("image");
const pId = document.getElementById("id");
    loadProducts();

    async function loadProducts() {
        try {
            const response = await fetch('product_render');
            const data = await response.json();

            products = data
            renderProducts(data);
        } catch (error) {
            console.error("Fetch failed:", error);
        }
    }

    function renderProducts(data) {
        const productList = document.getElementById("productList");
        productList.innerHTML = "";

        data.forEach((p, index) => {
            productList.innerHTML += `
                <div class="card">
                    <img src="${p.image}" alt="Product Image">
                    <h3>${p.name || "Unnamed Product"}</h3>
                    <p><b>${p.category}</b> / ${p.subcategory}</p>
                    <p style="flex-grow:1; color:#666;">${p.desc}</p>
                    <p style="font-size:18px; color:#2563EB;"><b>₹${p.price}</b></p>
                    <input type="hidden" class="form-control" name="cid" value="${p.id}">
                    <div class="card-actions">
                        <button class="edit-btn" onclick="editProduct(${index})">Edit</button>
                        <button class="delete-btn" onclick="deleteProduct(${index})">Delete</button>
                    </div>
                </div>
            `;
        });
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
        const cat = categoryInput.value;
        subcategoryInput.innerHTML = "<option>Loading...</option>";
        if (cat) {
            try {
                // 2. Fetch data from your Django URL
                const response = await fetch(`load_subcategory?category=${cat}`);
                const data = await response.json();
                subcategoryInput.innerHTML = "";
                if (data.length > 0) {
                    subcategoryInput.innerHTML = "<option>Select SubCategory</option>";
                    data.forEach(sub => {
                        subcategoryInput.innerHTML += `<option value="${sub.SubCategoryName}">${sub.SubCategoryName}</option>`;
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

//    function saveProduct() {
//        const file = imageInput.files[0];

//        if (editIndex !== null && !file) {
//            // Updating without changing image
//            products[editIndex] = {
//                ...products[editIndex],
//                name: nameInput.value,
//                category: categoryInput.value,
//                subcategory: subcategoryInput.value,
//                desc: descInput.value,
//                price: priceInput.value
//            };
//            finalizeSave();
//            return;
//        }

//        const reader = new FileReader();

//        reader.onload = () => {
//            const product = {
//                name: nameInput.value,
//                category: categoryInput.value,
//                subcategory: subcategoryInput.value,
//                desc: descInput.value,
//                price: priceInput.value,
//                image: reader.result
//            };

//            if (editIndex !== null) {
//                products[editIndex] = product;
//            } else {
//                products.push(product);
//            }
//            finalizeSave();
//        };

//        if (file) {
//            reader.readAsDataURL(file);
//        } else {
//             if(editIndex === null) alert("Please select an image");
//        }
//    }

//    function finalizeSave() {
//        localStorage.setItem("products", JSON.stringify(products));
//        renderProducts();
//        closeForm();
//    }

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
        categoryInput.value = p.category;
        
        await updateSub();
        subcategoryInput.value = p.subcategory;

        descInput.value = p.desc;
        priceInput.value = p.price;

        openForm();
    }

    function deleteProduct(index) {
        const product = products[index];
        const id = product.id;

        if (confirm("Are you sure you want to delete this product?")) {

            window.location.href = `del_product?${id}`
            localStorage.setItem("products", JSON.stringify(products));
            renderProducts();
        }
    }