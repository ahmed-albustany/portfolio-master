import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage } from './config';

/**
 * Upload a file to Firebase Storage.
 * @param {File} file       — the File object from an <input>.
 * @param {string} path     — storage path, e.g. "projects/img.png".
 * @returns {string}        — the public download URL.
 */
export async function uploadFile(file, path) {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error(`[Storage] uploadFile("${path}") failed:`, error);
    throw error;
  }
}

/**
 * Delete a file from Firebase Storage by its full path.
 */
export async function deleteFile(path) {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error(`[Storage] deleteFile("${path}") failed:`, error);
    throw error;
  }
}
