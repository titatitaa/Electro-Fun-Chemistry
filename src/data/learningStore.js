const STORAGE_PREFIX = 'electrofun_learning_v1'
const ACTIVITY_KEY = 'activity'
export const LEGACY_LAB_LOG_KEY = 'electrofun_virtual_lab_log'

function storageKey(userId, featureKey) {
  const safeUserId = String(userId || 'anonymous').replace(/[^a-zA-Z0-9_-]/g, '_')
  return `${STORAGE_PREFIX}:${safeUserId}:${featureKey}`
}

export function readLearningData(userId, featureKey, fallback) {
  try {
    const stored = window.localStorage.getItem(storageKey(userId, featureKey))
    if (stored === null) return fallback
    const value = JSON.parse(stored)
    if (Array.isArray(fallback) && !Array.isArray(value)) {
      throw new TypeError('Expected an array in local learning data.')
    }
    if (fallback && typeof fallback === 'object' && !Array.isArray(fallback) && (
      !value || typeof value !== 'object' || Array.isArray(value)
    )) {
      throw new TypeError('Expected an object in local learning data.')
    }
    return value
  } catch (error) {
    console.error(`Unable to read ElectroFun learning data (${featureKey}).`, error)
    return fallback
  }
}

export function writeLearningData(userId, featureKey, value) {
  try {
    window.localStorage.setItem(storageKey(userId, featureKey), JSON.stringify(value))
  } catch (error) {
    console.error(`Unable to save ElectroFun learning data (${featureKey}).`, error)
    throw new Error('Data tidak dapat disimpan di perangkat ini. Periksa ruang penyimpanan browser.')
  }
}

export function recordLearningActivity(userId, activity, onActivity) {
  const current = readLearningData(userId, ACTIVITY_KEY, [])
  const next = [{
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    at: new Date().toISOString(),
    ...activity,
  }, ...current].slice(0, 100)
  writeLearningData(userId, ACTIVITY_KEY, next)
  onActivity?.(next)
  return next
}

export function readLearningActivities(userId) {
  return readLearningData(userId, ACTIVITY_KEY, [])
}

export function getUserLabLogKey(userId) {
  const safeUserId = String(userId || 'anonymous').replace(/[^a-zA-Z0-9_-]/g, '_')
  return `${LEGACY_LAB_LOG_KEY}:${safeUserId}`
}

export function getUserLabNotesKey(userId) {
  const safeUserId = String(userId || 'anonymous').replace(/[^a-zA-Z0-9_-]/g, '_')
  return `electrofun_virtual_lab_notes:${safeUserId}`
}
