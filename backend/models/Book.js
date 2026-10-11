const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true, 
        trim: true 
    },
    author: { 
        type: String, 
        required: true, 
        trim: true 
    },
    establishedDate: { 
        type: Date, 
        required: true 
    },
    edition: { 
        type: String, 
        required: true 
    },
    tag: { 
        type: String, 
        required: true 
    },
    available: { 
        type: Boolean, 
        default: true 
    },
    borrowedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        default: null
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Book', bookSchema);