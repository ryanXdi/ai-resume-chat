import { useState, useRef } from 'react'
import axios from 'axios'

export default function App() {
  const [file, setFile] = useState(null)
  const [uploaded, setUploaded] = useState(false)
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  const handleUpload = async (selectedFile) => {
    if (!selectedFile) return
    const formData = new FormData()
    formData.append('file', selectedFile)
    await axios.post('https://ai-resume-chat-skql.onrender.com/upload', formData)
    setUploaded(true)
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    handleUpload(selectedFile)
  }

  const handleChat = async () => {
    if (!question.trim()) return
    const userMessage = question
    setMessages(prev => [...prev, { role: 'user', text: userMessage }])
    setQuestion('')
    setLoading(true)
    const res = await axios.post('https://ai-resume-chat-skql.onrender.com/chat', { question: userMessage })
    setMessages(prev => [...prev, { role: 'ai', text: res.data.answer }])
    setLoading(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleChat()
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'monospace', background: '#0a0a0a' }}>

      {/* Sidebar */}
      <div style={{ width: 320, background: '#111111', borderRight: '1px solid #1e1e1e', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 500, color: '#3B82F6', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 4px' }}>AI Resume Chat</p>
          <h1 style={{ fontSize: 18, fontWeight: 500, color: 'white', margin: '0 0 4px' }}>Your resume,</h1>
          <h1 style={{ fontSize: 18, fontWeight: 500, color: '#484848', margin: 0 }}>answered instantly.</h1>
        </div>

        <div
          onClick={() => fileInputRef.current.click()}
          style={{ border: '1.5px dashed #1e1e1e', borderRadius: 8, padding: '1.25rem', textAlign: 'center', cursor: 'pointer', background: '#0f0f0f' }}
        >
          <div style={{ fontSize: 22, marginBottom: 6 }}>📄</div>
          {uploaded ? (
            <p style={{ fontSize: 13, color: '#3B82F6', fontWeight: 500, margin: 0 }}>✓ {file?.name}</p>
          ) : (
            <>
              <p style={{ fontSize: 13, color: '#7f8c8d', margin: '0 0 10px' }}>Click to upload PDF</p>
              <button style={{ background: '#3B82F6', color: 'white', border: 'none', padding: '6px 16px', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontFamily: 'monospace' }}>
                Choose file
              </button>
            </>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileChange} style={{ display: 'none' }} />

        <div style={{ background: '#0f172a', borderRadius: 8, padding: 12, border: '1px solid #1e3a5f' }}>
          <p style={{ fontSize: 12, color: '#3B82F6', margin: 0, lineHeight: 1.6 }}>💡 Try: "What are my strongest skills?" or "Write me a cover letter"</p>
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0a0a0a' }}>
        {!uploaded ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: 15 }}>
            Upload your resume to get started
          </div>
        ) : (
          <>
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', color: '#333', fontSize: 14, marginTop: '4rem' }}>
                  Ask anything about your resume
                </div>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    background: msg.role === 'user' ? '#1e3a5f' : '#111111',
                    color: msg.role === 'user' ? '#93c5fd' : '#d1d5db',
                    padding: '10px 16px',
                    borderRadius: 12,
                    borderBottomRightRadius: msg.role === 'user' ? 4 : 12,
                    borderBottomLeftRadius: msg.role === 'ai' ? 4 : 12,
                    fontSize: 14,
                    maxWidth: '70%',
                    lineHeight: 1.7,
                    whiteSpace: 'pre-wrap',
                    border: msg.role === 'ai' ? '1px solid #1e1e1e' : 'none'
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ background: '#111111', border: '1px solid #1e1e1e', padding: '10px 16px', borderRadius: 12, fontSize: 14, color: '#7f8c8d' }}>
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #1e1e1e', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <textarea
                rows={2}
                style={{ flex: 1, resize: 'none', padding: '10px 12px', fontSize: 14, borderRadius: 8, border: '1px solid #1e1e1e', background: '#111111', color: 'white', fontFamily: 'monospace', outline: 'none' }}
                placeholder="Ask something about your resume..."
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={handleChat}
                style={{ background: '#3B82F6', color: 'white', border: 'none', width: 44, height: 44, borderRadius: 8, cursor: 'pointer', fontSize: 18 }}
              >
                →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}