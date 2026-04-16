export type DriveLanguage = 'python' | 'algorithm'

export interface DriveExercisePayload {
  title: string
  slug: string
  language: DriveLanguage
  content: string
  exerciseId?: string
}

export interface GoogleDriveFolder {
  id: string
  name: string
}

export interface GoogleDriveFileSummary {
  id: string
  name: string
  createdTime?: string
  modifiedTime?: string
  size?: string
  folderId?: string
}

export interface UploadedDriveFile {
  id: string
  name: string
  webViewLink?: string
  folderId: string
}

export interface DriveExerciseFileContent {
  title?: string
  slug?: string
  language?: DriveLanguage
  content?: string
  code?: string
  exerciseId?: string | null
  savedAt?: string
}

export function ensureGoogleIdentityScript(): Promise<void>
export function requestDriveAccessToken(): Promise<string>
export function tryRestoreDriveAccessToken(): Promise<boolean>
export function clearDriveSessionToken(): void
export function findLearningPlusPlusFolder(folderName?: string): Promise<GoogleDriveFolder | null>
export function createLearningPlusPlusFolder(folderName?: string): Promise<GoogleDriveFolder>
export function ensureLearningPlusPlusFolder(folderName?: string): Promise<GoogleDriveFolder>
export function saveExerciseJsonToDrive(payload: DriveExercisePayload, folderName?: string, customFileName?: string): Promise<UploadedDriveFile>
export function listJsonFilesInLearningPlusPlusFolder(folderName?: string): Promise<GoogleDriveFileSummary[]>
export function downloadDriveJsonFile(fileId: string): Promise<DriveExerciseFileContent>
