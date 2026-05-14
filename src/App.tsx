import { Chatbot } from './components/Chatbot'
import './App.css'

function App() {
  return (
    <main style={{ padding: '20px', minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Chatbot />
    </main>
  )
}

export default App
