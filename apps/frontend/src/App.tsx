import { useEffect, useMemo, useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';
import type { Awareness } from 'y-protocols/awareness';

const ROOM_NAME = 'collab-demo';

export default function App() {
  const ydoc = useMemo(() => new Y.Doc(), []);
  const bindingRef = useRef<MonacoBinding | null>(null);
  const awarenessRef = useRef<Awareness | null>(null);

  useMemo(() => {
    const provider = new WebrtcProvider(ROOM_NAME, ydoc, {
      signaling: ['wss://signaling.yjs.dev']
    });

    const fallback = new WebsocketProvider('ws://localhost:3001/yjs', ROOM_NAME, ydoc);
    awarenessRef.current = fallback.awareness;

    return () => {
      provider.destroy();
      fallback.destroy();
    };
  }, [ydoc]);

  useEffect(() => {
    return () => {
      bindingRef.current?.destroy();
      bindingRef.current = null;
    };
  }, []);

  const handleMount: OnMount = (editor, monaco) => {
    const model = editor.getModel();
    if (!model) {
      return;
    }

    const ytext = ydoc.getText('monaco');
    bindingRef.current = new MonacoBinding(
      ytext,
      model,
      new Set([editor]),
      awarenessRef.current ?? undefined
    );
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '12px 16px', borderBottom: '1px solid #1f2937' }}>
        <h1 style={{ margin: 0 }}>Real-Time Collaborative Code Analysis</h1>
        <p style={{ margin: '4px 0 0', color: '#6b7280' }}>
          Live CRDT editing with Yjs, Monaco, and presence via WebRTC/WebSocket.
        </p>
      </header>
      <main style={{ flex: 1 }}>
        <Editor
          height="100%"
          defaultLanguage="typescript"
          defaultValue={`// Start collaborating\nfunction hello() {\n  console.log('hello world');\n}`}
          onMount={handleMount}
          options={{
            fontSize: 14,
            minimap: { enabled: false }
          }}
        />
      </main>
    </div>
  );
}
