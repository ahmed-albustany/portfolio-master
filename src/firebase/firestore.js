import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

/* ================================================================
   GENERIC HELPERS
   ================================================================ */

export async function addDocument(collectionName, data) {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error(`[Firestore] addDocument("${collectionName}") failed:`, error);
    throw error;
  }
}

export async function getDocuments(collectionName, orderField = 'createdAt') {
  try {
    const q = query(
      collection(db, collectionName),
      orderBy(orderField, 'desc'),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error(`[Firestore] getDocuments("${collectionName}") failed:`, error);
    throw error;
  }
}

export async function getDocument(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() };
  } catch (error) {
    console.error(`[Firestore] getDocument("${collectionName}", "${docId}") failed:`, error);
    throw error;
  }
}

export async function updateDocument(collectionName, docId, data) {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error(`[Firestore] updateDocument("${collectionName}", "${docId}") failed:`, error);
    throw error;
  }
}

export async function deleteDocument(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`[Firestore] deleteDocument("${collectionName}", "${docId}") failed:`, error);
    throw error;
  }
}

/* ================================================================
   DOMAIN-SPECIFIC FUNCTIONS
   ================================================================ */

/**
 * Save a contact-form message to the "messages" collection.
 * Adds a `read: false` flag and timestamps automatically.
 */
export async function saveMessage({ name, email, subject, message }) {
  try {
    const id = await addDoc(collection(db, 'messages'), {
      name,
      email,
      subject,
      message,
      read: false,
      createdAt: serverTimestamp(),
    });
    return id.id;
  } catch (error) {
    console.error('[Firestore] saveMessage() failed:', error);
    throw error;
  }
}

/**
 * Fetch all projects, ordered by createdAt descending.
 */
export async function getProjects() {
  try {
    const q = query(
      collection(db, 'projects'),
      orderBy('createdAt', 'desc'),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('[Firestore] getProjects() failed:', error);
    throw error;
  }
}

/**
 * Fetch all certifications, ordered by date descending.
 */
export async function getCertificates() {
  try {
    const q = query(
      collection(db, 'certificates'),
      orderBy('date', 'desc'),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('[Firestore] getCertificates() failed:', error);
    throw error;
  }
}
