const express = require("express");
const mongoose = require("mongoose");

const app = express();

// Middleware to read JSON data
app.use(express.json());

// MongoDB Connection
mongoose
    .connect("mongodb://127.0.0.1:27017/itemdb")
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });

// Item Schema
const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number
    },
    inStock: {
        type: Boolean
    }
});

// Item Model
const Item = mongoose.model("Item", itemSchema);

// Home Route
app.get("/", (req, res) => {
    res.send("MongoDB CRUD Application is Running");
});

// CREATE - Add a new item
app.post("/items", async (req, res) => {
    try {
        const item = new Item(req.body);
        const savedItem = await item.save();

        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// READ - Get all items
app.get("/items", async (req, res) => {
    try {
        const items = await Item.find();

        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ - Get one item by ID
app.get("/items/:id", async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// UPDATE - Update an item
app.put("/items/:id", async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE - Delete an item
app.delete("/items/:id", async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);

        if (!deletedItem) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.json({
            message: "Item deleted successfully",
            item: deletedItem
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Start the server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});