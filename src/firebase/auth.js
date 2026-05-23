import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from './config';

/**
 * Sign in with email + password.
 * Returns the Firebase user object on success.
 */
export async function loginAdmin(email, password) {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  } catch (error) {
    console.error('[Auth] loginAdmin() failed:', error);
    throw error;
  }
}

/**
 * Sign out the current user.
 */
export async function logoutAdmin() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('[Auth] logoutAdmin() failed:', error);
    throw error;
  }
}

/**
 * Subscribe to auth-state changes.
 * Returns an unsubscribe function.
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}
