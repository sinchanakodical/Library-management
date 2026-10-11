const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { 
        type: String, 
        required: true, 
        trim: true 
    },
    secondName: { 
        type: String, 
        required: true, 
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true 
    },
    passwordHash: { 
        type: String, 
        required: true 
    },
    address: { 
        type: String, 
        default: '' 
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    active: { 
        type: Boolean, 
        default: true 
    },
    borrowedBooks: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Book' 
    }],
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('User', userSchema);