const { signup, login,updateCash } = require('../Controllers/AuthController');
const { signupValidation, loginValidation,updateValidation } = require('../Middlewares/AuthValidation');

const router = require('express').Router();
const UserModel = require('../Models/User');

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);
router.post('/updatecash', async (req, res) => {
    try {
      const { email, cash } = req.body;
  
      const user = await UserModel.findOne({ email });
      if (!user) {
        console.log(`User not found`)
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      user.cash = cash;
      await user.save();
  
      res.status(200).json({ success: true, message: 'Cash updated successfully' });
    } catch (err) {
      console.error('Error updating cash:', err.message);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });

module.exports = router;