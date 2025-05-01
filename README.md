# Brainware University Dashboard

A comprehensive educational management platform developed for Brainware University during a hackathon. This intuitive dashboard helps professors track student attendance while providing students with a clear view of their academic engagement.

## 🌟 What Makes This Special

This dashboard brings the traditional attendance system into the digital age, making it easier for both professors and students to manage and track attendance. With a sleek, modern interface and real-time updates, it's designed to enhance the educational experience at Brainware University.

## ✨ Key Features

### For Professors:
- **Streamlined Attendance Management**: Mark attendance with just a few clicks
- **Quick Actions**: Mark all students present with a single button
- **Insightful Analytics**: Track attendance patterns and identify trends
- **Course Management**: Organize students by subject and class

### For Students:
- **Personal Attendance Tracker**: Monitor your attendance in real-time
- **Visual Statistics**: View your attendance rates with intuitive visualizations
- **Class Schedule**: Keep track of upcoming classes
- **Direct Communication**: Open tickets to communicate with professors

### General Features:
- **Real-time Updates**: Changes reflect instantly across all devices
- **Secure Authentication**: Role-based access for professors and students
- **Responsive Design**: Works beautifully on any device

## 🛠️ Technology Stack

- **Frontend**: HTML, CSS (with Tailwind CSS for a responsive, modern UI)
- **Functionality**: JavaScript (Vanilla JS for lightweight, fast performance)
- **Backend & Database**: Firebase (Authentication, Firestore for real-time data)
- **Visualizations**: Chart.js (for clear, interactive analytics)
- **Deployment**: Vercel (for seamless hosting)

## 🚀 Getting Started

### Prerequisites
- A Firebase account for database and authentication services

### Quick Setup
1. Clone this repository to your local machine
2. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
3. Enable Email/Password authentication
4. Set up Firestore with these collections: `users`, `classes`, `attendance`
5. Update the Firebase configuration in `public/js/firebase-init.js`
6. Deploy to Vercel or any other static site hosting platform

## 💡 Hackathon Context

This project was developed as part of a hackathon challenge to modernize university systems. We aimed to create a solution that addresses real needs of educational institutions while providing an exceptional user experience for both faculty and students.

## 📃 License

MIT License 