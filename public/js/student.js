// Global variables
let currentStudent = null;
let attendanceData = [];
let filteredAttendanceData = [];
let subjectFilterInitialized = false;
let calendarInitialized = false;

// Initialize the student dashboard
document.addEventListener('DOMContentLoaded', async () => {
  // Get current student data from session storage or use mock data
  const userData = JSON.parse(sessionStorage.getItem('currentUser')) || {
    role: 'student',
    displayName: 'Sample Student',
    email: 'student@example.com',
    uid: 'student123',
    classId: 'class1'
  };
  
  if (userData && userData.role === 'student') {
    currentStudent = userData;
    
    // Display student info
    displayStudentInfo(currentStudent);
    
    // Load mock attendance data for the hackathon
    loadMockAttendanceData();
    
    // Initialize calendar
    initCalendar();
    
    // Initialize subject filter
    initSubjectFilter();
  }
});

// Initialize calendar widget
function initCalendar() {
  const calendarInput = document.getElementById('attendanceCalendar');
  if (calendarInput) {
    // Initialize flatpickr calendar
    const calendar = flatpickr(calendarInput, {
      dateFormat: "Y-m-d",
      maxDate: "today",
      defaultDate: "today",
      onChange: function(selectedDates, dateStr) {
        // Filter attendance by selected date
        if (selectedDates.length > 0) {
          const selectedDate = dateStr;
          // Force immediate filtering without delay - was causing issues with first click
          const filteredData = attendanceData.filter(record => 
            record.date === selectedDate
          );
          renderAttendanceTable(filteredData);
          
          // Reset subject filter to prevent confusion
          const subjectFilter = document.getElementById('subjectFilter');
          if (subjectFilter) {
            subjectFilter.value = 'all';
          }
          
          if (filteredData.length === 0) {
            displayMessage(`No attendance records found for ${new Date(selectedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`);
          } else {
            updateAttendanceSummary(
              filteredData.filter(record => record.status === 'present').length,
              filteredData.length
            );
          }
        } else {
          // Reset to show all attendance when date cleared
          filteredAttendanceData = [...attendanceData];
          renderAttendanceTable(filteredAttendanceData);
          updateAttendanceSummary(
            filteredAttendanceData.filter(record => record.status === 'present').length,
            filteredAttendanceData.length
          );
        }
      }
    });
    
    // Set default date to today
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    calendarInput.value = formattedDate;
    
    // Set flag to indicate calendar is initialized
    calendarInitialized = true;
  }
}

// Initialize subject filter
function initSubjectFilter() {
  const subjectFilter = document.getElementById('subjectFilter');
  if (subjectFilter) {
    // Clear existing options
    subjectFilter.innerHTML = '<option value="all">All Subjects</option>';
    
    // Get unique subjects from attendance data
    const uniqueSubjects = [...new Set(attendanceData.map(record => record.subjectName))];
    
    // Add options for each subject
    uniqueSubjects.forEach(subject => {
      const option = document.createElement('option');
      option.value = subject;
      option.textContent = subject;
      subjectFilter.appendChild(option);
    });
    
    // Execute filtering on page load regardless of value
    // This ensures everything is initialized properly
    const initialValue = subjectFilter.value;
    filterBySubject(initialValue);
    
    // Improved change event handler with immediate processing
    subjectFilter.addEventListener('change', (e) => {
      const selectedSubject = e.target.value;
      // Apply filtering immediately, no delay
      filterBySubject(selectedSubject);
      
      // Clear any date selection to avoid confusion
      const calendarInput = document.getElementById('attendanceCalendar');
      if (calendarInput && calendarInput._flatpickr) {
        calendarInput._flatpickr.clear();
      }
    });
    
    // Add reset button
    const resetButton = document.getElementById('resetFilters');
    if (resetButton) {
      resetButton.addEventListener('click', () => {
        // Reset subject filter
        subjectFilter.value = 'all';
        
        // Clear date filter
        const calendarInput = document.getElementById('attendanceCalendar');
        if (calendarInput && calendarInput._flatpickr) {
          calendarInput._flatpickr.clear();
        }
        
        // Show all data
        filteredAttendanceData = [...attendanceData];
        renderAttendanceTable(filteredAttendanceData);
        updateAttendanceSummary(
          filteredAttendanceData.filter(record => record.status === 'present').length,
          filteredAttendanceData.length
        );
      });
    }
    
    // Set flag to indicate subject filter is initialized
    subjectFilterInitialized = true;
  }
}

// Separate function for subject filtering for better organization
function filterBySubject(selectedSubject) {
  if (selectedSubject === 'all') {
    filteredAttendanceData = [...attendanceData];
  } else {
    // Filter by subject
    filteredAttendanceData = attendanceData.filter(record => {
      return record.subjectName === selectedSubject;
    });
  }
  
  // Update the UI with filtered data - force immediate update
  renderAttendanceTable(filteredAttendanceData);
  updateAttendanceSummary(
    filteredAttendanceData.filter(record => record.status === 'present').length,
    filteredAttendanceData.length
  );
  
  if (filteredAttendanceData.length === 0) {
    displayMessage(`No attendance records found for ${selectedSubject}`);
  }
}

// Display student information
function displayStudentInfo(student) {
  const studentNameElement = document.getElementById('studentName');
  const studentIDElement = document.getElementById('studentID');
  
  if (studentNameElement) {
    studentNameElement.textContent = student.displayName || student.email || 'Student';
  }
  
  if (studentIDElement) {
    studentIDElement.textContent = `ID: ${student.uid.substring(0, 8)}`;
  }
}

// Load mock attendance data for demo purposes
function loadMockAttendanceData() {
  // Generate mock attendance records
  const today = new Date();
  attendanceData = [];
  
  // New CS subjects
  const subjects = [
    { id: 'pcc-csm601', name: 'Machine Learning for Real World Application' },
    { id: 'pcc-csm602', name: 'Data Mining and Data Warehousing' },
    { id: 'pec-csm601a', name: 'Soft Computing' },
    { id: 'pec-csm601b', name: 'Optimization Techniques' },
    { id: 'pec-csm601c', name: 'Pattern Recognition' },
    { id: 'pec-csm602a', name: 'Computer Vision' }
  ];
  
  // Create mock attendance for the last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) {
      continue;
    }
    
    // Add only two subjects per day to reduce clutter
    const daySubjects = subjects.slice(0, Math.min(2, subjects.length));
    
    // Each day has different subjects (rotate the array)
    subjects.push(subjects.shift());
    
    // Add one record for each subject each day
    daySubjects.forEach(subject => {
      // Random status (80% chance of present for realistic data)
      const isPresent = Math.random() < 0.8;
      
      attendanceData.push({
        id: `attendance_${i}_${subject.id}`,
        date: date.toISOString().split('T')[0],
        status: isPresent ? 'present' : 'absent',
        classId: subject.id,
        subjectName: subject.name
      });
    });
  }
  
  // Set initial filtered data
  filteredAttendanceData = [...attendanceData];
  
  // Update the summary
  updateAttendanceSummary(
    attendanceData.filter(record => record.status === 'present').length,
    attendanceData.length
  );
  
  // Render the attendance table
  renderAttendanceTable(attendanceData);
}

// Load attendance data for the student (original function, not used in hackathon demo)
async function loadAttendanceData() {
  try {
    // Get attendance records for this student
    const attendanceSnapshot = await db.collection('attendance')
      .where('studentId', '==', currentStudent.uid)
      .orderBy('date', 'desc')
      .limit(30) // Last 30 days
      .get();
    
    if (attendanceSnapshot.empty) {
      updateAttendanceSummary(0, 0);
      displayMessage('No attendance records found');
      return;
    }
    
    // Process attendance data
    attendanceData = attendanceSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        date: data.date,
        status: data.status,
        classId: data.classId
      };
    });
    
    // Set initial filtered data
    filteredAttendanceData = [...attendanceData];
    
    // Update the summary
    updateAttendanceSummary(
      attendanceData.filter(record => record.status === 'present').length,
      attendanceData.length
    );
    
    // Render the attendance table
    renderAttendanceTable(attendanceData);
    
  } catch (error) {
    console.error('Error loading attendance data:', error);
    displayMessage('Error loading attendance data: ' + error.message, true);
  }
}

// Update attendance summary
function updateAttendanceSummary(presentCount, totalCount) {
  const presentDaysElement = document.getElementById('presentDays');
  const absentDaysElement = document.getElementById('absentDays');
  const attendanceRateElement = document.getElementById('attendanceRate');
  
  const absentCount = totalCount - presentCount;
  const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;
  
  if (presentDaysElement) {
    presentDaysElement.textContent = presentCount;
  }
  
  if (absentDaysElement) {
    absentDaysElement.textContent = absentCount;
  }
  
  if (attendanceRateElement) {
    attendanceRateElement.textContent = `${attendanceRate}%`;
  }
}

// Render attendance records in the table
function renderAttendanceTable(records) {
  const tableBody = document.getElementById('attendanceTable');
  if (!tableBody) return;
  
  // Clear existing rows
  tableBody.innerHTML = '';
  
  if (records.length === 0) {
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = `
      <td colspan="3" class="px-6 py-4 text-center text-gray-500">
        No attendance records found
      </td>
    `;
    tableBody.appendChild(emptyRow);
    return;
  }
  
  // Sort records by date (newest first)
  const sortedRecords = [...records].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
  
  // Create table rows
  sortedRecords.forEach(record => {
    const row = document.createElement('tr');
    row.className = 'hover:bg-gray-50';
    
    // Format date
    const date = new Date(record.date);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short'
    });
    
    // Format subject name
    const subjectCode = record.subjectName.split(' - ')[0];
    const subjectName = record.subjectName.split(' - ')[1] || record.subjectName;
    
    // Status icon and color
    const statusIcon = record.status === 'present' 
      ? '<i class="fas fa-check-circle text-green-600"></i>' 
      : '<i class="fas fa-times-circle text-red-600"></i>';
      
    const statusText = record.status === 'present' ? 'Present' : 'Absent';
    const statusClass = record.status === 'present' ? 'text-green-800 bg-green-100' : 'text-red-800 bg-red-100';
    
    row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${formattedDate}</td>
      <td class="px-6 py-4 text-sm text-gray-700">
        <div class="font-medium">${subjectName}</div>
        <div class="text-xs text-gray-500">${subjectCode}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
          ${statusIcon} <span class="ml-1">${statusText}</span>
        </span>
      </td>
    `;
    
    tableBody.appendChild(row);
  });
}

// Display a message to the user
function displayMessage(message, isError = false) {
  // Check if a message container already exists
  let messageContainer = document.getElementById('messageContainer');
  
  if (!messageContainer) {
    // Create a new message container
    messageContainer = document.createElement('div');
    messageContainer.id = 'messageContainer';
    messageContainer.className = `fixed top-4 right-4 p-4 rounded-md ${isError ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'} max-w-xs`;
    document.body.appendChild(messageContainer);
  } else {
    // Update existing container
    messageContainer.className = `fixed top-4 right-4 p-4 rounded-md ${isError ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'} max-w-xs`;
  }
  
  messageContainer.textContent = message;
  
  // Remove the message after 3 seconds
  setTimeout(() => {
    if (messageContainer.parentNode) {
      messageContainer.parentNode.removeChild(messageContainer);
    }
  }, 3000);
} 