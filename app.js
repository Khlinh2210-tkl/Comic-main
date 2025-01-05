const express = require("express");
const collection = require("./mongo");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Health Check Route
app.get("/", (req, res) => {
    res.status(200).send("API is running");
});

// Login Route
app.post("/", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json("Invalid input");
    }

    try {
        const user = await user.findOne({ email });

        if (user) {
            if (user.password === password) {
                return res.json("exist");
            } else {
                return res.json("wrong password");
            }
        } else {
            return res.json("notexist");
        }
    } catch (e) {
        console.error("Error in POST /:", e);
        return res.status(500).json("fail");
    }
});

// Signup Route
app.post("/signup", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json("Invalid input");
    }

    try {
        const user = await collection.findOne({ email });

        if (user) {
            return res.json("exist");
        } else {
            const newUser = new collection({
                email,
                password,
                token: 1000, // Default token value
            });
            await newUser.save();
            return res.json("notexist");
        }
    } catch (e) {
        console.error("Error in POST /signup:", e);
        return res.status(500).json("fail");
    }
});

// Start the Server
app.listen(8000, () => {
    console.log("Server running on http://localhost:8000");
});
