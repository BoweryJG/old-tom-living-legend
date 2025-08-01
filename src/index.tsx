import React from 'react';
import ReactDOM from 'react-dom/client';

// Create a debug div immediately
const debugDiv = document.createElement('div');
debugDiv.id = 'debug-panel';
debugDiv.style.cssText = `
  position: fixed;
  top: 10px;
  right: 10px;
  background: black;
  color: white;
  padding: 20px;
  z-index: 999999;
  font-family: monospace;
  font-size: 14px;
  max-width: 400px;
  border: 2px solid red;
`;
debugDiv.innerHTML = `
  <h3>DEBUG PANEL</h3>
  <button id="copy-debug" style="
    background: #4CAF50;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    margin-bottom: 10px;
    border-radius: 4px;
  ">COPY LOGS</button>
  <div id="debug-content" style="
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #444;
    padding: 10px;
    margin-top: 10px;
  ">Loading index.tsx...</div>
`;
document.body.appendChild(debugDiv);

// Store all debug messages
const debugMessages: string[] = [];

function addDebug(message: string) {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  const fullMessage = `${timestamp} - ${message}`;
  debugMessages.push(fullMessage);
  
  const content = document.getElementById('debug-content');
  if (content) {
    content.innerHTML += `<div>${fullMessage}</div>`;
    content.scrollTop = content.scrollHeight;
  }
  console.log(`DEBUG: ${message}`);
}

// Add copy functionality
setTimeout(() => {
  const copyButton = document.getElementById('copy-debug');
  if (copyButton) {
    copyButton.onclick = () => {
      const text = debugMessages.join('\n');
      navigator.clipboard.writeText(text).then(() => {
        copyButton.textContent = 'COPIED!';
        copyButton.style.background = '#2196F3';
        setTimeout(() => {
          copyButton.textContent = 'COPY LOGS';
          copyButton.style.background = '#4CAF50';
        }, 2000);
      }).catch(err => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        copyButton.textContent = 'COPIED!';
      });
    };
  }
}, 100);

addDebug('index.tsx loaded');

// Global error handler
window.addEventListener('error', (event) => {
  addDebug(`ERROR: ${event.error}`);
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  addDebug(`PROMISE REJECT: ${event.reason}`);
  console.error('Unhandled promise rejection:', event.reason);
});

// Try to load App
let App: any = null;
let AppSimple: any = null;

try {
  addDebug('Importing AppSimple...');
  AppSimple = require('./AppSimple').default;
  addDebug('AppSimple imported successfully');
} catch (error) {
  addDebug(`FAILED to import AppSimple: ${error}`);
}

try {
  addDebug('Importing App...');
  App = require('./App').default;
  addDebug('App imported successfully');
} catch (error) {
  addDebug(`FAILED to import App: ${error}`);
  console.error('Failed to import App:', error);
}

// Simple test component
const TestApp = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: 'navy', color: 'white', minHeight: '100vh' }}>
      <h1>Old Tom App - Debug Mode</h1>
      <p>If you see this, React is working but App component failed to load.</p>
      <button onClick={() => window.location.reload()}>Reload</button>
    </div>
  );
};

// Error boundary
class InitErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    addDebug(`React Error: ${error}`);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    addDebug(`Component Error: ${error.message}`);
    console.error('React Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          backgroundColor: 'darkred',
          color: 'white',
          minHeight: '100vh'
        }}>
          <h1>React Error</h1>
          <pre>{this.state.error?.toString()}</pre>
          <pre>{this.state.error?.stack}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

try {
  addDebug('Creating React root...');
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  
  addDebug('Rendering app...');
  
  // Use App if it loaded, otherwise AppSimple, otherwise TestApp
  const ComponentToRender = App || AppSimple || TestApp;
  addDebug(`Using component: ${App ? 'App' : AppSimple ? 'AppSimple' : 'TestApp'}`);
  
  root.render(
    <React.StrictMode>
      <InitErrorBoundary>
        <ComponentToRender />
      </InitErrorBoundary>
    </React.StrictMode>
  );
  
  addDebug('Render complete');
} catch (error) {
  addDebug(`FATAL ERROR: ${error}`);
  console.error('Fatal error during render:', error);
}