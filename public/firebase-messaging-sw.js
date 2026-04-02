// Give the service worker access to Firebase Messaging.
// Note: These versions should match the version of Firebase you are using in your app.
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in your app's config.
// Since this is in the public folder, you'll need to paste your actual values here:
firebase.initializeApp({
    apiKey: "AIzaSyA5GiyDldhC7EmWKePop6gKEWm26iWRfdg",
    authDomain:"meventrsvpx1.firebaseapp.com",
    projectId: "meventrsvpx1",
    storageBucket: "meventrsvpx1.firebasestorage.app",
    messagingSenderId:"1098575806194",
    appId: "1:1098575806194:web:02d2d58261900a42609a6b",
    measurementId: "G-YSS5E2KGXY"
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

// This is the background handler
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
/*
I want to see if it trigger
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png',
    data: { url: 'https://main.d22k7gv86r3tav.amplifyapp.com/' }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
  */
});