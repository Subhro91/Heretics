// events.js - Shared event management functionality for teacher and student dashboards
// This file handles the loading, saving, and manipulation of event data

// Event type icons mapping
const EVENT_ICONS = {
  'exam': 'fa-clipboard-list',
  'meeting': 'fa-users',
  'activity': 'fa-gamepad',
  'cultural': 'fa-music'
};

// Event type background colors
const EVENT_COLORS = {
  'exam': {
    bg: 'bg-red-50',
    border: 'border-red-100',
    icon: 'bg-red-100 text-red-600'
  },
  'meeting': {
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    icon: 'bg-blue-100 text-blue-600'
  },
  'activity': {
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    icon: 'bg-purple-100 text-purple-600'
  },
  'cultural': {
    bg: 'bg-green-50',
    border: 'border-green-100',
    icon: 'bg-green-100 text-green-600'
  }
};

// Default events if none exist in storage
const DEFAULT_EVENTS = [
  {
    id: 'evt1',
    title: 'Mathematics Final Exam',
    type: 'exam',
    date: '2023-05-15',
    time: '10:00',
    location: 'Room 101, Engineering Building',
    organizer: 'Prof. Johnson',
    class: 'Mathematics 101 - 28 students',
    description: 'End-of-semester comprehensive exam covering all topics from the course syllabus.',
    notes: 'Bring scientific calculator and student ID'
  },
  {
    id: 'evt2',
    title: 'Department Meeting',
    type: 'meeting',
    date: '2023-05-10',
    time: '13:30',
    location: 'Faculty Lounge, Admin Building',
    organizer: 'Dr. Thompson, Department Chair',
    class: 'Faculty Only',
    description: 'Monthly department meeting to discuss curriculum updates and upcoming events.',
    notes: ''
  },
  {
    id: 'evt3',
    title: 'CS Field Trip: Tech Expo',
    type: 'activity',
    date: '2023-05-18',
    time: '09:00',
    location: 'Downtown Convention Center',
    organizer: '',
    class: 'Computer Science 202 - 24 students',
    description: 'Field trip to annual technology expo. Students will explore industry innovations and network with professionals.',
    notes: ''
  },
  {
    id: 'evt4',
    title: 'Physics Midterm Exam',
    type: 'exam',
    date: '2023-05-12',
    time: '14:00',
    location: 'Physics Lab, Science Building',
    organizer: '',
    class: 'Physics 303 - 19 students',
    description: 'Midterm exam covering mechanics, thermodynamics, and basic wave theory.',
    notes: ''
  },
  {
    id: 'evt5',
    title: 'Texibition 2025',
    type: 'cultural',
    date: '2025-05-01',
    time: 'All Day',
    location: 'Brainware University Campus',
    organizer: 'University Management',
    class: 'All Departments',
    description: 'Annual technology exhibition showcasing student projects and innovations from all departments.',
    notes: 'Open to all students and faculty'
  },
  {
    id: 'evt6',
    title: 'Anandadhara 2K25',
    type: 'cultural',
    date: '2025-05-17',
    endDate: '2025-05-18',
    time: '10:00',
    endTime: '20:00',
    location: 'Kachari Ground',
    organizer: 'Cultural Committee',
    class: 'All Students',
    description: 'Annual cultural fest featuring music performances, dance competitions, art exhibitions, and food stalls.',
    notes: 'Registration required for performances'
  }
];

// Load events from storage or use defaults
function loadEvents() {
  const storedEvents = sessionStorage.getItem('schoolEvents');
  if (storedEvents) {
    return JSON.parse(storedEvents);
  } else {
    // No stored events, use defaults
    saveEvents(DEFAULT_EVENTS);
    return DEFAULT_EVENTS;
  }
}

// Save events to session storage
function saveEvents(events) {
  sessionStorage.setItem('schoolEvents', JSON.stringify(events));
}

// Get a single event by ID
function getEventById(eventId) {
  const events = loadEvents();
  return events.find(event => event.id === eventId);
}

// Add a new event
function addEvent(eventData) {
  const events = loadEvents();
  
  // Generate a random ID
  const newId = 'evt' + Date.now().toString();
  
  // Add the new event with the generated ID
  const newEvent = {
    id: newId,
    ...eventData
  };
  
  events.push(newEvent);
  saveEvents(events);
  
  return newEvent;
}

// Update an existing event
function updateEvent(eventId, updatedData) {
  const events = loadEvents();
  const index = events.findIndex(event => event.id === eventId);
  
  if (index !== -1) {
    // Update the event with new data
    events[index] = {
      ...events[index],
      ...updatedData
    };
    
    saveEvents(events);
    return events[index];
  }
  
  return null; // Event not found
}

// Delete an event
function deleteEvent(eventId) {
  const events = loadEvents();
  const filteredEvents = events.filter(event => event.id !== eventId);
  
  if (filteredEvents.length < events.length) {
    saveEvents(filteredEvents);
    return true;
  }
  
  return false; // Event not found
}

// Format date for display (May 15, 2023)
function formatEventDate(dateStr, endDateStr = null) {
  const date = new Date(dateStr);
  
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  let formatted = date.toLocaleDateString('en-US', options);
  
  if (endDateStr) {
    const endDate = new Date(endDateStr);
    const endDay = endDate.getDate();
    const sameMonth = date.getMonth() === endDate.getMonth();
    const sameYear = date.getFullYear() === endDate.getFullYear();
    
    if (sameMonth && sameYear) {
      // Format as "May 17-18, 2023"
      const monthName = date.toLocaleDateString('en-US', { month: 'long' });
      formatted = `${monthName} ${date.getDate()}-${endDay}, ${date.getFullYear()}`;
    } else {
      // Different months or years
      formatted = `${formatted} - ${endDate.toLocaleDateString('en-US', options)}`;
    }
  }
  
  return formatted;
}

// Helper to create calendar events data for flatpickr
function createCalendarEvents(events) {
  return events.map(event => {
    // For multi-day events
    if (event.endDate) {
      const dates = [];
      const startDate = new Date(event.date);
      const endDate = new Date(event.endDate);
      
      // Generate dates for every day in the range
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        dates.push({
          date: d.toISOString().split('T')[0],
          title: event.title
        });
      }
      
      return dates;
    }
    
    return {
      date: event.date,
      title: event.title
    };
  }).flat(); // Flatten for multi-day events
}

// Get events as HTML cards for the teacher dashboard (with edit/delete buttons)
function renderTeacherEventCards(events) {
  return events.map(event => {
    const colorScheme = EVENT_COLORS[event.type] || EVENT_COLORS['activity'];
    const icon = EVENT_ICONS[event.type] || 'fa-calendar-alt';
    
    // Format date display
    let dateDisplay = formatEventDate(event.date, event.endDate);
    if (event.time) {
      const timeDisplay = event.endTime ? 
        `${event.time} - ${event.endTime}` : 
        event.time;
      dateDisplay += ` • ${timeDisplay}`;
    }
    
    return `
      <div class="bg-white rounded-lg shadow-sm overflow-hidden" data-event-id="${event.id}">
        <div class="${colorScheme.bg} px-4 py-3 border-b ${colorScheme.border}">
          <div class="flex items-center">
            <div class="${colorScheme.icon.split(' ')[0]} p-2 rounded-full">
              <i class="fas ${icon} ${colorScheme.icon.split(' ')[1]}"></i>
            </div>
            <h2 class="ml-3 text-lg font-semibold text-gray-800">${event.title}</h2>
          </div>
        </div>
        <div class="p-4">
          <div class="flex items-center mb-3 text-sm">
            <i class="fas fa-calendar-day text-gray-500 mr-2"></i>
            <span>${dateDisplay}</span>
          </div>
          <div class="flex items-center mb-3 text-sm">
            <i class="fas fa-map-marker-alt text-gray-500 mr-2"></i>
            <span>${event.location}</span>
          </div>
          ${event.class ? `
          <div class="flex items-center mb-3 text-sm">
            <i class="fas fa-users text-gray-500 mr-2"></i>
            <span>${event.class}</span>
          </div>
          ` : ''}
          ${event.organizer ? `
          <div class="flex items-center mb-3 text-sm">
            <i class="fas fa-user-tie text-gray-500 mr-2"></i>
            <span>${event.organizer}</span>
          </div>
          ` : ''}
          <p class="text-gray-600 text-sm mb-4">
            ${event.description}
          </p>
          ${event.notes ? `
          <div class="bg-yellow-50 p-3 rounded-md text-sm mb-4">
            <i class="fas fa-exclamation-circle text-yellow-600 mr-2"></i>
            <span class="text-yellow-700">${event.notes}</span>
          </div>
          ` : ''}
          <div class="flex mt-4 space-x-3">
            <button class="edit-event-btn text-blue-600 text-sm font-medium flex items-center hover:text-blue-800" data-event-id="${event.id}">
              <i class="fas fa-edit mr-1"></i> Edit
            </button>
            <button class="delete-event-btn text-red-600 text-sm font-medium flex items-center hover:text-red-800" data-event-id="${event.id}">
              <i class="fas fa-trash-alt mr-1"></i> Delete
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Get events as HTML cards for the student dashboard (without edit/delete buttons)
function renderStudentEventCards(events) {
  return events.map(event => {
    const colorScheme = EVENT_COLORS[event.type] || EVENT_COLORS['activity'];
    const icon = EVENT_ICONS[event.type] || 'fa-calendar-alt';
    
    // Format date display
    let dateDisplay = formatEventDate(event.date, event.endDate);
    if (event.time) {
      const timeDisplay = event.endTime ? 
        `${event.time} - ${event.endTime}` : 
        event.time;
      dateDisplay += ` • ${timeDisplay}`;
    }
    
    // Set data attribute for filtering
    const dataType = `data-event-type="${event.type}"`;
    
    return `
      <div class="bg-white rounded-lg shadow-sm overflow-hidden" ${dataType} data-event-id="${event.id}">
        <div class="${colorScheme.bg} px-4 py-3 border-b ${colorScheme.border}">
          <div class="flex items-center">
            <div class="${colorScheme.icon.split(' ')[0]} p-2 rounded-full">
              <i class="fas ${icon} ${colorScheme.icon.split(' ')[1]}"></i>
            </div>
            <h2 class="ml-3 text-lg font-semibold text-gray-800">${event.title}</h2>
          </div>
        </div>
        <div class="p-4">
          <div class="flex items-center mb-3 text-sm">
            <i class="fas fa-calendar-day text-gray-500 mr-2"></i>
            <span>${dateDisplay}</span>
          </div>
          <div class="flex items-center mb-3 text-sm">
            <i class="fas fa-map-marker-alt text-gray-500 mr-2"></i>
            <span>${event.location}</span>
          </div>
          ${event.organizer ? `
          <div class="flex items-center mb-4 text-sm">
            <i class="fas fa-user-tie text-gray-500 mr-2"></i>
            <span>${event.organizer}</span>
          </div>
          ` : ''}
          <p class="text-gray-600 text-sm mb-4">
            ${event.description}
          </p>
          ${event.notes ? `
          <div class="bg-yellow-50 p-3 rounded-md text-sm">
            <i class="fas fa-exclamation-circle text-yellow-600 mr-2"></i>
            <span class="text-yellow-700">${event.notes}</span>
          </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

// Populate edit form with event data
function populateEventForm(event) {
  document.getElementById('eventTitle').value = event.title || '';
  document.getElementById('eventType').value = event.type || 'activity';
  document.getElementById('eventDate').value = event.date || '';
  document.getElementById('eventTime').value = event.time || '';
  
  if (document.getElementById('eventEndDate')) {
    document.getElementById('eventEndDate').value = event.endDate || '';
  }
  
  if (document.getElementById('eventEndTime')) {
    document.getElementById('eventEndTime').value = event.endTime || '';
  }
  
  document.getElementById('eventLocation').value = event.location || '';
  
  if (document.getElementById('eventOrganizer')) {
    document.getElementById('eventOrganizer').value = event.organizer || '';
  }
  
  document.getElementById('eventClass').value = event.class || '';
  document.getElementById('eventDescription').value = event.description || '';
  
  if (document.getElementById('eventNotes')) {
    document.getElementById('eventNotes').value = event.notes || '';
  }
  
  // Set form mode (add or edit)
  document.getElementById('eventForm').setAttribute('data-mode', event.id ? 'edit' : 'add');
  document.getElementById('eventForm').setAttribute('data-event-id', event.id || '');
}

// Clear event form
function clearEventForm() {
  document.getElementById('eventForm').reset();
  document.getElementById('eventForm').setAttribute('data-mode', 'add');
  document.getElementById('eventForm').setAttribute('data-event-id', '');
}

// Set up save button to trigger form submission
document.addEventListener('DOMContentLoaded', function() {
  const saveModalBtn = document.getElementById('saveModalBtn');
  if (saveModalBtn) {
    saveModalBtn.addEventListener('click', function() {
      const eventForm = document.getElementById('eventForm');
      if (eventForm) {
        // Trigger form submission
        const submitEvent = new Event('submit', { cancelable: true });
        eventForm.dispatchEvent(submitEvent);
      }
    });
  }
});

// Export the functions for use in other files
window.eventManager = {
  loadEvents,
  saveEvents,
  getEventById,
  addEvent,
  updateEvent,
  deleteEvent,
  renderTeacherEventCards,
  renderStudentEventCards,
  createCalendarEvents,
  populateEventForm,
  clearEventForm,
  EVENT_COLORS,
  EVENT_ICONS
}; 