import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img
          src="https://www.gehealthcare.com/cdn/res/images/logo.svg"
          className="App-logo"
          alt="GE Health NextGen Perinatal Logo"
        />
        <h1>Welcome to GE Health NextGen Perinatal</h1>
        <p>
          Your trusted platform for advanced perinatal care and health management.
        </p>
        <p>
          Explore our features designed to support expectant parents and healthcare providers:
        </p>
        <ul>
          <li>
            <a className="App-link" href="/features" rel="noopener noreferrer">
              Perinatal Care Features
            </a>
          </li>
          <li>
            <a className="App-link" href="/resources" rel="noopener noreferrer">
              Health Resources
            </a>
          </li>
          <li>
            <a className="App-link" href="/contact" rel="noopener noreferrer">
              Contact Support
            </a>
          </li>
        </ul>
        <p>
          For more information, visit our <a className="App-link" href="https://www.gehealthcare.com" target="_blank" rel="noopener noreferrer">website</a>.
        </p>
      </header>
    </div>
  );
}

export default App;
