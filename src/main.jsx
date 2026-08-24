import React from 'react';
import ReactDOM from 'react-dom/client';
// Defer FontAwesome loading to improve FCP and TTI
setTimeout(() => {
  import('@fortawesome/fontawesome-free/css/all.min.css');
}, 100);
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './store';
import App from './App';
import Navbar from './components/Navbar';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <div className="min-h-screen bg-white">
          <Navbar />
          <App />
        </div>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
