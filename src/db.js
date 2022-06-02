import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAMt7zaCm-1ZXGZfPNHrLzf_gjGZvxGzao",
    authDomain: "fun-with-ai-5ec41.firebaseapp.com",
    projectId: "fun-with-ai-5ec41",
    storageBucket: "fun-with-ai-5ec41.appspot.com",
    messagingSenderId: "641580039332",
    appId: "1:641580039332:web:449b38c914628414f17a31"
  };

// initialize firebase app
const app = initializeApp(firebaseConfig)

// get the firestore db
const db = getFirestore(app)

export default db
