const express = require('express');
const router = express.Router();
const { UserProfile, School, Class } = require('../models');

// Get user profile
router.get('/profile/:id', async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.params.id }).populate('schoolId');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Onboarding: Create Profile + School / Join School / Join Class
router.post('/onboard', async (req, res) => {
  try {
    const { userId, role, name, code } = req.body; // code could be schoolCode or classJoinCode
    
    let profileData = { userId, role, name };
    
    if (role === 'PRINCIPAL') {
      const schoolCode = Math.random().toString().slice(2, 10); // 8 digit
      const school = new School({ name: `${name}'s School`, schoolCode, principalId: userId });
      await school.save();
      profileData.schoolId = school._id;
    } else if (role === 'TEACHER') {
      const school = await School.findOne({ schoolCode: code });
      if (!school) return res.status(404).json({ message: 'Invalid School Code' });
      profileData.schoolId = school._id;
    } else if (role === 'PARENT') {
      const classData = await Class.findOne({ joinCode: code });
      if (!classData) return res.status(404).json({ message: 'Invalid Class Code' });
      profileData.schoolId = classData.schoolId;
      // We don't link childStudentIds here yet, that happens in a separate step or when they search for their child
    }

    const profile = new UserProfile(profileData);
    await profile.save();
    
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
