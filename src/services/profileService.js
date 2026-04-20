import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase'

const localProfileKey = (uid) => `algolens_profile_${uid}`

export async function getUserProfile(uid) {
  if (!uid) return null

  if (!isFirebaseConfigured || !db) {
    const raw = localStorage.getItem(localProfileKey(uid))
    return raw ? JSON.parse(raw) : null
  }

  const snapshot = await getDoc(doc(db, 'users', uid))
  return snapshot.exists() ? snapshot.data() : null
}

export async function upsertUserProfile(uid, profile) {
  if (!uid) return

  if (!isFirebaseConfigured || !db) {
    localStorage.setItem(localProfileKey(uid), JSON.stringify(profile))
    return
  }

  await setDoc(doc(db, 'users', uid), profile, { merge: true })
}
