const mongoose = require('mongoose');
const TodoSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    }, title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
})

module.exports = mongoose.model('TodoList', TodoSchema);