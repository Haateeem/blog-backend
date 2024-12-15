const express = require('express');
const { ObjectId } = require('mongodb');

const router = express.Router();

module.exports = (db) => {
    const router = express.Router();

    router.get('/', async (req, res) => {
        try {
            const blogs = await db.collection('blogs').find().toArray();
            res.json(blogs);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    router.get('/:id', async (req, res) => {
        try {
            const blog = await req.db.collection('blogs').findOne({ _id: new ObjectId(req.params.id) });
            if (!blog) return res.status(404).json({ message: 'Blog not found' });
            res.json(blog);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    router.post('/', async (req, res) => {
        const { title, content, author } = req.body;

        if (!title || !content || !author) {
            return res.status(400).json({ error: "Title, content, and author are required fields." });
        }

        try {
            const newBlog = {
                title,
                content,
                author,
                date: new Date()
            };

            const result = await req.db.collection('blogs').insertOne(newBlog);

            res.status(201).json(result);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    router.put('/:id', async (req, res) => {
        const { title, content, author } = req.body;
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid blog ID format." });
        }

        try {
            const updatedBlog = await req.db.collection('blogs').findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: { title, content, author } },
                { returnDocument: 'after' }
            );

            if (!updatedBlog) {
                return res.status(404).json({ message: 'Blog not found' });
            }

            res.json(updatedBlog);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });

    router.delete('/:id', async (req, res) => {
        try {
            const result = await req.db.collection('blogs').deleteOne({ _id: new ObjectId(req.params.id) });
            if (result.deletedCount === 0) return res.status(404).json({ message: 'Blog not found' });
            res.json({ message: 'Blog deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    return router;
};




