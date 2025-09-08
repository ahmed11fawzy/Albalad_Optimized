import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h2>Oops! Something went wrong</h2>
            <p>We're sorry, but something unexpected happened.</p>
            <button
              onClick={() => window.location.reload()}
              className="retry-button"
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === "development" && this.state.errorInfo && (
              <details className="error-details">
                <summary>Error Details (Development Mode)</summary>
                <pre>{this.state.error && this.state.error.toString()}</pre>
                <pre>{this.state.errorInfo.componentStack}</pre>
              </details>
            )}
          </div>
          <style jsx>{`
            .error-boundary {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              padding: 2rem;
              background-color: #f8f9fa;
            }
            
            .error-content {
              text-align: center;
              max-width: 600px;
              background: white;
              padding: 3rem 2rem;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            
            .error-content h2 {
              color: #e74c3c;
              margin-bottom: 1rem;
              font-size: 2rem;
            }
            
            .error-content p {
              color: #666;
              margin-bottom: 2rem;
              font-size: 1.1rem;
            }
            
            .retry-button {
              background-color: #3498db;
              color: white;
              border: none;
              padding: 12px 24px;
              font-size: 1rem;
              border-radius: 4px;
              cursor: pointer;
              transition: background-color 0.3s ease;
            }
            
            .retry-button:hover {
              background-color: #2980b9;
            }
            
            .error-details {
              margin-top: 2rem;
              text-align: left;
              background-color: #f8f9fa;
              padding: 1rem;
              border-radius: 4px;
              border: 1px solid #dee2e6;
            }
            
            .error-details summary {
              cursor: pointer;
              font-weight: bold;
              margin-bottom: 1rem;
            }
            
            .error-details pre {
              font-size: 0.9rem;
              color: #e74c3c;
              white-space: pre-wrap;
              margin: 0.5rem 0;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;