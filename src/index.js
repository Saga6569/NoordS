import ReactDOM from 'react-dom';

import reportWebVitals from './reportWebVitals';
import React from 'react';
import App from './App.js';

const Init = async () => {
  return ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

reportWebVitals();
Init();