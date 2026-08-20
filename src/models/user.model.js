const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is necessary to create an user account'],
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid Email address'],
        unique: [true, 'Email already exists']
    },
    name: {
        type: String,
        required: [true, 'Name is required for creating an user account']
    },
    password: {
        type: String,
        required: [true, 'Password is required for creating an user account'],
        minlength: [6, 'Password should contain more than 6 characters'],
        select: false
    }
}, {
    timestamps: true
});

userSchema.pre("save",async function(next){
     if(!this.isModified('password')) {
        return next()
    }

    const hash = await bcrypt.hash(this.password,10);
    this.password = hash
    return 
})

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password,this.password)
}

module.exports = mongoose.model('User', userSchema);