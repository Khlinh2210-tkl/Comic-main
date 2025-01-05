const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../Models/User');

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409)
                .json({ message: 'User is already exist, you can t login', success: false });
        }
        const userModel = new UserModel({ name, email, password });
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();
        res.status(201)
            .json({
                message: "Signup successfully",
                success: true
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror",
                success: false
            })
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        const errorMsg = 'Auth failed email or password is wrong';
        if (!user) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            "secret-123",
            { expiresIn: '24h' }
        )

        res.status(200)
            .json({
                message: "Login Success",
                success: true,
                jwtToken,
                email,
                name: user.name,
                cash:user.cash
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror",
                success: false
            })
    }
}


const updateCash = async (req, res) => {
    try {
        const { email, cash } = req.body;

        // Validate inputs
        if (!email || typeof cash !== 'number') {
            return res.status(400).json({
                message: "Invalid request payload",
                success: false,
            });
        }
        
        // Ensure email is a string
        const emailString = typeof email === 'object' ? email.loggedInMail : email;

        const user = await UserModel.findOne({ email: emailString });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        user.cash = cash; // Update the cash balance
        await user.save(); // Save the updated user

        res.status(200).json({
            message: "Cash updated successfully",
            success: true,
            cash: user.cash,
        });
    } catch (err) {
        console.error('Update cash error:', err.message);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

module.exports = {
    signup,
    login,
    updateCash,
};