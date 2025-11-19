import { useState } from 'react'
import XPathSidebar from './components/XPathSidebar'
import './App.css'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="app-container">
      {/* Toggle button */}
      <button
        className="sidebar-toggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle XPath Sidebar"
      >
        {isSidebarOpen ? '✕' : '⚙️'}
      </button>

      {/* Demo content area */}
      <main className="main-content">
        <h1>SearchVolume.com - XPath Workflow Demo</h1>
        <div className="demo-content">
          <section className="demo-section" data-section="header">
            <h2 className="section-title">Search Results</h2>
            <div className="search-bar">
              <input type="text" placeholder="Enter keyword..." className="search-input" />
              <button className="search-button">Search</button>
            </div>
          </section>

          <section className="demo-section" data-section="results">
            <div className="result-item" data-id="1">
              <h3 className="result-title">Keyword 1</h3>
              <p className="result-volume">Search Volume: 10,000</p>
              <span className="result-difficulty">Difficulty: Medium</span>
            </div>
            <div className="result-item" data-id="2">
              <h3 className="result-title">Keyword 2</h3>
              <p className="result-volume">Search Volume: 5,000</p>
              <span className="result-difficulty">Difficulty: Easy</span>
            </div>
            <div className="result-item" data-id="3">
              <h3 className="result-title">Keyword 3</h3>
              <p className="result-volume">Search Volume: 15,000</p>
              <span className="result-difficulty">Difficulty: Hard</span>
            </div>
          </section>

          <section className="demo-section" data-section="footer">
            <nav className="pagination">
              <button className="page-button prev">Previous</button>
              <span className="page-number">Page 1</span>
              <button className="page-button next">Next</button>
            </nav>
          </section>
        </div>
      </main>

      {/* XPath Sidebar */}
      <XPathSidebar isOpen={isSidebarOpen} />
    </div>
  )
}

export default App
