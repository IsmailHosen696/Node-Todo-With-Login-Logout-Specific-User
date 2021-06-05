const express = require('express');
const routes = express.Router();
const { requireAuth } = require('../../config/auth');
const Todo = require('../model/Todo');


routes.get('/addtodos', requireAuth, (req, res) => {
    res.render('addTodo');
})
routes.post('/addtodos', requireAuth, (req, res) => {
    const { userId, title, desc } = req.body;
    const newTodo = Todo({
        userId,
        title,
        desc
    })
    newTodo.save().then(note => {
        res.redirect(`/todo/notes/${userId}`);
    })
})
routes.get('/notes/:id', requireAuth, async (req, res) => {
    const userId = req.params.id
    const note = await Todo.find({ userId }).sort({ createdAt: 'desc' });
    res.render('notes', { note });
})
routes.get('/edit/:id', requireAuth, async (req, res) => {
    const noteId = req.params.id
    const note = await Todo.findById(noteId);
    res.render('edit', { note })

})
routes.delete('/delete/:id', async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.redirect('/')
})
routes.patch('/edit/:id', async (req, res, next) => {
    const noteId = req.params.id
    const note = req.note = await Todo.findById(noteId);
    note.title = req.body.title
    note.desc = req.body.desc
    note.userId = req.body.userId
    try {
        note = note.save()
        res.redirect(`/todo/notes/${note.userId}`)
        console.log(note.userId);
    } catch (error) {
        res.render(`edit`, { note });
    }
});

// function saveTodoAndRed(path) {
//     return (req, res) => {
//         const note = req.note;
//         note.title = req.body.title;
//         note.desc = req.body.desc;
//         note.userId = req.body.userId;
//         try {
//             note = note.save()
//             res.redirect(`/todo/notes/${note.userId}`)
//         } catch (error) {
//             res.render(`${path}`, { note });
//         }
//     }
// }

module.exports = routes;