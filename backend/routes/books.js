const express = require('express');
const Book = require('../models/Book');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

const router = express.Router();

// =============================================
// GET ALL BOOKS — any authenticated user
// =============================================
router.get('/', protect, async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.json({ books });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// =============================================
// ADD A BOOK — admin only
// =============================================
router.post('/', protect, requireRole('admin'), async (req, res) => {
    try {
        const { title, author, establishedDate, edition, tag } = req.body;

        if (!title || !author || !establishedDate || !edition || !tag) {
            return res.status(400).json({ error: 'All fields required' });
        }

        const book = await Book.create({
            title,
            author,
            establishedDate,
            edition,
            tag,
            available: true
        });

        res.status(201).json({ message: 'Book added', book });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// =============================================
// DELETE A BOOK — admin only
// =============================================
router.delete('/:id', protect, requireRole('admin'), async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json({ message: 'Book deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// =============================================
// BORROW A BOOK — active user only
// =============================================
router.post('/:id/borrow', protect, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        if (!book.available) {
            return res.status(409).json({ error: 'Book already borrowed' });
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        book.available = false;
        book.borrowedBy = user._id;
        await book.save();

        if (!user.borrowedBooks.includes(book._id)) {
            user.borrowedBooks.push(book._id);
            await user.save();
        }

        res.json({ message: 'Book borrowed successfully', book });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// =============================================
// RETURN A BOOK — active user only
// =============================================
router.post('/:id/return', protect, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        if (book.borrowedBy?.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'You did not borrow this book' });
        }

        const user = await User.findById(req.user.userId);

        book.available = true;
        book.borrowedBy = null;
        await book.save();

        if (user) {
            user.borrowedBooks = user.borrowedBooks.filter(
                (id) => id.toString() !== book._id.toString()
            );
            await user.save();
        }

        res.json({ message: 'Book returned successfully', book });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;