import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ProcessPage } from './pages/ProcessPage';
import { DownloadPage } from './pages/DownloadPage';
import { AlgorithmInfo } from './pages/AlgorithmInfo';
import { Navbar } from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen animated-bg">
        <div className="min-h-screen bg-gradient-to-b from-black/80 to-transparent backdrop-blur-[2px]">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/algorithm/:method" element={<AlgorithmInfo />} />
            <Route path="/process/:method" element={<ProcessPage />} />
            <Route path="/download" element={<DownloadPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App