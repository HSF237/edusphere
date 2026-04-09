const express = require('express');
const router = express.Router();
const { School, Class } = require('../models');

// Get school and classes
router.get('/:id', async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) return res.status(404).json({ message: 'School not found' });
    
    const classes = await Class.find({ schoolId: req.params.id });
    res.json({ school, classes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new class
router.post('/classes', async (req, res) => {
  try {
    const { schoolId, name, division } = req.body;
    // Generate unique joining code for parents
    const joinCode = Math.random().toString().slice(2, 10);
    const newClass = new Class({ schoolId, name, division, joinCode });
    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reset school code
router.post('/:id/reset-code', async (req, res) => {
  try {
    const newCode = Math.random().toString().slice(2, 10);
    const updated = await School.findByIdAndUpdate(req.params.id, { schoolCode: newCode }, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all classes for a school
router.get('/:id/classes', async (req, res) => {
  try {
    const classes = await Class.find({ schoolId: req.params.id });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
