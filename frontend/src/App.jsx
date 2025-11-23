import { useState, useEffect } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [endpoints] = useState([
    { name: 'Strict', path: '/api/strict', limit: 5, color: '#ef4444' },
    { name: 'Moderate', path: '/api/moderate', limit: 10, color: '#f59e0b' },
    { name: 'Generous', path: '/api/generous', limit: 20, color: '#10b981' }
  ]);

  const [endpointStats, setEndpointStats] = useState({});
  const [loading, setLoading] = useState({});
  const [messages, setMessages] = useState({});
  const [requestHistory, setRequestHistory] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEndpointStats(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(path => {
          if (updated[path].resetTime && Date.now() >= updated[path].resetTime) {
          // Time has expired, clear the stats so user can make new requests
            delete updated[path];
          }
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const makeRequest = async (endpoint) => {
    setLoading(prev => ({ ...prev, [endpoint.path]: true }));
    
    try {
      const response = await fetch(`${API_URL}${endpoint.path}`);
      const data = await response.json();
      
      if (response.ok) {
        setEndpointStats(prev => ({
          ...prev,
          [endpoint.path]: {
            limit: data.limit,
            remaining: data.remaining,
            resetTime: data.resetTime,
            used: data.limit - data.remaining
          }
        }));
        setMessages(prev => ({
          ...prev,
          [endpoint.path]: { type: 'success', text: data.message }
        }));
        setRequestHistory(prev => [{
          time: new Date().toLocaleTimeString(),
          endpoint: endpoint.name,
          status: 'success',
          message: data.message
        }, ...prev].slice(0, 20));
      } else {
        setMessages(prev => ({
          ...prev,
          [endpoint.path]: { type: 'error', text: data.message }
        }));
        setRequestHistory(prev => [{
          time: new Date().toLocaleTimeString(),
          endpoint: endpoint.name,
          status: 'error',
          message: data.message
        }, ...prev].slice(0, 20));
      }
    } catch (error) {
      setMessages(prev => ({
        ...prev,
        [endpoint.path]: { type: 'error', text: 'Failed to connect to API' }
      }));
      setRequestHistory(prev => [{
        time: new Date().toLocaleTimeString(),
        endpoint: endpoint.name,
        status: 'error',
        message: 'Failed to connect to API'
      }, ...prev].slice(0, 20));
    } finally {
      setLoading(prev => ({ ...prev, [endpoint.path]: false }));
    }
  };

  const getTimeRemaining = (resetTime) => {
    if (!resetTime) return null;
    const now = Date.now();
    const seconds = Math.max(0, Math.ceil((resetTime - now) / 1000));
    return seconds > 0 ? seconds : null;
  };

  const getProgressPercentage = (stats) => {
    if (!stats) return 0;
    return (stats.used / stats.limit) * 100;
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Rate Limiter Dashboard</h1>
        <p className="subtitle">Visual demonstration of API rate limiting</p>
      </header>

      <div className="info-box">
        <h3>What is Rate Limiting?</h3>
        <p>
          Rate limiting controls how many requests can be made to an API within a time window.
          This prevents abuse, manages server load, and ensures fair resource allocation.
        </p>
        <p className="demo-info">
          Try clicking the buttons below to see rate limiting in action. Each endpoint has different limits.
        </p>
      </div>

      <div className="endpoints-container">
        {endpoints.map(endpoint => {
          const stats = endpointStats[endpoint.path];
          const message = messages[endpoint.path];
          const timeRemaining = stats ? getTimeRemaining(stats.resetTime) : null;
          const progressPercentage = getProgressPercentage(stats);
          const isLimitReached = stats && stats.remaining === 0;

          return (
            <div key={endpoint.path} className="endpoint-card">
              <div className="endpoint-header">
                <h2>{endpoint.name} Endpoint</h2>
                <span className="limit-badge" style={{ backgroundColor: endpoint.color }}>
                  {endpoint.limit} requests/min
                </span>
              </div>

              <div className="stats-section">
                {stats ? (
                  <>
                    <div className="stat">
                      <span className="stat-label">Requests Used:</span>
                      <span className="stat-value">{stats.used} / {stats.limit}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Remaining:</span>
                      <span className="stat-value">{stats.remaining}</span>
                    </div>
                    {timeRemaining !== null && timeRemaining > 0 && (
                      <div className="stat">
                        <span className="stat-label">Resets in:</span>
                        <span className="stat-value">{timeRemaining}s</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="stat">
                    <span className="stat-label">No requests made yet</span>
                  </div>
                )}
              </div>

              <div className="progress-container">
                <div 
                  className="progress-bar"
                  style={{ 
                    width: `${progressPercentage}%`,
                    backgroundColor: endpoint.color,
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>

              <button
                onClick={() => makeRequest(endpoint)}
                disabled={loading[endpoint.path] || isLimitReached}
                className={`request-button ${isLimitReached ? 'disabled' : ''}`}
                style={{ 
                  backgroundColor: isLimitReached ? '#9ca3af' : endpoint.color 
                }}
              >
                {loading[endpoint.path] ? 'Sending...' : 
                 isLimitReached ? 'Limit Reached' : 'Make Request'}
              </button>

              {message && (
                <div className={`message ${message.type}`}>
                  {message.text}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {requestHistory.length > 0 && (
        <div className="history-section">
          <h2>Request History</h2>
          <div className="history-log">
            {requestHistory.map((entry, index) => (
              <div key={index} className={`history-entry ${entry.status}`}>
                <span className="history-time">{entry.time}</span>
                <span className="history-endpoint">{entry.endpoint}</span>
                <span className="history-message">{entry.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <footer className="footer">
        <p>Built by Lars (Demonstrating production-ready backend concepts)</p>
      </footer>
    </div>
  );
}

export default App;