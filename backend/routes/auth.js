const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Rate limiter for signin (brute-force protection)
const signinLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Too many attempts, try again later' }
});

// =============================================
// SIGN UP — regular users only
// =============================================
router.post('/signup', async (req, res) => {
    try {
        const { firstName, secondName, email, password } = req.body;

        // Validate all fields
        if (!firstName || !secondName || !email || !password) {
            return res.status(400).json({ error: 'All fields required' });
        }

        // Email validation
        if (!email.includes('@') || (!email.endsWith('.com') && !email.endsWith('.in'))) {
            return res.status(400).json({ 
                error: 'Invalid email format' 
            });
        }

        // Password validation
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                error: 'Password must be 8+ chars with uppercase, lowercase, number, and special character'
            });
        }

        // Check duplicate email
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user (active by default)
        const user = await User.create({
            firstName,
            secondName,
            email,
            passwordHash,
            role: 'user',
            active: true
        });

        res.status(201).json({
            message: 'User created successfully',
            userId: user._id
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// =============================================
// SIGN IN — admin + active users
// =============================================
router.post('/signin', signinLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // ✅ CHECK ACTIVE FLAG BEFORE PASSWORD
        if (!user.active) {
            return res.status(403).json({
                error: 'Your access has been stopped. Contact the librarian.'
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create access token
        const accessToken = jwt.sign(
            {
                userId: user._id,
                role: user.role,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Set httpOnly cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,        // true in production
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000
        });

        res.json({
            accessToken,
            user: {
                id: user._id,
                firstName: user.firstName,
                secondName: user.secondName,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// =============================================
// LOGOUT
// =============================================
router.post('/logout', (req, res) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'strict'
    });
    res.json({ message: 'Logged out successfully' });
});

// =============================================
// CHANGE PASSWORD
// =============================================
router.post('/change-password', protect, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: 'All fields required' });
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify old password
        const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Old password is wrong' });
        }

        // Validate new password strength
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                error: 'New password must be 8+ chars with uppercase, lowercase, number, and special character'
            });
        }

        // Update password
        user.passwordHash = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;