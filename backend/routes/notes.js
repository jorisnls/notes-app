require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
        const notes = await prisma.note.findMany({
            where: { userId: req.userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(notes)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content required' });
        }

        if (title.length > 100) {
            return res.status(400).json({ error: 'Title too long (max 100 characters)' });
        }

        const note = await prisma.note.create({
            data: {title, content, userId: req.userId }
        });
        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create note' });
    }
})

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body

        const note = await prisma.note.updateMany({ 
            where: { id: parseInt(id), userId: req.userId },
            data: { title, content }
        });

        if (note.count === 0) {
            return res.status(404).json({ error: 'Note not found' });
        }

        res.json({ message: 'Note updated' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update note' }); 
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const note = await prisma.note.deleteMany({
            where: { id: parseInt(id), userId: req.userId }
        });

        if (note.count === 0) {
            return res.status(404).json({ error: 'Note not found' });
        }
        
        res.json({ message: 'Note deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete note' });
    }
})

module.exports = router;