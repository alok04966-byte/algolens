import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase'

const localKey = (uid) => `algolens_progress_${uid}`

const readLocalItems = (uid) => {
  const raw = localStorage.getItem(localKey(uid))
  return raw ? JSON.parse(raw) : []
}

const writeLocalItems = (uid, items) => {
  localStorage.setItem(localKey(uid), JSON.stringify(items))
}

export async function listProgressItems(uid) {
  if (!uid) return []
  if (!isFirebaseConfigured || !db) {
    return readLocalItems(uid)
  }

  const itemsRef = collection(db, 'users', uid, 'progressItems')
  const snapshot = await getDocs(query(itemsRef, orderBy('createdAt', 'desc')))
  return snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }))
}

export async function createProgressItem(uid, payload) {
  if (!uid) throw new Error('A signed-in user is required.')
  if (!isFirebaseConfigured || !db) {
    const nextItem = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      ...payload,
    }
    const existing = readLocalItems(uid)
    writeLocalItems(uid, [nextItem, ...existing])
    return nextItem
  }

  const itemsRef = collection(db, 'users', uid, 'progressItems')
  const result = await addDoc(itemsRef, {
    ...payload,
    createdAt: serverTimestamp(),
  })
  return { id: result.id, ...payload }
}

export async function updateProgressItem(uid, id, payload) {
  if (!uid || !id) throw new Error('Invalid update request.')
  if (!isFirebaseConfigured || !db) {
    const existing = readLocalItems(uid)
    const updated = existing.map((item) => (item.id === id ? { ...item, ...payload } : item))
    writeLocalItems(uid, updated)
    return
  }

  await updateDoc(doc(db, 'users', uid, 'progressItems', id), payload)
}

export async function removeProgressItem(uid, id) {
  if (!uid || !id) throw new Error('Invalid delete request.')
  if (!isFirebaseConfigured || !db) {
    const existing = readLocalItems(uid)
    writeLocalItems(
      uid,
      existing.filter((item) => item.id !== id),
    )
    return
  }

  await deleteDoc(doc(db, 'users', uid, 'progressItems', id))
}
