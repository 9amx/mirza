import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from 'firebase/auth'

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgxvmEbl4aiKwlkrO69tp6nuzkqIXGzfw",
  authDomain: "quiet-coda-444015-f3.firebaseapp.com",
  projectId: "quiet-coda-444015-f3",
  storageBucket: "quiet-coda-444015-f3.firebasestorage.app",
  messagingSenderId: "256727924849",
  appId: "1:256727924849:web:9114b40220210d1f0edbd0",
  measurementId: "G-M3M8KPP18C"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication
export const auth = getAuth(app)

// Convert Firebase error codes to user-friendly messages
const getFirebaseErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    // Sign in errors
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please check your credentials and try again.'
    case 'auth/user-not-found':
      return 'No account found with this email address. Please sign up first.'
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.'
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.'
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.'
    case 'auth/user-unverified':
      return 'Please verify your email address before signing in. Check your inbox for a verification email.'
    
    // Sign up errors
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in instead.'
    case 'auth/weak-password':
      return 'Password is too weak. Please choose a stronger password (at least 6 characters).'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    
    // Password reset errors
    case 'auth/user-not-found':
      return 'No account found with this email address.'
    
    // General errors
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.'
    case 'auth/operation-not-allowed':
      return 'This operation is not allowed. Please contact support.'
    case 'auth/requires-recent-login':
      return 'Please sign in again to complete this action.'
    
    default:
      return 'An error occurred. Please try again.'
  }
}

// Authentication functions
export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    
    // Send email verification
    await sendEmailVerification(userCredential.user)
    
    return { user: userCredential.user, error: null }
  } catch (error: any) {
    const errorMessage = getFirebaseErrorMessage(error.code)
    return { user: null, error: errorMessage }
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    
    // Check if email is verified
    if (!userCredential.user.emailVerified) {
      await signOut(auth)
      return { user: null, error: 'Please verify your email address before signing in. Check your inbox for a verification email.' }
    }
    
    return { user: userCredential.user, error: null }
  } catch (error: any) {
    const errorMessage = getFirebaseErrorMessage(error.code)
    return { user: null, error: errorMessage }
  }
}

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email)
    return { error: null }
  } catch (error: any) {
    const errorMessage = getFirebaseErrorMessage(error.code)
    return { error: errorMessage }
  }
}

export const logout = async () => {
  try {
    await signOut(auth)
    return { error: null }
  } catch (error: any) {
    const errorMessage = getFirebaseErrorMessage(error.code)
    return { error: errorMessage }
  }
}

// Google Authentication
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)
    
    // For Google sign-in, we don't need to check email verification
    // as Google accounts are typically already verified
    return { user: userCredential.user, error: null }
  } catch (error: any) {
    const errorMessage = getFirebaseErrorMessage(error.code)
    return { user: null, error: errorMessage }
  }
}

// Auth state listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}

// Email verification functions
export const sendVerificationEmail = async (user: User) => {
  try {
    await sendEmailVerification(user)
    return { error: null }
  } catch (error: any) {
    const errorMessage = getFirebaseErrorMessage(error.code)
    return { error: errorMessage }
  }
}

export const isEmailVerified = (user: User | null): boolean => {
  return user?.emailVerified || false
}

export default app
