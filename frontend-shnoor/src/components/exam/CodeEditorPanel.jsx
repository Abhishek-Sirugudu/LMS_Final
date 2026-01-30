


import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Settings, Maximize, Play, Save, Send } from 'lucide-react';

const CodeEditorPanel = ({
  startCode,
  language,
  onLanguageChange,
  onCodeChange,
  onRun,
  onSubmit,
  isRunning,
  consoleOutput
}) => {
  const [activeTab, setActiveTab] = useState('testcases');
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  /* 🔒 Detect function signature lines */
  const getReadOnlyRanges = (code) => {
    const lines = code.split('\n');
    const ranges = [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // JS / Java / C++
      if (
        trimmed.startsWith('function ') ||
        trimmed.startsWith('def ') ||
        trimmed.startsWith('public ') ||
        trimmed.startsWith('#include')
      ) {
        ranges.push({
          startLineNumber: index + 1,
          endLineNumber: index + 1,
          startColumn: 1,
          endColumn: line.length + 1
        });
      }
    });

    return ranges;
  };

  /* 🔒 Lock function signature */
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    const model = editor.getModel();
    if (!model || !startCode) return;

    const ranges = getReadOnlyRanges(startCode);

    // Decoration = read-only lines
    editor.createDecorationsCollection(
      ranges.map(r => ({
        range: new monaco.Range(
          r.startLineNumber,
          r.startColumn,
          r.endLineNumber,
          r.endColumn
        ),
        options: {
          isWholeLine: true,
          className: 'read-only-line',
          stickiness:
            monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
        }
      }))
    );

    // Prevent editing those lines
    editor.onDidChangeModelContent((event) => {
      for (const change of event.changes) {
        const line = change.range.startLineNumber;
        if (ranges.some(r => r.startLineNumber === line)) {
          editor.executeEdits('', [
            {
              range: change.range,
              text: '',
              forceMoveMarkers: true
            }
          ]);
        }
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] border-l border-[#333]">

      {/* Header */}
      <div className="flex justify-between items-center px-4 py-2 bg-[#252526] border-b border-[#333]">
        <div className="flex items-center gap-2">
          <span role="img" aria-label="code">💻</span>
          <select
            value={language}
            onChange={(e) => onLanguageChange?.(e.target.value)}
            className="bg-transparent border-none text-sm font-semibold text-slate-200 focus:outline-none"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>
        <div className="flex gap-2 text-slate-400">
          <Settings size={16} />
          <Maximize size={16} />
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={language}
          value={startCode}
          onChange={onCodeChange}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            fontFamily: "'Fira Code', monospace"
          }}
        />
      </div>

      {/* Bottom panel */}
      <div className="h-48 bg-[#1e1e1e] border-t border-[#333]">
        <div className="flex border-b border-[#333] bg-[#252526]">
          <div
            className={`px-4 py-2 text-xs font-bold cursor-pointer ${activeTab === 'testcases' ? 'text-blue-400' : 'text-slate-500'
              }`}
            onClick={() => setActiveTab('testcases')}
          >
            Test Cases
          </div>
          <div
            className={`px-4 py-2 text-xs font-bold cursor-pointer ${activeTab === 'console' ? 'text-blue-400' : 'text-slate-500'
              }`}
            onClick={() => setActiveTab('console')}
          >
            Console
          </div>
        </div>

        <div className="p-3 text-xs text-slate-300 overflow-y-auto">
          {activeTab === 'console' &&
            consoleOutput.map((log, i) => (
              <div key={i} className={log.type === 'error' ? 'text-red-400' : 'text-green-400'}>
                {log.msg}
              </div>
            ))}
        </div>
      </div>

      {/* Actions */}
      <div className="p-3 bg-[#252526] border-t border-[#333] flex justify-end gap-3">
        <button onClick={onRun} disabled={isRunning} className="bg-emerald-600 px-4 py-1.5 rounded text-white">
          <Play size={12} /> Run
        </button>
        <button onClick={onSubmit} className="bg-blue-600 px-4 py-1.5 rounded text-white">
          <Send size={12} /> Submit
        </button>
      </div>
    </div>
  );
};

export default CodeEditorPanel;
