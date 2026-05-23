import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

/* ================================================================
   GENERIC CRUD HELPERS
   ================================================================ */

export async function addDocument(col, data) {
  try {
    const ref = await addDoc(collection(db, col), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  } catch (error) {
    console.error(`[Firestore] add "${col}" failed:`, error);
    throw error;
  }
}

export async function getDocuments(col, orderField = 'createdAt') {
  try {
    const q = query(collection(db, col), orderBy(orderField, 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error(`[Firestore] get "${col}" failed:`, error);
    throw error;
  }
}

export async function getDocument(col, docId) {
  try {
    const ref = doc(db, col, docId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  } catch (error) {
    console.error(`[Firestore] get "${col}/${docId}" failed:`, error);
    throw error;
  }
}

export async function updateDocument(col, docId, data) {
  try {
    const ref = doc(db, col, docId);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error(`[Firestore] update "${col}/${docId}" failed:`, error);
    throw error;
  }
}

export async function removeDocument(col, docId) {
  try {
    await deleteDoc(doc(db, col, docId));
  } catch (error) {
    console.error(`[Firestore] delete "${col}/${docId}" failed:`, error);
    throw error;
  }
}

// Alias for backward compatibility
export { removeDocument as deleteDocument };

async function getSingleton(col, docId = 'main') {
  try {
    const ref = doc(db, col, docId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  } catch (error) {
    console.error(`[Firestore] getSingleton "${col}" failed:`, error);
    throw error;
  }
}

async function updateSingleton(col, data, docId = 'main') {
  try {
    const ref = doc(db, col, docId);
    await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
  } catch (error) {
    console.error(`[Firestore] updateSingleton "${col}" failed:`, error);
    throw error;
  }
}

/* ================================================================
   PERSONAL INFO (singleton: personalInfo/main)
   ================================================================ */

export async function getPersonalInfo() {
  return getSingleton('personalInfo');
}

export async function updatePersonalInfo(data) {
  return updateSingleton('personalInfo', data);
}

/* ================================================================
   STATS (singleton: stats/main)
   ================================================================ */

export async function getStats() {
  return getSingleton('stats');
}

export async function updateStats(data) {
  return updateSingleton('stats', data);
}

/* ================================================================
   PROJECTS
   ================================================================ */

export async function getProjects() {
  return getDocuments('projects');
}

export async function getProject(id) {
  return getDocument('projects', id);
}

export async function addProject(data) {
  return addDocument('projects', data);
}

export async function updateProject(id, data) {
  return updateDocument('projects', id, data);
}

export async function deleteProject(id) {
  return removeDocument('projects', id);
}

/* ================================================================
   EXPERIENCE
   ================================================================ */

export async function getExperience() {
  return getDocuments('experience');
}

export async function addExperience(data) {
  return addDocument('experience', data);
}

export async function updateExperience(id, data) {
  return updateDocument('experience', id, data);
}

export async function deleteExperience(id) {
  return removeDocument('experience', id);
}

/* ================================================================
   SKILLS
   ================================================================ */

export async function getSkills() {
  return getDocuments('skills');
}

export async function addSkill(data) {
  return addDocument('skills', data);
}

export async function updateSkill(id, data) {
  return updateDocument('skills', id, data);
}

export async function deleteSkill(id) {
  return removeDocument('skills', id);
}

/* ================================================================
   SYSADMIN
   ================================================================ */

export async function getSysAdmin() {
  return getDocuments('sysadmin');
}

export async function addSysAdmin(data) {
  return addDocument('sysadmin', data);
}

export async function updateSysAdmin(id, data) {
  return updateDocument('sysadmin', id, data);
}

export async function deleteSysAdmin(id) {
  return removeDocument('sysadmin', id);
}

/* ================================================================
   NETWORK
   ================================================================ */

export async function getNetwork() {
  return getDocuments('network');
}

export async function addNetwork(data) {
  return addDocument('network', data);
}

export async function updateNetwork(id, data) {
  return updateDocument('network', id, data);
}

export async function deleteNetwork(id) {
  return removeDocument('network', id);
}

/* ================================================================
   DATABASE
   ================================================================ */

export async function getDatabase() {
  return getDocuments('database');
}

export async function addDatabase(data) {
  return addDocument('database', data);
}

export async function updateDatabase(id, data) {
  return updateDocument('database', id, data);
}

export async function deleteDatabase(id) {
  return removeDocument('database', id);
}

/* ================================================================
   SECURITY
   ================================================================ */

export async function getSecurity() {
  return getDocuments('security');
}

export async function addSecurity(data) {
  return addDocument('security', data);
}

export async function updateSecurity(id, data) {
  return updateDocument('security', id, data);
}

export async function deleteSecurity(id) {
  return removeDocument('security', id);
}

/* ================================================================
   HELPDESK
   ================================================================ */

export async function getHelpdesk() {
  return getDocuments('helpdesk');
}

export async function addHelpdesk(data) {
  return addDocument('helpdesk', data);
}

export async function updateHelpdesk(id, data) {
  return updateDocument('helpdesk', id, data);
}

export async function deleteHelpdesk(id) {
  return removeDocument('helpdesk', id);
}

/* ================================================================
   CERTIFICATIONS
   ================================================================ */

export async function getCertifications() {
  return getDocuments('certifications', 'date');
}

export async function addCertification(data) {
  return addDocument('certifications', data);
}

export async function updateCertification(id, data) {
  return updateDocument('certifications', id, data);
}

export async function deleteCertification(id) {
  return removeDocument('certifications', id);
}

/* ================================================================
   MESSAGES
   ================================================================ */

export async function getMessages() {
  return getDocuments('messages');
}

export async function saveMessage({ name, email, subject, message }) {
  try {
    const ref = await addDoc(collection(db, 'messages'), {
      name,
      email,
      subject,
      message,
      read: false,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  } catch (error) {
    console.error('[Firestore] saveMessage failed:', error);
    throw error;
  }
}

export async function markAsRead(id) {
  return updateDocument('messages', id, { read: true });
}

export async function deleteMessage(id) {
  return removeDocument('messages', id);
}
