// For hackathon demo: Check if we're in a page that needs authentication
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const isAuthPage = currentPage === 'login.html' || currentPage === 'register.html' || currentPage === '';

// Only check auth status on non-auth pages
if (!isAuthPage) {
  // Try to get user from session storage
  const storedUser = sessionStorage.getItem('currentUser');

  // If no user in session storage and not on login page, redirect to login
  if (!storedUser) {
    window.location.replace('login.html');
  }
}

// Authentication state observer - only run on non-auth pages
if (!isAuthPage) {
  firebase.auth().onAuthStateChanged(async (user) => {
    // If already authenticated via session storage, don't process further
    if (sessionStorage.getItem('currentUser')) {
      return;
    }
    
    if (user) {
      // User is signed in
      try {
        // Get user document from Firestore
        const userDoc = await db.collection('users').doc(user.uid).get();
        
        if (userDoc.exists) {
          const userData = userDoc.data();
          const userRole = userData.role;
          
          // Determine which page the user should be on
          
          if (userRole === 'teacher') {
            // Teacher should be on index.html or analytics.html
            if (currentPage === 'student.html') {
              window.location.replace('index.html'); // Redirect to teacher dashboard
            }
          } else if (userRole === 'student') {
            // Student should be on student.html
            if (currentPage === 'index.html' || currentPage === 'analytics.html') {
              window.location.replace('student.html'); // Redirect to student dashboard
            }
          }
          
          // Store user data in session storage for easy access
          sessionStorage.setItem('currentUser', JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: userData.displayName || user.displayName,
            role: userRole,
            classId: userData.classId // For students
          }));
          
        } else {
          // For hackathon: Don't sign out if user doc doesn't exist, create mock data instead
          const mockUserData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0],
            role: currentPage === 'student.html' ? 'student' : 'teacher',
            classId: 'class1'
          };
          
          // Store mock user data in session storage
          sessionStorage.setItem('currentUser', JSON.stringify(mockUserData));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // For hackathon: Create mock user data on error
        const mockUserData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0],
          role: currentPage === 'student.html' ? 'student' : 'teacher',
          classId: 'class1'
        };
        
        // Store mock user data in session storage
        sessionStorage.setItem('currentUser', JSON.stringify(mockUserData));
      }
    } else {
      // User is signed out, redirect to login page
      window.location.replace('login.html');
    }
  });
}

// Logout functionality
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    // Clear session storage
    sessionStorage.removeItem('currentUser');
    
    // Sign out from Firebase
    firebase.auth().signOut()
      .then(() => {
        // Sign-out successful, redirect to login page
        window.location.href = 'login.html';
      })
      .catch((error) => {
        // An error happened
        console.error('Logout error:', error);
        // Still redirect to login page
        window.location.href = 'login.html';
      });
  });
} 