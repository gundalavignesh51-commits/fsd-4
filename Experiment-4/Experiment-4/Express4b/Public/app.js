const API_URL = "/api/items";

let editId = null;


// ======================================
// Load all items
// ======================================
async function loadItems() {

    try {

        const response = await fetch(API_URL);

        const items = await response.json();

        const itemList = document.getElementById("itemList");

        itemList.innerHTML = "";

        if (items.length === 0) {
            itemList.innerHTML = "<p>No items available.</p>";
            return;
        }

        items.forEach((item, index) => {

            const itemDiv = document.createElement("div");

            itemDiv.className = "item";

            itemDiv.innerHTML = `
                <h3>
                    ${index + 1}. ${item.name}
                    - $${Number(item.price).toFixed(2)}
                    (${item.stockStatus})
                </h3>

                <p>
                    <strong>Description:</strong>
                    ${item.description}
                </p>

                <button
                    class="edit-btn"
                    onclick="editItem('${item._id}')">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteItem('${item._id}')">
                    Delete
                </button>
            `;

            itemList.appendChild(itemDiv);

        });

    } catch (error) {

        console.error("Error loading items:", error);

    }
}


// ======================================
// Add or Update item
// ======================================
document
    .getElementById("itemForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const name =
            document.getElementById("name").value;

        const description =
            document.getElementById("description").value;

        const price =
            document.getElementById("price").value;

        const stockStatus =
            document.getElementById("stockStatus").value;


        const itemData = {
            name: name,
            description: description,
            price: Number(price),
            stockStatus: stockStatus
        };


        try {

            if (editId === null) {

                // ==========================
                // POST - Add new item
                // ==========================

                await fetch(API_URL, {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(itemData)

                });

            } else {

                // ==========================
                // PUT - Update item
                // ==========================

                await fetch(`${API_URL}/${editId}`, {

                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(itemData)

                });

                editId = null;

                document.getElementById("submitBtn").textContent =
                    "Add Item";

                document.getElementById("cancelBtn").style.display =
                    "none";
            }


            // Clear form
            document.getElementById("itemForm").reset();

            // Reload items without page refresh
            loadItems();

        } catch (error) {

            console.error("Error:", error);

        }

    });


// ======================================
// Edit item
// ======================================
async function editItem(id) {

    try {

        const response = await fetch(`${API_URL}/${id}`);

        const item = await response.json();

        document.getElementById("name").value =
            item.name;

        document.getElementById("description").value =
            item.description;

        document.getElementById("price").value =
            item.price;

        document.getElementById("stockStatus").value =
            item.stockStatus;

        editId = id;

        document.getElementById("submitBtn").textContent =
            "Update Item";

        document.getElementById("cancelBtn").style.display =
            "inline-block";

    } catch (error) {

        console.error("Error:", error);

    }

}


// ======================================
// Delete item
// ======================================
async function deleteItem(id) {

    if (!confirm("Are you sure you want to delete this item?")) {
        return;
    }

    try {

        await fetch(`${API_URL}/${id}`, {

            method: "DELETE"

        });

        // Refresh item list without page reload
        loadItems();

    } catch (error) {

        console.error("Error deleting item:", error);

    }

}


// ======================================
// Cancel Edit
// ======================================
function cancelEdit() {

    editId = null;

    document.getElementById("itemForm").reset();

    document.getElementById("submitBtn").textContent =
        "Add Item";

    document.getElementById("cancelBtn").style.display =
        "none";
}


// ======================================
// Load items when page opens
// ======================================
loadItems();