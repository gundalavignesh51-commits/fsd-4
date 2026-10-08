const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Serve frontend files
app.use(express.static("public"));

// MongoDB Connection
mongoose
    .connect("mongodb://127.0.0.1:27017/itemdb")
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err);
    });

// Item Schema
const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stockStatus: {
        type: String,
        required: true
    }
});

// Item Model
const Item = mongoose.model("Item", itemSchema);


// ===============================
// GET - Display all items
// ===============================
app.get("/api/items", async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ===============================
// POST - Add new item
// ===============================
app.post("/api/items", async (req, res) => {
    try {
        const item = new Item(req.body);
        const savedItem = await item.save();

        res.status(201).json(savedItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// ===============================
// PUT - Update item
// ===============================
app.put("/api/items/:id", async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedItem) {
            return res.status(404).json({
                error: "Item not found"
            });
        }

        res.json(updatedItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// ===============================
// DELETE - Delete item
// ===============================
app.delete("/api/items/:id", async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);

        if (!deletedItem) {
            return res.status(404).json({
                error: "Item not found"
            });
        }

        res.json({
            message: "Item deleted successfully"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});