import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { BrowserRouter } from "react-router-dom"
import { AuthoProvider } from './context/authContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SocketProvider } from './context/socketContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthoProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </AuthoProvider>
      <ToastContainer />
    </BrowserRouter>
  </React.StrictMode>
);

