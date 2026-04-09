const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  schoolCode: { type: String, required: true, unique: true }, // unique 8-digit
  principalId: { type: String, required: true }, // Supabase User ID
});

const userProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // Supabase auth ID
  role: { type: String, enum: ['PRINCIPAL', 'TEACHER', 'PARENT'], required: true },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
  name: { type: String, required: true },
  assignedClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }], // For teachers
  childStudentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }] // For parents
});

const classSchema = new mongoose.Schema({
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  name: { type: String, required: true }, // e.g., "10"
  division: { type: String, required: true }, // e.g., "A"
  joinCode: { type: String, required: true, unique: true } // code for parents to join
});

const studentSchema = new mongoose.Schema({
  admissionNumber: { type: String, required: true, unique: true },
  rollNumber: { type: Number, required: true },
  name: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  parentName: { type: String, required: true },
  age: { type: Number },
  dob: { type: Date },
  gmail: { type: String },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true }
});

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Present', 'Absent', 'Leave', 'Pending'], required: true },
  isApproved: { type: Boolean, default: false },
  teacherId: { type: String } // Supabase userId of teacher who logged it
});

const examTypeSchema = new mongoose.Schema({
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  name: { type: String, required: true } // e.g., 'Unit Test 1'
});

const examSchema = new mongoose.Schema({
  examTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamType', required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  subject: { type: String, required: true },
  maxMarks: { type: Number, required: true },
  dateRange: { type: String, required: true } // e.g. "2023-10-01 to 2023-10-05"
});

const markSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  marksObtained: { type: Number, required: true }
});

const messageSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  senderId: { type: String, required: true }, // Supabase User ID (parent or teacher)
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const leaveRequestSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  parentId: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
});

module.exports = {
  School: mongoose.model('School', schoolSchema),
  UserProfile: mongoose.model('UserProfile', userProfileSchema),
  Class: mongoose.model('Class', classSchema),
  Student: mongoose.model('Student', studentSchema),
  Attendance: mongoose.model('Attendance', attendanceSchema),
  ExamType: mongoose.model('ExamType', examTypeSchema),
  Exam: mongoose.model('Exam', examSchema),
  Mark: mongoose.model('Mark', markSchema),
  Message: mongoose.model('Message', messageSchema),
  LeaveRequest: mongoose.model('LeaveRequest', leaveRequestSchema)
};
