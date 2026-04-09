const express = require('express');
const router = express.Router();
const { Student } = require('../models');

// Get students by class (sorted by rollNumber ascending)
router.get('/class/:classId', async (req, res) => {
  try {
    const students = await Student.find({ classId: req.params.classId }).sort({ rollNumber: 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a student
router.post('/', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Admission number already exists.' });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
