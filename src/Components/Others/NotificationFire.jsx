import React, { useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import axios from 'axios';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

function NotificationFire({user}) {

    useEffect(() => {
        const requestPermissionAndGetToken = async () => {
            try {
                // 1. Request browser permission
                const permission = await Notification.requestPermission();
                console.log(permission);
                if (permission === 'granted') {
                    // 2. Get the FCM Token
                    // Replace 'YOUR_VAPID_KEY_HERE' with the key from Firebase Console
                    const currentToken = await getToken(messaging, { 
                        vapidKey: process.env.REACT_APP_FIREBASE_KEY_PAIR
                    });

                    if (currentToken) {
                        console.log("Device Token:", currentToken);
                        /*
                        // 3. POST the data to your backend
                        await axios.post('https://your-api-endpoint.com/save-token', {
                            userId: user._id,
                            name: user.name,
                            surname: user.surname,
                            phoneNumber: user.phonenumber,
                            token: currentToken
                        });
                        */
                        console.log("Token successfully sent to server");
                    } else {
                        console.log('No registration token available. Request permission to generate one.');
                    }
                } else {
                    console.log('Unable to get permission to notify.');
                }
            } catch (err) {
                console.error('An error occurred while retrieving token:', err);
            }
        };

        if (user?._id) {
            requestPermissionAndGetToken();
        }
    }, [user]);
    //once app is initialized then get request permission then get Token
 
   ///GET TOKEN
   /*
   Post user._id, user.name, user.surname, user.phonenumber, token
   */
  return (
    <div>NotificationFire</div>
  )
}

export default NotificationFire