import { loadPyodide, type PyodideAPI } from 'pyodide'

let pyodideInstance: PyodideAPI | null = null

async function getPyodide(): Promise<PyodideAPI> {
  if (pyodideInstance) return pyodideInstance
  pyodideInstance = await loadPyodide()
  return pyodideInstance
}

export async function runPython(code: string, inputs = ''): Promise<string> {
  const pyodide = await getPyodide()
  const outputLines: string[] = []
  pyodide.setStdout({ batched: (msg: string) => outputLines.push(msg) })
  pyodide.setStderr({ batched: (msg: string) => outputLines.push(msg) })

  // Provide pre-supplied input lines to Python's input() / sys.stdin
  const inputLines = inputs.split('\n')
  let inputIndex = 0
  pyodide.setStdin({
    stdin: () => {
      if (inputIndex < inputLines.length) {
        return inputLines[inputIndex++] + '\n'
      }
      return null
    },
  })

  await pyodide.runPythonAsync(code)
  return outputLines.join('\n')
}
