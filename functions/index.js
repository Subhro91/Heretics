const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Configure Nodemailer with environment variables
// Note: Set these in the Firebase Cloud Functions console
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.password
  }
});

/**
 * Cloud Function that runs daily to send absence alerts
 * Scheduled to run at 8 PM every day
 */
exports.sendAbsenceAlerts = functions.pubsub.schedule('0 20 * * *')
  .timeZone('America/New_York') // Change to your local timezone
  .onRun(async (context) => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    
    try {
      // Get all classes
      const classesSnapshot = await admin.firestore().collection('classes').get();
      
      for (const classDoc of classesSnapshot.docs) {
        const classId = classDoc.id;
        const className = classDoc.data().name || `Class ${classId}`;
        
        // Get all students in this class
        const studentsSnapshot = await admin.firestore()
          .collection('users')
          .where('role', '==', 'student')
          .where('classId', '==', classId)
          .get();
        
        // Get today's attendance records for this class
        const attendanceSnapshot = await admin.firestore()
          .collection('attendance')
          .where('classId', '==', classId)
          .where('date', '==', formattedDate)
          .get();
        
        // Create a map of student IDs to attendance status
        const attendanceMap = {};
        attendanceSnapshot.forEach(doc => {
          const data = doc.data();
          attendanceMap[data.studentId] = data.status;
        });
        
        // Find absent students
        const absentStudents = [];
        
        for (const studentDoc of studentsSnapshot.docs) {
          const studentId = studentDoc.id;
          const studentData = studentDoc.data();
          
          // If student has no attendance record or is marked absent
          if (!attendanceMap[studentId] || attendanceMap[studentId] === 'absent') {
            absentStudents.push({
              id: studentId,
              name: studentData.displayName || studentData.email,
              email: studentData.email
            });
          }
        }
        
        // Send emails to absent students
        for (const student of absentStudents) {
          await sendAbsenceEmail(student, className, formattedDate);
        }
        
        console.log(`Processed ${absentStudents.length} absence alerts for ${className}`);
      }
      
      return null;
    } catch (error) {
      console.error('Error sending absence alerts:', error);
      return null;
    }
  });

/**
 * Sends an email to a student who was absent
 */
async function sendAbsenceEmail(student, className, date) {
  // Format date for display
  const displayDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const mailOptions = {
    from: '"Attend & Thrive" <noreply@attendandthrive.com>',
    to: student.email,
    subject: `Absence Alert: ${className} on ${displayDate}`,
    text: `Dear ${student.name},\n\nThis is an automated notification to inform you that you were marked absent in ${className} on ${displayDate}.\n\nIf you believe this is an error, please contact your teacher.\n\nRegards,\nAttend & Thrive Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Absence Alert</h2>
        <p>Dear ${student.name},</p>
        <p>This is an automated notification to inform you that you were marked <strong style="color: #ef4444;">absent</strong> in <strong>${className}</strong> on <strong>${displayDate}</strong>.</p>
        <p>If you believe this is an error, please contact your teacher.</p>
        <p>Regards,<br>Attend & Thrive Team</p>
      </div>
    `
  };
  
  try {
    await mailTransport.sendMail(mailOptions);
    console.log(`Absence alert sent to ${student.email}`);
  } catch (error) {
    console.error(`Error sending email to ${student.email}:`, error);
  }
} 