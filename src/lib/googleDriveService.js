const GIS_SCRIPT_SRC = 'https://accounts.google.com/gsi/client'
const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file'
const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3'
const DRIVE_UPLOAD_ENDPOINT = 'https://www.googleapis.com/upload/drive/v3/files'
const DEFAULT_FOLDER_NAME = 'LearningPlusPlus'

let gisScriptPromise = null
let tokenClient = null
let accessToken = null
let accessTokenExpiresAtMs = 0

function getClientId() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  if (!clientId) {
    throw new Error('Missing VITE_GOOGLE_CLIENT_ID. Add it to your frontend environment variables.')
  }
  return clientId
}

function isTokenValid() {
  return !!accessToken && Date.now() < accessTokenExpiresAtMs - 60_000
}

function escapeDriveQueryValue(value) {
  return value.replace(/'/g, "\\'")
}

function sanitizeSlug(slug) {
  const normalized = (slug ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
  return normalized || 'exercise'
}

function driveTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-')
}

function buildDriveErrorMessage(status, bodyText) {
  if (!bodyText) {
    return `Google Drive API request failed with status ${status}.`
  }

  try {
    const parsed = JSON.parse(bodyText)
    const apiMessage = parsed?.error?.message
    if (apiMessage) {
      return `Google Drive API (${status}): ${apiMessage}`
    }
  } catch {
    // ignore JSON parsing errors and fall back to raw text
  }

  return `Google Drive API (${status}): ${bodyText}`
}

/**
 * Loads the Google Identity Services client script:
 * https://accounts.google.com/gsi/client
 */
export function ensureGoogleIdentityScript() {
  if (window.google?.accounts?.oauth2) {
    return Promise.resolve()
  }
  if (gisScriptPromise) {
    return gisScriptPromise
  }

  gisScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GIS_SCRIPT_SRC}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('Failed to load Google Identity Services script.')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = GIS_SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google Identity Services script.'))
    document.head.appendChild(script)
  })

  return gisScriptPromise
}

async function ensureTokenClient() {
  await ensureGoogleIdentityScript()

  if (tokenClient) {
    return tokenClient
  }

  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: getClientId(),
    scope: DRIVE_SCOPE,
    callback: () => {},
  })

  return tokenClient
}

/**
 * Requests an OAuth 2.0 access token using GIS token client (implicit flow).
 * This is user-triggered and should be called only from UI actions.
 */
export async function requestDriveAccessToken() {
  if (isTokenValid()) {
    return accessToken
  }

  const client = await ensureTokenClient()

  return new Promise((resolve, reject) => {
    client.callback = (response) => {
      if (response?.error) {
        reject(new Error(response.error_description || response.error || 'Google authorization failed.'))
        return
      }

      const token = response?.access_token
      if (!token) {
        reject(new Error('Google authorization did not return an access token.'))
        return
      }

      const expiresInSeconds = Number(response?.expires_in ?? 3600)
      accessToken = token
      accessTokenExpiresAtMs = Date.now() + expiresInSeconds * 1000
      resolve(token)
    }

    client.requestAccessToken({ prompt: accessToken ? '' : 'consent' })
  })
}

/**
 * Attempts to restore a Drive token without showing a consent prompt.
 * Returns false when silent refresh is unavailable (expired/revoked session, etc.).
 */
export async function tryRestoreDriveAccessToken() {
  if (isTokenValid()) {
    return true
  }

  const client = await ensureTokenClient()

  return new Promise((resolve) => {
    const timeout = window.setTimeout(() => resolve(false), 5000)

    client.callback = (response) => {
      window.clearTimeout(timeout)

      if (response?.error || !response?.access_token) {
        resolve(false)
        return
      }

      const expiresInSeconds = Number(response?.expires_in ?? 3600)
      accessToken = response.access_token
      accessTokenExpiresAtMs = Date.now() + expiresInSeconds * 1000
      resolve(true)
    }

    try {
      client.requestAccessToken({ prompt: '' })
    } catch {
      window.clearTimeout(timeout)
      resolve(false)
    }
  })
}

export function clearDriveSessionToken() {
  accessToken = null
  accessTokenExpiresAtMs = 0
}

async function driveRequest(url, options = {}) {
  const token = await requestDriveAccessToken()

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  })

  if (response.status === 401) {
    clearDriveSessionToken()
  }

  if (!response.ok) {
    const bodyText = await response.text()
    throw new Error(buildDriveErrorMessage(response.status, bodyText))
  }

  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }

  return response.text()
}

/**
 * Endpoint: GET https://www.googleapis.com/drive/v3/files
 * Query filters for a non-trashed folder named "LearningPlusPlus".
 */
export async function findLearningPlusPlusFolder(folderName = DEFAULT_FOLDER_NAME) {
  const query = [
    `mimeType='application/vnd.google-apps.folder'`,
    `name='${escapeDriveQueryValue(folderName)}'`,
    'trashed=false',
  ].join(' and ')

  const params = new URLSearchParams({
    q: query,
    spaces: 'drive',
    fields: 'files(id,name)',
    pageSize: '1',
  })

  const data = await driveRequest(`${DRIVE_API_BASE}/files?${params.toString()}`)
  const files = Array.isArray(data?.files) ? data.files : []
  return files[0] || null
}

/**
 * Endpoint: POST https://www.googleapis.com/drive/v3/files
 * Creates a folder in Google Drive.
 */
export async function createLearningPlusPlusFolder(folderName = DEFAULT_FOLDER_NAME) {
  const body = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  }

  return driveRequest(`${DRIVE_API_BASE}/files?fields=id,name`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

/**
 * Uses Drive API search first, then creates the folder only when missing.
 */
export async function ensureLearningPlusPlusFolder(folderName = DEFAULT_FOLDER_NAME) {
  const existing = await findLearningPlusPlusFolder(folderName)
  if (existing?.id) {
    return existing
  }
  return createLearningPlusPlusFolder(folderName)
}

function toDriveJsonFileName(nameCandidate, fallbackSlug) {
  const fallback = `${sanitizeSlug(fallbackSlug)}_${driveTimestamp()}.json`
  if (typeof nameCandidate !== 'string') {
    return fallback
  }

  const trimmed = nameCandidate.trim()
  if (!trimmed) {
    return fallback
  }

  const safeBase = trimmed
    .replace(/[\\/]/g, '_')
    .replace(/\s+/g, ' ')
    .trim()

  if (!safeBase) {
    return fallback
  }

  return safeBase.toLowerCase().endsWith('.json') ? safeBase : `${safeBase}.json`
}

/**
 * Endpoint: POST https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart
 * Uploads a JSON file under the target Drive folder.
 */
export async function saveExerciseJsonToDrive(payload, folderName = DEFAULT_FOLDER_NAME, customFileName) {
  const folder = await ensureLearningPlusPlusFolder(folderName)
  const safeSlug = sanitizeSlug(payload.slug)
  const fileName = toDriveJsonFileName(customFileName, safeSlug)

  const metadata = {
    name: fileName,
    parents: [folder.id],
    mimeType: 'application/json',
  }

  const fileContent = {
    title: payload.title,
    slug: safeSlug,
    language: payload.language,
    content: payload.content,
    exerciseId: payload.exerciseId ?? null,
    savedAt: new Date().toISOString(),
  }

  const boundary = `learningplusplus_${Math.random().toString(16).slice(2)}`
  const multipartBody = [
    `--${boundary}`,
    'Content-Type: application/json; charset=UTF-8',
    '',
    JSON.stringify(metadata),
    `--${boundary}`,
    'Content-Type: application/json; charset=UTF-8',
    '',
    JSON.stringify(fileContent),
    `--${boundary}--`,
    '',
  ].join('\r\n')

  const uploaded = await driveRequest(`${DRIVE_UPLOAD_ENDPOINT}?uploadType=multipart&fields=id,name,webViewLink`, {
    method: 'POST',
    headers: {
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartBody,
  })

  return { ...uploaded, folderId: folder.id }
}

/**
 * Endpoint: GET https://www.googleapis.com/drive/v3/files
 * Lists JSON files from the LearningPlusPlus folder.
 */
export async function listJsonFilesInLearningPlusPlusFolder(folderName = DEFAULT_FOLDER_NAME) {
  const folder = await findLearningPlusPlusFolder(folderName)
  if (!folder?.id) {
    return []
  }

  const query = [
    `'${folder.id}' in parents`,
    `mimeType='application/json'`,
    'trashed=false',
  ].join(' and ')

  const params = new URLSearchParams({
    q: query,
    spaces: 'drive',
    fields: 'files(id,name,createdTime,modifiedTime,size)',
    orderBy: 'createdTime desc',
    pageSize: '100',
  })

  const data = await driveRequest(`${DRIVE_API_BASE}/files?${params.toString()}`)
  const files = Array.isArray(data?.files) ? data.files : []
  return files.map((file) => ({ ...file, folderId: folder.id }))
}

/**
 * Endpoint: GET https://www.googleapis.com/drive/v3/files/{fileId}?alt=media
 * Downloads the raw JSON content of a Drive file.
 */
export async function downloadDriveJsonFile(fileId) {
  return driveRequest(`${DRIVE_API_BASE}/files/${encodeURIComponent(fileId)}?alt=media`, {
    method: 'GET',
  })
}
