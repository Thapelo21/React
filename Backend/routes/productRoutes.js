const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all products
router.get('/', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.json(results);
    });
});

// Create a new product
router.post('/', (req, res) => {
    const { name, description, category, price, quantity } = req.body;
    const product = { name, description, category, price, quantity };
    db.query('INSERT INTO products SET ?', product, (err, result) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        res.status(201).json({ id: result.insertId, ...product });
    });
});

// Update a product
router.patch('/:id', (req, res) => {
    const { name, description, category, price, quantity } = req.body;
    const product = { name, description, category, price, quantity };
    db.query('UPDATE products SET ? WHERE id = ?', [product, req.params.id], (err, result) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        res.json({ id: req.params.id, ...product });
    });
});

// Delete a product
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM products WHERE id = ?', req.params.id, (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.json({ message: 'Product deleted' });
    });
});

module.exports = router;
