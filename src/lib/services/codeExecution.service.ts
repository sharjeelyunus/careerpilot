interface CodeExecutionResult {
  output: string;
  error: string | null;
  executionTime: number;
}

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<void>;
  setStdout: (options: { write: (buffer: Uint8Array) => number }) => void;
  setStderr: (options: { write: (buffer: Uint8Array) => number }) => void;
}

declare global {
  interface Window {
    loadPyodide: (config: { indexURL: string }) => Promise<PyodideInterface>;
  }
}

export const SUPPORTED_LANGUAGES = ['javascript', 'typescript', 'python'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

class CodeExecutionService {
  private static instance: CodeExecutionService;
  private pyodide: PyodideInterface | null = null;
  private isPyodideLoading = false;
  private pyodideLoadPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): CodeExecutionService {
    if (!CodeExecutionService.instance) {
      CodeExecutionService.instance = new CodeExecutionService();
    }
    return CodeExecutionService.instance;
  }

  async initializePyodide() {
    if (this.pyodide) return;

    if (this.isPyodideLoading) {
      // Wait for the existing load to complete
      await this.pyodideLoadPromise;
      return;
    }

    this.isPyodideLoading = true;

    try {
      // Load Pyodide from CDN
      if (typeof window === 'undefined') {
        throw new Error('Pyodide can only be loaded in browser environment');
      }

      // Load the Pyodide script
      if (!window.loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        document.head.appendChild(script);

        // Wait for the script to load
        await new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () =>
            reject(new Error('Failed to load Pyodide script'));
        });
      }

      this.pyodideLoadPromise = (async () => {
        this.pyodide = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
        });
      })();

      await this.pyodideLoadPromise;
    } catch (error) {
      console.error('Failed to load Pyodide:', error);
      this.isPyodideLoading = false;
      this.pyodideLoadPromise = null;
      throw new Error('Failed to initialize Python environment');
    } finally {
      this.isPyodideLoading = false;
    }
  }

  async executeCode(
    code: string,
    language: string
  ): Promise<CodeExecutionResult> {
    const startTime = performance.now();
    let output = '';
    let error = null;

    try {
      switch (language) {
        case 'javascript':
        case 'typescript':
          // Create a safe execution environment with proper console capture
          const originalConsole = console;
          const logs: string[] = [];

          const mockConsole = {
            log: (...args: unknown[]) => {
              const formatted = args
                .map((arg) =>
                  typeof arg === 'object'
                    ? JSON.stringify(arg, null, 2)
                    : String(arg)
                )
                .join(' ');
              logs.push(formatted);
              originalConsole.log(...args); // Keep the original console.log for debugging
            },
            error: (...args: unknown[]) => {
              const formatted = args
                .map((arg) =>
                  typeof arg === 'object'
                    ? JSON.stringify(arg, null, 2)
                    : String(arg)
                )
                .join(' ');
              logs.push('Error: ' + formatted);
              originalConsole.error(...args);
            },
            warn: (...args: unknown[]) => {
              const formatted = args
                .map((arg) =>
                  typeof arg === 'object'
                    ? JSON.stringify(arg, null, 2)
                    : String(arg)
                )
                .join(' ');
              logs.push('Warning: ' + formatted);
              originalConsole.warn(...args);
            },
            info: (...args: unknown[]) => {
              const formatted = args
                .map((arg) =>
                  typeof arg === 'object'
                    ? JSON.stringify(arg, null, 2)
                    : String(arg)
                )
                .join(' ');
              logs.push(formatted);
              originalConsole.info(...args);
            },
          };

          // Execute the code with the mock console
          const executeCode = new Function(
            'console',
            `
            try {
              ${code}
            } catch (e) {
              console.error(e.message);
            }
          `
          );

          executeCode(mockConsole);
          output = logs.join('\n');
          break;

        case 'python':
          await this.initializePyodide();
          if (!this.pyodide) {
            throw new Error('Pyodide failed to initialize');
          }
          // Redirect Python's stdout and stderr
          this.pyodide.setStdout({
            write: (buffer: Uint8Array) => {
              output += new TextDecoder().decode(buffer);
              return buffer.length;
            },
          });
          this.pyodide.setStderr({
            write: (buffer: Uint8Array) => {
              output += 'Error: ' + new TextDecoder().decode(buffer);
              return buffer.length;
            },
          });

          try {
            await this.pyodide.runPythonAsync(code);
          } catch (e: unknown) {
            error = e instanceof Error ? e.message : String(e);
          }
          break;

        default:
          throw new Error(
            `Language ${language} is not supported for code execution`
          );
      }
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : String(e);
    }

    const executionTime = performance.now() - startTime;

    return {
      output: output.trim(),
      error,
      executionTime,
    };
  }

  isSupportedLanguage(language: string): language is SupportedLanguage {
    return SUPPORTED_LANGUAGES.includes(language as SupportedLanguage);
  }
}

export const codeExecutionService = CodeExecutionService.getInstance();
