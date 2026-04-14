// Algorithm compiler client — calls the Flask REST API from algoCompiler/CompilerRes
//
// The API server must be running (see algoCompiler/CompilerRes/web_ui.py).
// Override the base URL by setting VITE_ALGO_COMPILER_URL in your .env file.

declare global {
  interface ImportMeta {
    readonly env: Record<string, string | undefined>
  }
}

const DEFAULT_TIMEOUT_MS = 60_000
const rawAlgoApiUrl = (import.meta.env.VITE_ALGO_COMPILER_URL ?? '/algo-api').trim()
const ALGO_API_URL = rawAlgoApiUrl.endsWith('/') ? rawAlgoApiUrl.slice(0, -1) : rawAlgoApiUrl
const parsedTimeoutMs = Number(import.meta.env.VITE_ALGO_COMPILER_TIMEOUT_MS)
const ALGO_TIMEOUT_MS = Number.isFinite(parsedTimeoutMs) && parsedTimeoutMs > 0 ? parsedTimeoutMs : DEFAULT_TIMEOUT_MS

function unavailableCompilerMessage(): string {
  return 'Algorithm compiler service is unavailable. Start the algo-compiler service (port 5000), or switch to Python mode.'
}

export async function runAlgo(code: string, inputs = ''): Promise<string> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), ALGO_TIMEOUT_MS)

  try {
    const response = await fetch(`${ALGO_API_URL}/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, inputs }),
      signal: controller.signal,
    })

    const contentType = response.headers.get('content-type') ?? ''
    const isJson = contentType.includes('application/json')
    const data = isJson
      ? await response.json() as { output?: string; error?: string; message?: string }
      : null

    if (!response.ok) {
      const message = response.status >= 500
        ? unavailableCompilerMessage()
        : (data?.error ?? data?.message ?? `Compiler API error (${response.status})`)
      throw new Error(message)
    }

    if (data?.error) {
      throw new Error(data.error)
    }

    return data?.output ?? ''
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Algorithm execution timed out. Try again, or increase VITE_ALGO_COMPILER_TIMEOUT_MS.')
    }
    if (err instanceof TypeError) {
      throw new Error(unavailableCompilerMessage())
    }
    if (err instanceof Error) {
      throw err
    }
    throw new Error(unavailableCompilerMessage())
  } finally {
    clearTimeout(timeoutId)
  }
}
