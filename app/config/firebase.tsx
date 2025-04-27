import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: "AIzaSyACU4WwtrD0LbdFg57-MKmLHFPkKLZf-pk",
    authDomain: "rubberroom-4406e.firebaseapp.com",
    projectId: "rubberroom-4406e",
    storageBucket: "rubberroom-4406e.appspot.com",
    messagingSenderId: "438651220872",
    appId: "1:438651220872:web:b038a8159b2c449fef403d",
    measurementId: "G-4LHLBM7MLF"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
// export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;