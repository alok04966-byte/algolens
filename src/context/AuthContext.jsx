import { useEffect, useMemo, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import Loader from '../components/Loader'
import { useMinimumLoaderDelay } from '../hooks/useMinimumLoaderDelay'
import { auth, isFirebaseConfigured } from '../services/firebase'
import { getUserProfile, upsertUserProfile } from '../services/profileService'
import { AuthContext } from './auth-context'

const MOCK_USER_STORAGE_KEY = 'algolens_mock_user'

const getStoredMockUser = () => {
  const raw = localStorage.getItem(MOCK_USER_STORAGE_KEY)
  return raw ? JSON.parse(raw) : null
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (!isFirebaseConfigured ? getStoredMockUser() : null))
  const [isLoading, setIsLoading] = useState(isFirebaseConfigured)
  const shouldShowLoader = useMinimumLoaderDelay(isLoading)

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return undefined

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      if (!nextUser) {
        setUser(null)
        setIsLoading(false)
        return
      }

      const profile = await getUserProfile(nextUser.uid)
      setUser({
        uid: nextUser.uid,
        email: nextUser.email,
        username: profile?.username || nextUser.email?.split('@')[0] || 'Learner',
      })
      setIsLoading(false)
    })

    return unsubscribe
  }, [])

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isFirebaseConfigured,
      async login(email, password) {
        if (!isFirebaseConfigured || !auth) {
          const mockUser = {
            uid: `mock-${email}`,
            email,
            username: email.split('@')[0] || 'Learner',
          }
          localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(mockUser))
          const existingProfile = await getUserProfile(mockUser.uid)
          if (!existingProfile) {
            await upsertUserProfile(mockUser.uid, { username: mockUser.username, email })
          }
          setUser(mockUser)
          return
        }
        const { user: authUser } = await signInWithEmailAndPassword(auth, email, password)
        const profile = await getUserProfile(authUser.uid)
        setUser({
          uid: authUser.uid,
          email: authUser.email,
          username: profile?.username || authUser.email?.split('@')[0] || 'Learner',
        })
      },
      async signup({ email, password, username }) {
        if (!isFirebaseConfigured || !auth) {
          const mockUser = {
            uid: `mock-${email}`,
            email,
            username,
          }
          await upsertUserProfile(mockUser.uid, { username, email })
          localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(mockUser))
          setUser(mockUser)
          return
        }
        const { user: authUser } = await createUserWithEmailAndPassword(auth, email, password)
        await upsertUserProfile(authUser.uid, { username, email: authUser.email })
        setUser({
          uid: authUser.uid,
          email: authUser.email,
          username,
        })
      },
      async logout() {
        if (!isFirebaseConfigured || !auth) {
          localStorage.removeItem(MOCK_USER_STORAGE_KEY)
          setUser(null)
          return
        }
        await signOut(auth)
      },
    }),
    [isLoading, user],
  )

  if (shouldShowLoader) {
    return <Loader fullscreen />
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
