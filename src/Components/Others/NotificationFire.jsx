import React, { useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage} from "firebase/messaging";
import axios from 'axios';
import { useSelector } from 'react-redux';
import * as CONSTANTS from "../../CONSTANTS";
import { toast } from 'react-toastify';

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

function NotificationFire() {

    const {user}                                                    = useSelector((state) => state.auth);
    const [getNotifies, setGetNotifies]                             = useState(false);

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
                            
                        // 3. POST the data to your backend
                        await axios.put(CONSTANTS.API_URL +'users/update/app/token/info/v1', {
                            userId: user._id,
                            token: currentToken
                        });
                        
                        console.log("Token successfully sent to server");
                        setGetNotifies(true);
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

     
        if (user?._id && user?.token === "") {
            requestPermissionAndGetToken();
        }

        
        ///////////////////////////////////////////////////////
        const unsubscribe = onMessage(messaging, (payload) => {
            console.log('Foreground message received: ', payload);
            if ("vibrate" in navigator) {
                // 2. Trigger vibration
                // [200, 100, 200] means: vibrate 200ms, pause 100ms, vibrate 200ms
                navigator.vibrate([200, 100, 200]);
            }
            // Trigger your toast library here
            toast.info(
                <div>
                    <strong>{payload.notification.title}</strong>
                    <p>{payload.notification.body}</p>
                </div>, 
                { position: "top-right", autoClose: 5000 }
            );
        });

        return () => unsubscribe();
        //////////////////////////////////////////////////////
    }, [user]);

  return (
    <div className='noty'>       
        {
            getNotifies && (<div className="p-4">
                                <div className="alert alert-success">
                                    Notification ready.
                                </div>
                            </div>)
        }
    </div>
  )
}

export default NotificationFire