// Global variables
let currentTeacher = null;
let selectedClassId = 'all';
let attendanceChart = null;

// Initialize the analytics dashboard
document.addEventListener('DOMContentLoaded', async () => {
  // Get current teacher data from session storage
  const userData = JSON.parse(sessionStorage.getItem('currentUser')) || { role: 'teacher', displayName: 'Teacher', uid: 'teacher123' };
  
  if (userData && userData.role === 'teacher') {
    currentTeacher = userData;
    
    // Initialize subject options
    initializeSubjectOptions();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load attendance data
    loadAttendanceData();
  }
});

// Initialize subject options
function initializeSubjectOptions() {
  // Populate the class filter dropdown
  const classFilter = document.getElementById('classFilter');
  if (classFilter) {
    classFilter.innerHTML = '';
    
    // Add "All Classes" option
    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'All Classes';
    classFilter.appendChild(allOption);
    
    // Add individual subject options - updated to match the subjects in the first image
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
      classFilter.appendChild(option);
    });
  }
}

// Set up event listeners
function setupEventListeners() {
  // Class filter change
  const classFilter = document.getElementById('classFilter');
  if (classFilter) {
    classFilter.addEventListener('change', () => {
      selectedClassId = classFilter.value;
      loadAttendanceData();
    });
  }
}

// Load attendance data from session storage
function loadAttendanceData() {
  // Try to get attendance history from session storage
  const attendanceHistory = JSON.parse(sessionStorage.getItem('attendance_history')) || [];
  
  if (attendanceHistory.length === 0) {
    // If no saved data, use mock data for demonstration
    generateMockAttendanceData();
    return;
  }
  
  // Filter by selected subject if not "all"
  let filteredHistory = [...attendanceHistory];
  if (selectedClassId !== 'all') {
    filteredHistory = attendanceHistory.filter(entry => entry.subject === selectedClassId);
  }
  
  // If no data for selected subject, show message
  if (filteredHistory.length === 0) {
    displayMessage('No attendance data found for the selected subject');
    renderAttendanceChart([], []);
    return;
  }
  
  // Sort by date (ascending)
  filteredHistory.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Prepare data for the chart
  const labels = [];
  const rates = [];
  
  filteredHistory.forEach(entry => {
    // Format date for display (Mon, Tue, etc.)
    const dateObj = new Date(entry.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    
    labels.push(formattedDate);
    rates.push(entry.rate);
  });
  
  // Render the chart with real data
  renderAttendanceChart(labels, rates);
}

// Generate mock attendance data for demonstration
function generateMockAttendanceData() {
  // Create mock attendance data
  const today = new Date();
  const labels = [];
  const rates = [];
  
  // Generate 14 days of data
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Format date for display (Mon, Tue, etc.)
    const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    // Generate a realistic attendance pattern - higher midweek, lower on Mon/Fri
    let baseRate = 78; // Base attendance rate
    
    // Weekend effect (lower attendance)
    if (date.getDay() === 0 || date.getDay() === 6) {
      baseRate -= 40; // Significantly lower on weekends
    } 
    // Monday effect (slightly lower)
    else if (date.getDay() === 1) {
      baseRate -= 10;
    } 
    // Friday effect (slightly lower)
    else if (date.getDay() === 5) {
      baseRate -= 8;
    }
    // Mid-week boost (slightly higher)
    else if (date.getDay() === 3) {
      baseRate += 5;
    }
    
    // Add some random variation (±8%)
    const randomVariation = Math.floor(Math.random() * 16) - 8;
    const rate = Math.min(Math.max(baseRate + randomVariation, 35), 98);
    
    labels.push(formattedDate);
    rates.push(rate);
  }
  
  // Save this mock data to session storage for future use
  const mockHistory = [];
  
  // Generate mock data for all subjects
  const subjects = [
    'mathematics', 'computerScience', 'physics', 'chemistry',
    'machineLearning', 'dataMining', 'softComputing', 
    'optimization', 'patternRecognition', 'computerVision'
  ];
  
  for (let i = 0; i < labels.length; i++) {
    const dateObj = new Date(today);
    dateObj.setDate(today.getDate() - (13 - i));
    
    // Generate an entry for each subject with slight variations
    subjects.forEach(subject => {
      // Add subject-specific variation (±5%)
      const subjectVariation = Math.floor(Math.random() * 10) - 5;
      const adjustedRate = Math.min(Math.max(rates[i] + subjectVariation, 30), 100);
      
      mockHistory.push({
        date: dateObj.toISOString().split('T')[0],
        subject: subject,
        rate: adjustedRate
      });
    });
  }
  
  sessionStorage.setItem('attendance_history', JSON.stringify(mockHistory));
  
  // Render the chart with mock data for the selected subject
  // If "all" is selected, show average across all subjects
  if (selectedClassId === 'all') {
    renderAttendanceChart(labels, rates);
  } else {
    // Filter mock data for the selected subject
    const subjectData = mockHistory.filter(entry => entry.subject === selectedClassId);
    const subjectLabels = [];
    const subjectRates = [];
    
    subjectData.forEach(entry => {
      const dateObj = new Date(entry.date);
      const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      
      subjectLabels.push(formattedDate);
      subjectRates.push(entry.rate);
    });
    
    renderAttendanceChart(subjectLabels, subjectRates);
  }
}

// Render the attendance chart
function renderAttendanceChart(labels, rates) {
  const chartCanvas = document.getElementById('attendanceChart');
  if (!chartCanvas) return;
  
  // Destroy previous chart if it exists
  if (attendanceChart) {
    attendanceChart.destroy();
  }
  
  // Create the chart context
  const ctx = chartCanvas.getContext('2d');
  
  // Create new chart
  attendanceChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Attendance Rate',
        data: rates,
        backgroundColor: 'rgba(59, 130, 246, 0.2)', // Light blue
        borderColor: 'rgba(59, 130, 246, 1)', // Blue
        borderWidth: 2,
        tension: 0.4, // Smooth curve
        fill: true,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
          min: 0, // Start at 0%
          max: 100, // End at 100%
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          },
          grid: {
            drawBorder: false
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            boxWidth: 15,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return 'Attendance Rate: ' + context.parsed.y + '%';
            }
          }
        }
      }
    }
  });
}

// Display a message to the user
function displayMessage(message) {
  // Check if message container exists
  let messageContainer = document.getElementById('messageContainer');
  
  // If not, create it
  if (!messageContainer) {
    messageContainer = document.createElement('div');
    messageContainer.id = 'messageContainer';
    messageContainer.className = 'mt-4 text-sm text-gray-700 text-center';
    
    // Find the chart container and insert after it
    const chartContainer = document.getElementById('attendanceChart').parentElement;
    if (chartContainer && chartContainer.parentElement) {
      chartContainer.parentElement.insertBefore(messageContainer, chartContainer.nextSibling);
    }
  }
  
  // Update message content
  messageContainer.textContent = message;
}

// Function to update attendance data (to be called when teachers mark attendance)
function updateAttendanceData(subject, date, attendanceRate) {
  // Get existing attendance history
  let attendanceHistory = JSON.parse(sessionStorage.getItem('attendance_history')) || [];
  
  // Find if there's an existing entry for this subject and date
  const existingIndex = attendanceHistory.findIndex(entry => 
    entry.subject === subject && entry.date === date
  );
  
  if (existingIndex >= 0) {
    // Update existing entry
    attendanceHistory[existingIndex].rate = attendanceRate;
  } else {
    // Add new entry
    attendanceHistory.push({
      subject: subject,
      date: date,
      rate: attendanceRate
    });
  }
  
  // Save updated history
  sessionStorage.setItem('attendance_history', JSON.stringify(attendanceHistory));
  
  // Reload chart data if we're viewing the affected subject
  if (selectedClassId === 'all' || selectedClassId === subject) {
    loadAttendanceData();
  }
}

// Export the update function so it can be called from other files
window.updateAttendanceData = updateAttendanceData; 