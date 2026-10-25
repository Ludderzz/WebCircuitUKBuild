import React from 'react';
import { createRoot } from 'react-dom/client';
import Landing from './Landing.jsx';
import Admin from './Admin.jsx';
import { Terms, Privacy } from './Legal.jsx';
import './styles.css';

const p = window.location.pathname;
const Page = p.startsWith('/admin') ? Admin : p.startsWith('/terms') ? Terms : p.startsWith('/privacy') ? Privacy : Landing;
createRoot(document.getElementById('root')).render(<Page />);
