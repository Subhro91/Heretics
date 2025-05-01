// Global variables
let currentTeacher = null;
let classStudents = [];
let currentSubject = 'mathematics'; // Default subject
let today = new Date();
let formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format
let attendanceChanged = false; // Track if attendance has been modified
let isReadOnlyMode = false; // Track if viewing past records

// Mock data for different subjects
const subjectStudents = {
  mathematics: [
    { id: 'student1', name: 'Alex Johnson', status: 'absent' },
    { id: 'student2', name: 'Jamie Smith', status: 'absent' },
    { id: 'student3', name: 'Casey Brown', status: 'absent' },
    { id: 'student4', name: 'Dakota Lee', status: 'absent' },
    { id: 'student5', name: 'Jordan Williams', status: 'absent' },
    { id: 'student6', name: 'Taylor Miller', status: 'absent' },
    { id: 'student7', name: 'Riley Davis', status: 'absent' }
  ],
  computerScience: [
    { id: 'student8', name: 'Morgan Wilson', status: 'absent' },
    { id: 'student9', name: 'Quinn Anderson', status: 'absent' },
    { id: 'student10', name: 'Avery Thomas', status: 'absent' },
    { id: 'student11', name: 'Skyler Johnson', status: 'absent' },
    { id: 'student12', name: 'Cameron Parker', status: 'absent' }
  ],
  physics: [
    { id: 'student13', name: 'Sam Robinson', status: 'absent' },
    { id: 'student14', name: 'Jordan Harris', status: 'absent' },
    { id: 'student15', name: 'Blake Foster', status: 'absent' },
    { id: 'student16', name: 'Drew Morgan', status: 'absent' }
  ],
  chemistry: [
    { id: 'student17', name: 'Terry Evans', status: 'absent' },
    { id: 'student18', name: 'Alex White', status: 'absent' },
    { id: 'student19', name: 'Jordan Reid', status: 'absent' },
    { id: 'student20', name: 'Casey Hall', status: 'absent' },
    { id: 'student21', name: 'Taylor Young', status: 'absent' }
  ],
  machineLearning: [
    { id: 'student22', name: 'Robin Patel', status: 'absent' },
    { id: 'student23', name: 'Aiden Kim', status: 'absent' },
    { id: 'student24', name: 'Zoe Chen', status: 'absent' },
    { id: 'student25', name: 'Ethan Rodriguez', status: 'absent' },
    { id: 'student26', name: 'Sofia Gupta', status: 'absent' }
  ],
  dataMining: [
    { id: 'student27', name: 'Noah Martinez', status: 'absent' },
    { id: 'student28', name: 'Emma Singh', status: 'absent' },
    { id: 'student29', name: 'Lucas Wang', status: 'absent' },
    { id: 'student30', name: 'Mia Brown', status: 'absent' }
  ],
  softComputing: [
    { id: 'student31', name: 'Jayden Park', status: 'absent' },
    { id: 'student32', name: 'Olivia Kumar', status: 'absent' },
    { id: 'student33', name: 'Liam Sharma', status: 'absent' },
    { id: 'student34', name: 'Ella Cruz', status: 'absent' }
  ],
  optimization: [
    { id: 'student35', name: 'Mason Lee', status: 'absent' },
    { id: 'student36', name: 'Charlotte Das', status: 'absent' },
    { id: 'student37', name: 'William Liu', status: 'absent' },
    { id: 'student38', name: 'Evelyn Wu', status: 'absent' }
  ],
  patternRecognition: [
    { id: 'student39', name: 'James Malhotra', status: 'absent' },
    { id: 'student40', name: 'Amelia Choi', status: 'absent' },
    { id: 'student41', name: 'Benjamin Desai', status: 'absent' },
    { id: 'student42', name: 'Abigail Kapoor', status: 'absent' }
  ],
  computerVision: [
    { id: 'student43', name: 'Henry Zhang', status: 'absent' },
    { id: 'student44', name: 'Isabella Choudhury', status: 'absent' },
    { id: 'student45', name: 'Alexander Bose', status: 'absent' },
    { id: 'student46', name: 'Sophia Malik', status: 'absent' }
  ]
};

// Initialize the teacher dashboard
document.addEventListener('DOMContentLoaded', async () => {
  // Get current teacher data from session storage
  const userData = JSON.parse(sessionStorage.getItem('currentUser')) || { role: 'teacher', displayName: 'Teacher', uid: 'teacher123' };
  
  if (userData && userData.role === 'teacher') {
    currentTeacher = userData;
    
    try {
      // Initialize calendar
      initCalendar();
      
      // Show current date
      updateDateDisplay();
      
      // Load mock student data for the default subject
      loadStudentsBySubject(currentSubject);
    } catch (error) {
      console.error('Error:', error);
      displayMessage('Error loading data: ' + error.message);
    }
    
    // Set up event listeners
    setupEventListeners();
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
      defaultDate: today,
      onChange: function(selectedDates, dateStr) {
        if (selectedDates.length > 0) {
          const selectedDate = dateStr;
          formattedDate = selectedDate;
          
          // Check if selected date is today or a past date
          const selected = new Date(selectedDate);
          const isToday = selected.toDateString() === today.toDateString();
          
          // Set read-only mode for past dates
          isReadOnlyMode = !isToday;
          
          // Update the UI for read-only mode
          updateReadOnlyMode();
          
          // Update date display
          updateDateDisplay();
          
          // Load attendance data for the selected date
          loadStudentsBySubject(currentSubject);
        }
      }
    });
    
    // Set default date to today
    calendarInput.value = formatDisplayDate(today);
  }
}

// Update the date display
function updateDateDisplay() {
  const dateElement = document.getElementById('attendanceDate');
  if (dateElement) {
    const dateObj = new Date(formattedDate);
    dateElement.textContent = formatDisplayDate(dateObj);
  }
}

// Format date for display
function formatDisplayDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Update UI for read-only mode
function updateReadOnlyMode() {
  const readOnlyNotice = document.getElementById('readOnlyNotice');
  const saveButton = document.getElementById('saveAttendanceBtn');
  const markAllPresentBtn = document.getElementById('markAllPresentBtn');
  const studentAttendanceToggles = document.querySelectorAll('.attendance-toggle');
  
  if (readOnlyNotice) {
    if (isReadOnlyMode) {
      readOnlyNotice.classList.remove('hidden');
    } else {
      readOnlyNotice.classList.add('hidden');
    }
  }
  
  if (saveButton) {
    if (isReadOnlyMode) {
      saveButton.classList.add('hidden');
    } else {
      saveButton.classList.remove('hidden');
      updateSaveButtonState();
    }
  }
  
  if (markAllPresentBtn) {
    if (isReadOnlyMode) {
      markAllPresentBtn.classList.add('hidden');
    } else {
      markAllPresentBtn.classList.remove('hidden');
    }
  }
  
  // Disable attendance toggles in read-only mode
  studentAttendanceToggles.forEach(toggle => {
    if (isReadOnlyMode) {
      toggle.disabled = true;
      toggle.parentElement.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
      toggle.disabled = false;
      toggle.parentElement.classList.remove('opacity-50', 'cursor-not-allowed');
    }
  });
}

// Load students based on selected subject
function loadStudentsBySubject(subject) {
  if (!subject) return;
  
  // For hackathon demo: Use mock data instead of DB call
  const studentNames = [
    "GULSHAN KUMAR SINHA",
    "ABHISHEK BISWAS",
    "MANSIJ ROY",
    "ROHIT KOLEY",
    "SUDIPTA DEY",
    "SUMIT PAUL",
    "HANIF SHAH",
    "PUJA ROY",
    "SUDIP MAHATO",
    "HIMANGSHU MAHATO",
    "SAGAF MEHAR",
    "SANJANA PATRA",
    "PATIT PABAN MAHATA",
    "RUPSA HAZRA",
    "AYAN GHOSH",
    "TIYASA SAHA",
    "SURJO BISWAS",
    "RISHAB SHARMA",
    "MD USMAN ANSARI",
    "MRITUNJOY MAHATO",
    "HIRAK MODAK",
    "HIMANSHU SINGH",
    "SOURYAKANTA MONDAL",
    "SANDIP KUNDU",
    "JIT MAJI",
    "SADMAAN WARSHI",
    "PRIYANSHU DUTTA",
    "SAD ALI",
    "PUJA CHATTERJEE",
    "VISHAL RAJ"
  ];
  
  // Create mock students
  classStudents = studentNames.map((name, index) => {
    // Generate realistic attendance (75% present)
    const isPresent = Math.random() < 0.75;
    
    return {
      id: `student${index + 1}`,
      name: name,
      status: isPresent ? 'present' : 'absent'
    };
  });
  
  // Update UI
  renderStudentList();
  updateAttendanceSummary();
  
  // Reset changed flag
  attendanceChanged = false;
  updateSaveButtonState();
  
  // For demonstration, we're adding this code to populate the subject filter dropdown
  const subjectFilter = document.getElementById('subjectFilter');
  if (subjectFilter) {
    // Clear existing options
    subjectFilter.innerHTML = '';
    
    // Add options for all subjects
    const subjects = {
      'mathematics': 'Mathematics 101',
      'computerScience': 'Computer Science 202',
      'physics': 'Physics 303',
      'chemistry': 'Chemistry 404',
      'machineLearning': 'Machine Learning for Real World Application',
      'dataMining': 'Data Mining and Data Warehousing',
      'softComputing': 'Soft Computing',
      'optimization': 'Optimization Techniques',
      'patternRecognition': 'Pattern Recognition',
      'computerVision': 'Computer Vision'
    };
    
    Object.keys(subjects).forEach(subjectKey => {
      const option = document.createElement('option');
      option.value = subjectKey;
      option.textContent = subjects[subjectKey];
      option.selected = subjectKey === subject;
      subjectFilter.appendChild(option);
    });
  }
}

// Update the attendance summary
function updateAttendanceSummary() {
  const totalStudents = classStudents.length;
  const presentStudents = classStudents.filter(s => s.status === 'present').length;
  
  const summaryElement = document.getElementById('attendanceSummary');
  if (summaryElement) {
    summaryElement.textContent = `${presentStudents} of ${totalStudents} students present (${Math.round((presentStudents / totalStudents) * 100)}%)`;
  }
}

// Save attendance data to session storage and update analytics
function saveAttendanceData() {
  // Save current subject's data
  const subjectKey = `attendance_${currentSubject}_${formattedDate}`;
  sessionStorage.setItem(subjectKey, JSON.stringify(classStudents));
  
  // Save attendance history for the analytics graph
  saveAttendanceHistory();
  
  // Save aggregated data for all subjects (for analytics)
  const allAttendanceData = {};
  let totalPresent = 0;
  let totalStudents = 0;
  
  // Calculate totals across all subjects
  Object.keys(subjectStudents).forEach(subject => {
    const subjectData = JSON.parse(sessionStorage.getItem(`attendance_${subject}_${formattedDate}`)) || subjectStudents[subject];
    const subjectPresent = subjectData.filter(s => s.status === 'present').length;
    
    allAttendanceData[subject] = {
      total: subjectData.length,
      present: subjectPresent,
      percentage: subjectData.length > 0 ? Math.round((subjectPresent / subjectData.length) * 100) : 0
    };
    
    totalPresent += subjectPresent;
    totalStudents += subjectData.length;
  });
  
  // Add the overall statistics
  allAttendanceData.overall = {
    total: totalStudents,
    present: totalPresent,
    percentage: totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0,
    date: formattedDate
  };
  
  // Save to session storage for analytics page
  sessionStorage.setItem('attendance_summary', JSON.stringify(allAttendanceData));
  
  // Reset change tracker
  attendanceChanged = false;
  updateSaveButtonState();
}

// Save attendance history for analytics chart
function saveAttendanceHistory() {
  // Create a 2-week attendance history if it doesn't exist
  let attendanceHistory = JSON.parse(sessionStorage.getItem('attendance_history')) || [];
  
  // Find if we already have an entry for this date and subject
  const entryIndex = attendanceHistory.findIndex(
    entry => entry.date === formattedDate && entry.subject === currentSubject
  );
  
  // Calculate attendance rate for the current subject
  const presentCount = classStudents.filter(s => s.status === 'present').length;
  const attendanceRate = Math.round((presentCount / classStudents.length) * 100);
  
  // Create attendance data entry
  const attendanceEntry = {
    date: formattedDate,
    subject: currentSubject,
    rate: attendanceRate
  };
  
  // Update or add attendance entry
  if (entryIndex >= 0) {
    // Update existing record
    attendanceHistory[entryIndex] = attendanceEntry;
  } else {
    // Add new record
    attendanceHistory.push(attendanceEntry);
  }
  
  // Keep only the last 14 days per subject (to avoid cluttering storage)
  const subjectEntries = attendanceHistory.filter(entry => entry.subject === currentSubject);
  if (subjectEntries.length > 14) {
    // Sort by date (oldest first)
    subjectEntries.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Get the dates to remove (oldest dates beyond 14)
    const datesToRemove = subjectEntries.slice(0, subjectEntries.length - 14).map(entry => entry.date);
    
    // Filter out the entries with dates to remove
    attendanceHistory = attendanceHistory.filter(
      entry => !(entry.subject === currentSubject && datesToRemove.includes(entry.date))
    );
  }
  
  // Save back to session storage
  sessionStorage.setItem('attendance_history', JSON.stringify(attendanceHistory));
  
  // If the analytics.js updateAttendanceData function is available, call it
  if (window.updateAttendanceData) {
    window.updateAttendanceData(currentSubject, formattedDate, attendanceRate);
  }
}

// Render the student list in the UI
function renderStudentList() {
  const studentListElement = document.getElementById('studentList');
  if (!studentListElement) return;
  
  studentListElement.innerHTML = '';
  
  classStudents.forEach(student => {
    const studentRow = document.createElement('div');
    studentRow.className = 'flex items-center justify-between py-3 border-b last:border-b-0';
    
    // Determine if the student is present or absent
    const isPresent = student.status === 'present';
    
    studentRow.innerHTML = `
      <div class="flex items-center">
        <input type="checkbox" 
               id="student-${student.id}" 
               class="studentCheckbox w-5 h-5 text-blue-600 rounded" 
               data-student-id="${student.id}"
               ${isPresent ? 'checked' : ''}
               ${isReadOnlyMode ? 'disabled' : ''}>
        <label for="student-${student.id}" class="ml-3 text-gray-700">${student.name}</label>
      </div>
      <span class="text-${isPresent ? 'green' : 'red'}-600">${isPresent ? 'Present' : 'Absent'}</span>
    `;
    
    studentListElement.appendChild(studentRow);
  });
}

// Set up event listeners
function setupEventListeners() {
  // Subject filter change
  const subjectFilter = document.getElementById('subjectFilter');
  if (subjectFilter) {
    subjectFilter.addEventListener('change', () => {
      // Prompt if unsaved changes and not in read-only mode
      if (attendanceChanged && !isReadOnlyMode) {
        const confirmed = confirm('You have unsaved attendance changes. Do you want to switch subjects without saving?');
        if (!confirmed) return;
      }
      
      currentSubject = subjectFilter.value;
      loadStudentsBySubject(currentSubject);
    });
  }
  
  // Mark All Present button
  const markAllPresentBtn = document.getElementById('markAllPresentBtn');
  if (markAllPresentBtn) {
    markAllPresentBtn.addEventListener('click', () => {
      if (!isReadOnlyMode) {
        markAllPresent();
      }
    });
  }
  
  // Save Attendance button
  const saveAttendanceBtn = document.getElementById('saveAttendanceBtn');
  if (saveAttendanceBtn) {
    saveAttendanceBtn.addEventListener('click', () => {
      if (!isReadOnlyMode) {
        saveAttendanceData();
        displayMessage('Attendance saved successfully!', false, 'success');
      }
    });
  }
  
  // Listen for changes to individual checkboxes
  document.addEventListener('change', event => {
    if (event.target.classList.contains('studentCheckbox') && !isReadOnlyMode) {
      const studentId = event.target.dataset.studentId;
      const isPresent = event.target.checked;
      updateStudentAttendance(studentId, isPresent);
    }
  });
}

// Update Save button state
function updateSaveButtonState() {
  const saveBtn = document.getElementById('saveAttendanceBtn');
  if (saveBtn && !isReadOnlyMode) {
    if (attendanceChanged) {
      saveBtn.classList.add('animate-pulse');
      saveBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      saveBtn.disabled = false;
    } else {
      saveBtn.classList.remove('animate-pulse');
      saveBtn.classList.add('opacity-50', 'cursor-not-allowed');
      saveBtn.disabled = true;
    }
  }
}

// Mark all students as present
function markAllPresent() {
  if (isReadOnlyMode) return; // Don't allow changes in read-only mode
  
  const checkboxes = document.querySelectorAll('.studentCheckbox');
  checkboxes.forEach(checkbox => {
    checkbox.checked = true;
    updateStudentAttendance(checkbox.dataset.studentId, true);
  });
  
  // Update UI to reflect all students as present
  const statusSpans = document.querySelectorAll('#studentList span');
  statusSpans.forEach(span => {
    span.className = 'text-green-600';
    span.textContent = 'Present';
  });
  
  // Update attendance summary
  updateAttendanceSummary();
  
  // Mark as changed
  attendanceChanged = true;
  updateSaveButtonState();
}

// Update a student's attendance status
function updateStudentAttendance(studentId, isPresent) {
  if (isReadOnlyMode) return; // Don't allow changes in read-only mode
  
  try {
    // Find the student in our array
    const studentIndex = classStudents.findIndex(s => s.id === studentId);
    if (studentIndex === -1) return;
    
    // For hackathon demo, just update the local array
    classStudents[studentIndex].status = isPresent ? 'present' : 'absent';
    
    // Update UI
    const statusElement = document.querySelector(`#student-${studentId}`).parentNode.parentNode.querySelector('span');
    statusElement.className = `text-${isPresent ? 'green' : 'red'}-600`;
    statusElement.textContent = isPresent ? 'Present' : 'Absent';
    
    // Update attendance summary
    updateAttendanceSummary();
    
    // Mark as changed
    attendanceChanged = true;
    updateSaveButtonState();
    
    // Log for debugging
    console.log(`Updated student ${classStudents[studentIndex].name} status to ${classStudents[studentIndex].status}`);
    
  } catch (error) {
    console.error('Error updating attendance:', error);
    displayMessage('Error updating attendance: ' + error.message);
  }
}

// Display a message to the user
function displayMessage(message, isError = false, type = '') {
  // Check if a message container already exists
  let messageContainer = document.getElementById('messageContainer');
  
  if (!messageContainer) {
    // Create a new message container
    messageContainer = document.createElement('div');
    messageContainer.id = 'messageContainer';
    
    let bgColor = 'bg-blue-100';
    let textColor = 'text-blue-700';
    
    if (isError) {
      bgColor = 'bg-red-100';
      textColor = 'text-red-700';
    } else if (type === 'success') {
      bgColor = 'bg-green-100';
      textColor = 'text-green-700';
    }
    
    messageContainer.className = `fixed top-4 right-4 p-4 rounded-md ${bgColor} ${textColor} max-w-xs z-50 flex items-center`;
    
    // Add message content
    messageContainer.innerHTML = `
      <i class="fas ${isError ? 'fa-exclamation-circle' : type === 'success' ? 'fa-check-circle' : 'fa-info-circle'} mr-2"></i>
      <span>${message}</span>
    `;
    
    document.body.appendChild(messageContainer);
  } else {
    // Update existing container
    let bgColor = 'bg-blue-100';
    let textColor = 'text-blue-700';
    let icon = 'fa-info-circle';
    
    if (isError) {
      bgColor = 'bg-red-100';
      textColor = 'text-red-700';
      icon = 'fa-exclamation-circle';
    } else if (type === 'success') {
      bgColor = 'bg-green-100';
      textColor = 'text-green-700';
      icon = 'fa-check-circle';
    }
    
    messageContainer.className = `fixed top-4 right-4 p-4 rounded-md ${bgColor} ${textColor} max-w-xs z-50 flex items-center`;
    messageContainer.innerHTML = `
      <i class="fas ${icon} mr-2"></i>
      <span>${message}</span>
    `;
  }
  
  // Remove the message after 3 seconds
  setTimeout(() => {
    if (messageContainer.parentNode) {
      messageContainer.parentNode.removeChild(messageContainer);
    }
  }, 3000);
} 