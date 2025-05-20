const mongoose = require('mongoose');
const Client = require('../models/Client');
require('dotenv').config();

const migrateOldUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        // Update all existing users without verification fields
        const result = await Client.updateMany(
            { isEmailVerified: { $exists: false } },
            { 
                $set: { 
                    isEmailVerified: true,
                    emailVerificationCode: null,
                    emailVerificationExpires: null
                }
            }
        );

        console.log(`Updated ${result.modifiedCount} old users`);
        process.exit(0);
    } catch (error) {
        console.error('Migration error:', error);
        process.exit(1);
    }
};

migrateOldUsers();