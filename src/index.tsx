import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import emailjs from '@emailjs/browser';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);

emailjs.init('Jules');

// Register Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
}