import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes';
import Navbar from './components/Navbar';
import './bootstrap-5.1.0-dist/css/bootstrap.min.css';
import './bootstrap-5.1.0-dist/js/bootstrap.bundle.js';


export default function App() {
return (
<Router>
<AuthProvider>
<Navbar />
<main style={{ padding: '1rem' }}>
<AppRoutes />
</main>
</AuthProvider>
</Router>
);
}