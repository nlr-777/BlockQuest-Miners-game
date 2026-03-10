import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { GameProvider } from "./context/GameContext";

// Pages
import StartScreen from "./pages/StartScreen";
import Level1 from "./pages/Level1";
import Level2 from "./pages/Level2";
import Level3 from "./pages/Level3";
import Level4 from "./pages/Level4";
import Level5 from "./pages/Level5";
import QuestComplete from "./pages/QuestComplete";

function App() {
  return (
    <div className="App min-h-screen bg-gradient-to-b from-background to-background-dark">
      <GameProvider>
        <Toaster 
          position="top-center" 
          richColors
          toastOptions={{
            style: {
              fontFamily: '"Space Mono", monospace',
              background: '#1E293B',
              border: '2px solid #00F0FF',
              color: '#fff',
            },
          }}
        />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<StartScreen />} />
            <Route path="/level/1" element={<Level1 />} />
            <Route path="/level/2" element={<Level2 />} />
            <Route path="/level/3" element={<Level3 />} />
            <Route path="/level/4" element={<Level4 />} />
            <Route path="/level/5" element={<Level5 />} />
            <Route path="/complete" element={<QuestComplete />} />
          </Routes>
        </BrowserRouter>
      </GameProvider>
    </div>
  );
}

export default App;
