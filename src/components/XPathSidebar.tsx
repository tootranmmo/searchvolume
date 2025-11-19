import { useState, useEffect } from 'react'
import './XPathSidebar.css'

interface XPathStep {
  id: string
  type: 'tag' | 'attribute' | 'text' | 'position' | 'custom'
  value: string
  description: string
}

interface Props {
  isOpen: boolean
}

const XPathSidebar = ({ isOpen }: Props) => {
  const [steps, setSteps] = useState<XPathStep[]>([])
  const [currentXPath, setCurrentXPath] = useState<string>('//')
  const [selectedElement, setSelectedElement] = useState<Element | null>(null)
  const [matchCount, setMatchCount] = useState<number>(0)
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false)
  const [history, setHistory] = useState<string[]>([])

  // Build XPath from steps
  useEffect(() => {
    if (steps.length === 0) {
      setCurrentXPath('//')
      return
    }

    let xpath = '//'
    steps.forEach((step, index) => {
      switch (step.type) {
        case 'tag':
          xpath += step.value
          break
        case 'attribute':
          xpath += `[@${step.value}]`
          break
        case 'text':
          xpath += `[contains(text(), '${step.value}')]`
          break
        case 'position':
          xpath += `[${step.value}]`
          break
        case 'custom':
          xpath += step.value
          break
      }
      if (index < steps.length - 1 && step.type === 'tag') {
        xpath += '/'
      }
    })

    setCurrentXPath(xpath)
  }, [steps])

  // Test XPath and count matches
  useEffect(() => {
    try {
      const result = document.evaluate(
        currentXPath,
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      )
      setMatchCount(result.snapshotLength)

      // Highlight matched elements
      highlightMatches(result)
    } catch (error) {
      setMatchCount(0)
    }
  }, [currentXPath])

  const highlightMatches = (result: XPathResult) => {
    // Remove previous highlights
    document.querySelectorAll('.xpath-highlight').forEach(el => {
      el.classList.remove('xpath-highlight')
    })

    // Add highlights to matches
    for (let i = 0; i < result.snapshotLength; i++) {
      const node = result.snapshotItem(i)
      if (node instanceof Element) {
        node.classList.add('xpath-highlight')
      }
    }
  }

  const addStep = (type: XPathStep['type'], value: string, description: string) => {
    const newStep: XPathStep = {
      id: Date.now().toString(),
      type,
      value,
      description
    }
    setSteps([...steps, newStep])
    setHistory([...history, currentXPath])
  }

  const removeStep = (id: string) => {
    setSteps(steps.filter(step => step.id !== id))
  }

  const clearSteps = () => {
    setSteps([])
    setCurrentXPath('//')
    setHistory([])
  }

  const undo = () => {
    if (history.length > 0) {
      const prevXPath = history[history.length - 1]
      setHistory(history.slice(0, -1))
      setSteps(steps.slice(0, -1))
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentXPath)
    alert('XPath copied to clipboard!')
  }

  const enableSelectionMode = () => {
    setIsSelectionMode(true)
  }

  useEffect(() => {
    if (!isSelectionMode) return

    const handleClick = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const target = e.target as Element
      setSelectedElement(target)

      // Generate XPath from clicked element
      const xpath = generateXPathForElement(target)
      setCurrentXPath(xpath)
      setIsSelectionMode(false)

      // Remove hover effects
      document.querySelectorAll('.xpath-hover').forEach(el => {
        el.classList.remove('xpath-hover')
      })
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as Element
      target.classList.add('xpath-hover')
    }

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as Element
      target.classList.remove('xpath-hover')
    }

    document.addEventListener('click', handleClick, true)
    document.addEventListener('mouseover', handleMouseOver, true)
    document.addEventListener('mouseout', handleMouseOut, true)

    return () => {
      document.removeEventListener('click', handleClick, true)
      document.removeEventListener('mouseover', handleMouseOver, true)
      document.removeEventListener('mouseout', handleMouseOut, true)
    }
  }, [isSelectionMode])

  const generateXPathForElement = (element: Element): string => {
    if (element.id) {
      return `//*[@id="${element.id}"]`
    }

    const parts: string[] = []
    let current: Element | null = element

    while (current && current !== document.body) {
      let index = 1
      let sibling = current.previousElementSibling

      while (sibling) {
        if (sibling.tagName === current.tagName) {
          index++
        }
        sibling = sibling.previousElementSibling
      }

      const tagName = current.tagName.toLowerCase()
      const part = index > 1 ? `${tagName}[${index}]` : tagName
      parts.unshift(part)

      current = current.parentElement
    }

    return '//' + parts.join('/')
  }

  if (!isOpen) return null

  return (
    <aside className="xpath-sidebar">
      <div className="sidebar-header">
        <h2>XPath Builder</h2>
        <p className="sidebar-subtitle">Build XPath step by step</p>
      </div>

      <div className="sidebar-content">
        {/* Current XPath Display */}
        <div className="xpath-display">
          <label>Current XPath:</label>
          <div className="xpath-output">
            <code>{currentXPath}</code>
            <button onClick={copyToClipboard} className="btn-icon" title="Copy to clipboard">
              📋
            </button>
          </div>
          <div className="xpath-info">
            <span className={`match-count ${matchCount > 0 ? 'has-matches' : ''}`}>
              {matchCount} {matchCount === 1 ? 'match' : 'matches'}
            </span>
          </div>
        </div>

        {/* Selection Mode */}
        <div className="selection-mode">
          <button
            onClick={enableSelectionMode}
            className={`btn-primary ${isSelectionMode ? 'active' : ''}`}
          >
            {isSelectionMode ? '🎯 Click element to select...' : '🖱️ Select Element on Page'}
          </button>
        </div>

        {/* Step Builder */}
        <div className="step-builder">
          <h3>Add Step</h3>

          <div className="step-options">
            <button
              onClick={() => {
                const value = prompt('Enter tag name (e.g., div, span, a):')
                if (value) addStep('tag', value, `Tag: ${value}`)
              }}
              className="btn-step"
            >
              + Tag Name
            </button>

            <button
              onClick={() => {
                const attr = prompt('Enter attribute (e.g., class="example"):')
                if (attr) addStep('attribute', attr, `Attribute: ${attr}`)
              }}
              className="btn-step"
            >
              + Attribute
            </button>

            <button
              onClick={() => {
                const text = prompt('Enter text to search:')
                if (text) addStep('text', text, `Text: ${text}`)
              }}
              className="btn-step"
            >
              + Text Contains
            </button>

            <button
              onClick={() => {
                const pos = prompt('Enter position (e.g., 1, 2, last()):')
                if (pos) addStep('position', pos, `Position: ${pos}`)
              }}
              className="btn-step"
            >
              + Position
            </button>

            <button
              onClick={() => {
                const custom = prompt('Enter custom XPath part:')
                if (custom) addStep('custom', custom, `Custom: ${custom}`)
              }}
              className="btn-step"
            >
              + Custom
            </button>
          </div>
        </div>

        {/* Steps List */}
        {steps.length > 0 && (
          <div className="steps-list">
            <h3>Steps ({steps.length})</h3>
            <ul>
              {steps.map((step, index) => (
                <li key={step.id} className="step-item">
                  <span className="step-number">{index + 1}</span>
                  <div className="step-info">
                    <span className="step-type">{step.type}</span>
                    <span className="step-description">{step.description}</span>
                  </div>
                  <button
                    onClick={() => removeStep(step.id)}
                    className="btn-remove"
                    title="Remove step"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="sidebar-actions">
          <button onClick={undo} disabled={steps.length === 0} className="btn-secondary">
            ↶ Undo
          </button>
          <button onClick={clearSteps} disabled={steps.length === 0} className="btn-secondary">
            🗑️ Clear All
          </button>
        </div>

        {/* Quick Templates */}
        <div className="quick-templates">
          <h3>Quick Templates</h3>
          <div className="template-buttons">
            <button
              onClick={() => setCurrentXPath('//a[@href]')}
              className="btn-template"
            >
              All Links
            </button>
            <button
              onClick={() => setCurrentXPath('//img[@src]')}
              className="btn-template"
            >
              All Images
            </button>
            <button
              onClick={() => setCurrentXPath('//button')}
              className="btn-template"
            >
              All Buttons
            </button>
            <button
              onClick={() => setCurrentXPath('//*[@class]')}
              className="btn-template"
            >
              Elements with Class
            </button>
          </div>
        </div>

        {/* Selected Element Info */}
        {selectedElement && (
          <div className="selected-info">
            <h3>Selected Element</h3>
            <div className="element-details">
              <p><strong>Tag:</strong> {selectedElement.tagName.toLowerCase()}</p>
              {selectedElement.id && <p><strong>ID:</strong> {selectedElement.id}</p>}
              {selectedElement.className && <p><strong>Class:</strong> {selectedElement.className}</p>}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

export default XPathSidebar
