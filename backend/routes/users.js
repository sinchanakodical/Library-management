const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

const router = express.Router();

// =============================================
// GET OWN PROFILE — any authenticated user
// =============================================
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select('-passwordHash')
            .populate('borrowedBooks');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// =============================================
// GET OWN BORROWED BOOKS
// =============================================
router.get('/me/borrowed', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).populate('borrowedBooks');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ borrowedBooks: user.borrowedBooks });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// =============================================
// LIST ALL USERS — admin only
// =============================================
router.get('/', protect, requireRole('admin'), async (req, res) => {
    try {
        const users = await User.find({ role: 'user' })
            .select('-passwordHash')
            .sort({ createdAt: -1 });
        res.json({ users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// =============================================
// CREATE A USER — admin only (active: false)
// =============================================
router.post('/', protect, requireRole('admin'), async (req, res) => {
    try {
        const { firstName, secondName, email, address, password } = req.body;

        if (!firstName || !secondName || !email || !password) {
            return res.status(400).json({ error: 'Required fields missing' });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            secondName,
            email,
            address: address || '',
            passwordHash,
            role: 'user',
            active: false,
            createdBy: req.user.userId
        });

        res.status(201).json({
            message: 'User created (inactive — activate to allow login)',
            user: {
                id: user._id,
                firstName: user.firstName,
                secondName: user.secondName,
                email: user.email,
                active: user.active
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// =============================================
// TOGGLE ACTIVE FLAG — admin only
// =============================================
router.patch('/:id/active', protect, requireRole('admin'), async (req, res) => {
    try {
        const { active } = req.body;

        if (typeof active !== 'boolean') {
            return res.status(400).json({ error: 'active must be true or false' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { active },
            { new: true }
        ).select('-passwordHash');

        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({
            message: `User ${active ? 'activated' : 'stopped'}`,
            user
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// =============================================
// SEE A USER'S BORROWED BOOKS — admin only
// =============================================
router.get('/:id/borrowed', protect, requireRole('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-passwordHash')
            .populate('borrowedBooks');

        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({
            user: {
                id: user._id,
                firstName: user.firstName,
                secondName: user.secondName,
                email: user.email,
                active: user.active
            },
            borrowedBooks: user.borrowedBooks
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// =============================================
// DELETE A USER — admin only
// =============================================
router.delete('/:id', protect, requireRole('admin'), async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;