const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Userschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        required: true
    },
});
// hashing pass

Userschema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// login 
Userschema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const checkPass = await bcrypt.compare(password, user.password);
        if (checkPass) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
}

module.exports = mongoose.model('user', Userschema);