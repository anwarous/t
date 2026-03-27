// Algorithm compiler client — calls the Flask REST API from algoCompiler/CompilerRes
//
// The API server must be running (see algoCompiler/CompilerRes/web_ui.py).
// Override the base URL by setting VITE_ALGO_COMPILER_URL in your .env file.

declare global {
  interface ImportMeta {
    readonly env: Record<string, string | undefined>
  }
}

const ALGO_API_URL = (import.meta.env.VITE_ALGO_COMPILER_URL) ?? 'http://localhost:5000'

export async function runAlgo(code: string, inputs = ''): Promise<string> {
  const response = await fetch(`${ALGO_API_URL}/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, inputs }),
  })

  const data = await response.json() as { output?: string; error?: string }

  if (data.error) {
    throw new Error(data.error)
  }

  return data.output ?? ''
}
