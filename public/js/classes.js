// classes.js - Functionality for managing classes in the teacher dashboard

// Class subject color schemes
const CLASS_COLORS = {
  'mathematics': {
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    icon: 'bg-blue-100 text-blue-600'
  },
  'computerScience': {
    bg: 'bg-green-50',
    border: 'border-green-100',
    icon: 'bg-green-100 text-green-600'
  },
  'physics': {
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    icon: 'bg-purple-100 text-purple-600'
  },
  'chemistry': {
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    icon: 'bg-amber-100 text-amber-600'
  },
  'machineLearning': {
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    icon: 'bg-blue-100 text-blue-600'
  },
  'dataMining': {
    bg: 'bg-green-50',
    border: 'border-green-100',
    icon: 'bg-green-100 text-green-600'
  },
  'softComputing': {
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    icon: 'bg-purple-100 text-purple-600'
  },
  'optimization': {
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    icon: 'bg-amber-100 text-amber-600'
  },
  'patternRecognition': {
    bg: 'bg-yellow-50',
    border: 'border-yellow-100',
    icon: 'bg-yellow-100 text-yellow-600'
  },
  'computerVision': {
    bg: 'bg-red-50',
    border: 'border-red-100',
    icon: 'bg-red-100 text-red-600'
  }
};

// Default class days to subject and icon mappings
const DEFAULT_CLASSES = [
  {
    id: 'cls1',
    name: 'PCC-CSM601 - Machine Learning for Real World Application',
    subject: 'machineLearning',
    description: 'Advanced ML concepts',
    day: 'monday',
    time: '10:00',
    endTime: '11:30',
    room: 'Room 101, Engineering Building',
    enrolledStudents: 28
  },
  {
    id: 'cls2',
    name: 'PCC-CSM602 - Data Mining and Data Warehousing',
    subject: 'dataMining',
    description: 'Data mining techniques',
    day: 'tuesday',
    time: '14:00',
    endTime: '15:30',
    room: 'CS Lab 2, Computer Science Building',
    enrolledStudents: 24
  },
  {
    id: 'cls3',
    name: 'PEC-CSM601A - Soft Computing',
    subject: 'softComputing',
    description: 'Neural networks and fuzzy logic',
    day: 'tuesday',
    time: '08:00',
    endTime: '09:30',
    room: 'Room P102',
    enrolledStudents: 22
  },
  {
    id: 'cls4',
    name: 'PEC-CSM601C - Pattern Recognition',
    subject: 'patternRecognition',
    description: 'Pattern extraction and classification',
    day: 'monday',
    time: '16:00',
    endTime: '17:30',
    room: 'Chem Lab 1',
    enrolledStudents: 19
  }
];

// Load classes from session storage or use defaults
function loadClasses() {
  const storedClasses = sessionStorage.getItem('teacherClasses');
  if (storedClasses) {
    return JSON.parse(storedClasses);
  } else {
    // No stored classes, use defaults
    saveClasses(DEFAULT_CLASSES);
    return DEFAULT_CLASSES;
  }
}

// Save classes to session storage
function saveClasses(classes) {
  sessionStorage.setItem('teacherClasses', JSON.stringify(classes));
}

// Get a single class by ID
function getClassById(classId) {
  const classes = loadClasses();
  return classes.find(cls => cls.id === classId);
}

// Add a new class
function addClass(classData) {
  const classes = loadClasses();
  
  // Generate a random ID
  const newId = 'cls' + Date.now().toString();
  
  // Add the new class with the generated ID
  const newClass = {
    id: newId,
    ...classData
  };
  
  classes.push(newClass);
  saveClasses(classes);
  
  return newClass;
}

// Delete a class by ID
function deleteClass(classId) {
  let classes = loadClasses();
  
  // Filter out the class with the matching ID
  classes = classes.filter(cls => cls.id !== classId);
  
  // Save the updated classes
  saveClasses(classes);
  
  return classes;
}

// Format time for display (e.g., convert 14:00 to 2:00 PM)
function formatClassTime(timeStr) {
  if (!timeStr) return '';
  
  try {
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    if (isNaN(hours) || isNaN(minutes)) {
      return timeStr;
    }
    
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeStr;
  }
}

// Get day name from day value
function getDayName(day) {
  const days = {
    'monday': 'Monday',
    'tuesday': 'Tuesday',
    'wednesday': 'Wednesday',
    'thursday': 'Thursday',
    'friday': 'Friday'
  };
  
  return days[day] || day;
}

// Get class card HTML for today's classes
function renderTodayClasses(classes) {
  // For the hackathon demo, let's always show some classes for today
  // regardless of the actual day of the week
  let todayClasses = classes.filter(cls => cls.day === 'monday'); // Use Monday's classes for demo
  
  // If there are no classes, return the no classes message
  if (todayClasses.length === 0) {
    todayClasses = [
      {
        id: 'cls-today-1',
        name: 'PCC-CSM601 - Machine Learning for Real World Application',
        subject: 'machineLearning',
        description: 'Advanced ML concepts',
        day: 'monday',
        time: '10:00',
        endTime: '11:30',
        room: 'Room 101, Engineering Building',
        enrolledStudents: 28
      },
      {
        id: 'cls-today-2',
        name: 'PEC-CSM601A - Soft Computing',
        subject: 'softComputing',
        description: 'Neural networks and fuzzy logic',
        day: 'monday',
        time: '08:00',
        endTime: '09:30',
        room: 'Room P102',
        enrolledStudents: 22
      }
    ];
  }
  
  return todayClasses.map(cls => {
    const colorScheme = CLASS_COLORS[cls.subject] || CLASS_COLORS['machineLearning'];
    const isCurrentTime = isClassInProgress(cls);
    const statusBadge = isCurrentTime 
      ? '<span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">In Progress</span>'
      : `<span class="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">${formatClassTime(cls.time)}</span>`;
    
    return `
      <div class="border border-gray-200 rounded-lg p-4 ${isCurrentTime ? colorScheme.bg : 'bg-white'}" id="class-card-${cls.id}">
        <div class="flex justify-between items-start mb-2">
          <div>
            <h3 class="font-semibold text-gray-800">${cls.name}</h3>
            <p class="text-sm text-gray-600">${cls.description}</p>
          </div>
          ${statusBadge}
        </div>
        <div class="flex items-center text-sm text-gray-700 mb-2">
          <i class="fas fa-clock text-gray-500 mr-2"></i>
          <span>${formatClassTime(cls.time)} - ${formatClassTime(cls.endTime)}</span>
        </div>
        <div class="flex items-center text-sm text-gray-700 mb-2">
          <i class="fas fa-map-marker-alt text-gray-500 mr-2"></i>
          <span>${cls.room}</span>
        </div>
        <div class="flex items-center text-sm text-gray-700">
          <i class="fas fa-users text-gray-500 mr-2"></i>
          <span>${cls.enrolledStudents} students enrolled</span>
        </div>
        <div class="mt-3 pt-3 border-t border-gray-200 flex justify-between">
          <div class="flex space-x-3">
            <button class="text-blue-600 text-sm font-medium flex items-center hover:text-blue-800" onclick="window.location.href='index.html'">
              <i class="fas fa-clipboard-check mr-1"></i> Mark Attendance
            </button>
            <button class="text-blue-600 text-sm font-medium flex items-center hover:text-blue-800 upload-marks-btn" data-class-id="${cls.id}">
              <i class="fas fa-upload mr-1"></i> Upload Marks
            </button>
          </div>
          <button class="text-red-600 text-sm font-medium flex items-center hover:text-red-800 delete-class-btn" data-class-id="${cls.id}">
            <i class="fas fa-trash-alt mr-1"></i> Delete
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Check if a class is currently in progress
function isClassInProgress(cls) {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // Get class start and end times
  const [startHour, startMinute] = cls.time.split(':').map(Number);
  const [endHour, endMinute] = cls.endTime.split(':').map(Number);
  
  // Convert times to minutes for easier comparison
  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  const startTimeInMinutes = startHour * 60 + startMinute;
  const endTimeInMinutes = endHour * 60 + endMinute;
  
  // Check if current time is between start and end times
  return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes;
}

// Attach event listener for deleting a class
function setupClassDeletion() {
  document.addEventListener('click', function(event) {
    if (event.target.closest('.delete-class-btn')) {
      const button = event.target.closest('.delete-class-btn');
      const classId = button.getAttribute('data-class-id');
      
      // Ask for confirmation before deleting
      if (confirm('Are you sure you want to delete this class?')) {
        // Delete the class
        const updatedClasses = deleteClass(classId);
        
        // Remove the class card from the DOM
        const card = document.getElementById(`class-card-${classId}`);
        if (card) {
          card.remove();
        }
        
        // Check if there are no more classes
        const todayClassesGrid = document.querySelector('#todayClasses .grid');
        if (todayClassesGrid && todayClassesGrid.children.length === 0) {
          todayClassesGrid.innerHTML = `
            <div class="col-span-2 text-center py-6 text-gray-500">
              <p>No classes scheduled for today.</p>
            </div>
          `;
        }
        
        // Refresh the weekly schedule
        const scheduleBody = document.querySelector('#weeklySchedule tbody');
        if (scheduleBody) {
          scheduleBody.innerHTML = renderWeeklySchedule(updatedClasses);
        }
      }
    }
  });
}

// Set up marks upload modal functionality
function setupMarksUpload() {
  document.addEventListener('click', function(event) {
    if (event.target.closest('.upload-marks-btn')) {
      const button = event.target.closest('.upload-marks-btn');
      const classId = button.getAttribute('data-class-id');
      const classData = getClassById(classId);
      
      // Show the marks upload modal
      const marksModal = document.getElementById('marksUploadModal');
      if (marksModal) {
        // Set the class name in the modal
        const classNameElement = document.getElementById('marksModalClassName');
        if (classNameElement && classData) {
          classNameElement.textContent = classData.name;
        }
        
        // Set the class ID as data attribute for the form
        const marksForm = document.getElementById('marksUploadForm');
        if (marksForm) {
          marksForm.setAttribute('data-class-id', classId);
        }
        
        // Show the modal
        marksModal.classList.remove('hidden');
      }
    }
  });
}

// Render weekly schedule
function renderWeeklySchedule(classes) {
  // Create a mapping of day and time to classes
  const scheduleMap = {};
  
  // Initialize the schedule map with empty arrays for each day and time
  const timeSlots = ['08:00', '10:00', '12:00', '14:00', '16:00'];
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  
  timeSlots.forEach(time => {
    scheduleMap[time] = {};
    days.forEach(day => {
      scheduleMap[time][day] = null;
    });
  });
  
  // Populate the schedule map with classes
  classes.forEach(cls => {
    const timeSlot = findClosestTimeSlot(cls.time, timeSlots);
    if (timeSlot && scheduleMap[timeSlot] && scheduleMap[timeSlot][cls.day]) {
      scheduleMap[timeSlot][cls.day] = cls;
    }
  });
  
  // Generate the HTML for the schedule
  let scheduleHtml = '';
  
  timeSlots.forEach(timeSlot => {
    let rowHtml = `
      <tr>
        <td class="border p-2 text-sm font-medium text-gray-900">${formatClassTime(timeSlot)}</td>
    `;
    
    days.forEach(day => {
      const cls = scheduleMap[timeSlot][day];
      if (cls) {
        const colorScheme = CLASS_COLORS[cls.subject] || CLASS_COLORS['machineLearning'];
        rowHtml += `
          <td class="border p-2 ${colorScheme.bg}">
            <div class="text-sm font-medium text-gray-900">${cls.name}</div>
            <div class="text-xs text-gray-500">${cls.room}</div>
            <div class="text-xs text-gray-500">${formatClassTime(cls.time)} - ${formatClassTime(cls.endTime)}</div>
            <div class="mt-1 flex justify-between">
              <button class="text-xs text-blue-600 hover:text-blue-800 upload-marks-btn" data-class-id="${cls.id}">
                Upload Marks
              </button>
              <button class="text-xs text-red-600 hover:text-red-800 delete-class-btn" data-class-id="${cls.id}">
                <i class="fas fa-times-circle"></i>
              </button>
            </div>
          </td>
        `;
      } else {
        rowHtml += `
          <td class="border p-2 text-center">
            <span class="text-xs text-gray-400">No Class</span>
          </td>
        `;
      }
    });
    
    rowHtml += `</tr>`;
    scheduleHtml += rowHtml;
  });
  
  return scheduleHtml;
}

// Find the closest time slot for a given time
function findClosestTimeSlot(time, timeSlots) {
  if (!time) return timeSlots[0];
  
  try {
    const [hours, minutes] = time.split(':').map(Number);
    const timeInMinutes = hours * 60 + minutes;
    
    // Find the closest time slot
    let closestSlot = timeSlots[0];
    let minDifference = Infinity;
    
    for (const slot of timeSlots) {
      const [slotHours, slotMinutes] = slot.split(':').map(Number);
      const slotInMinutes = slotHours * 60 + slotMinutes;
      
      const difference = Math.abs(timeInMinutes - slotInMinutes);
      
      if (difference < minDifference) {
        minDifference = difference;
        closestSlot = slot;
      }
    }
    
    return closestSlot;
  } catch (error) {
    console.error('Error finding closest time slot:', error);
    return timeSlots[0];
  }
}

// Export methods for use in other scripts
const classManager = {
  loadClasses,
  saveClasses,
  getClassById,
  addClass,
  deleteClass,
  renderTodayClasses,
  renderWeeklySchedule,
  setupClassDeletion,
  setupMarksUpload
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Setup event listeners for deleting classes
  setupClassDeletion();
  
  // Setup event listeners for marks upload
  setupMarksUpload();
}); 