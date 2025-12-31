import { auth } from './config';
import { signInWithEmailAndPassword, signOut as firebaseSignOut, createUserWithEmailAndPassword } from 'firebase/auth';
import Cookies from 'js-cookie';

const COOKIE_NAME = 'firebase-auth-session';

const COOKIE_OPTIONS = {
  expires: 7,
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    const token = await userCredential.user.getIdToken();
    
    Cookies.set(COOKIE_NAME, 'authenticated', COOKIE_OPTIONS);
    
    return userCredential;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    Cookies.remove(COOKIE_NAME, { path: '/' });
    
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const createUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    console.error('User creation error:', error);
    throw error;
  }
}; 