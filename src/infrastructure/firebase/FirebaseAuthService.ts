import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export class FirebaseAuthService {
    private auth;

    constructor() {
        const firebaseConfig = {
            apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
            authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
            projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
            storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
            appId: import.meta.env.VITE_FIREBASE_APP_ID,
            measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
        };

        initializeApp(firebaseConfig);
        this.auth = getAuth(); // Lazy initialization
    }

    async register(email: string, password: string): Promise<string> {
        const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
        return userCredential.user.uid;
    }

    async login(email: string, password: string): Promise<string> {
        const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
        return userCredential.user.uid;
    }
}