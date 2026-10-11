require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected');

        const existing = await User.findOne({ role: 'admin' });
        if (existing) {
            console.log('⚠️ Admin already exists:', existing.email);
            process.exit(0);
        }

        const passwordHash = await bcrypt.hash('Admin@123', 10);

        await User.create({
            firstName: 'Main',
            secondName: 'Librarian',
            email: 'admin@library.com',
            passwordHash,
            role: 'admin',
            active: true
        });

        console.log('✅ Admin created:');
        console.log('   Email: admin@library.com');
        console.log('   Password: Admin@123');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed error:', err);
        process.exit(1);
    }
}

seed();