import { loadPyodide, type PyodideAPI } from 'pyodide'

let pyodideInstance: PyodideAPI | null = null

async function getPyodide(): Promise<PyodideAPI> {
  if (pyodideInstance) return pyodideInstance
  pyodideInstance = await loadPyodide()
  return pyodideInstance
}

export async function runPython(code: string): Promise<string> {
  const pyodide = await getPyodide()
  const outputLines: string[] = []
  pyodide.setStdout({ batched: (msg: string) => outputLines.push(msg) })
  pyodide.setStderr({ batched: (msg: string) => outputLines.push(msg) })
  await pyodide.runPythonAsync(code)
  return outputLines.join('\n')
}
