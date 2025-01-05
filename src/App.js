import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './components/HomePage';
import Topbar from "./global/TopBar";
import Sidebar from "./global/SideBar";
import ComicDetail from './components/ComicDetail';
import InforPage from './components/InforPage';
import ChapterImg from './components/ChapterImg';
import Login from "./components/Login";
import Signup from "./components/Signup";
import AddComic from './components/AddComic';
import ComicList from './components/ComicList';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./Theme";

const AppContent = () => {
  const location = useLocation(); // Get the current location
  const [isSidebar, setIsSidebar] = useState(true);
  const [comics, setComics] = useState([]); // List of comics

  const addComic = (comic) => {
    // Save the comic cover locally or on a server
    const newComic = { ...comic, coverUrl: URL.createObjectURL(comic.cover) };
    setComics([...comics, newComic]); // Add new comic to the list
  };

  // Define paths where Sidebar and Topbar should not be rendered
  const noLayoutPaths = ["/", "/signup"];

  const showLayout = !noLayoutPaths.includes(location.pathname);

  return (
    <div className="app">
      {showLayout && <Sidebar isSidebar={isSidebar} />}
      <main className="content">
        {showLayout && <Topbar setIsSidebar={setIsSidebar} />}
        <PayPalScriptProvider options={{ "client-id": "" }}>
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/comic/:slug" element={<InforPage />} />
            <Route path="/chapter/:chapterName" element={<ChapterImg />} />
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/add-comic" element={<AddComic addComic={addComic} />} />
            <Route path="/comics" element={<ComicList comics={comics} />} />
          </Routes>
        </PayPalScriptProvider>
      </main>
    </div>
  );
};

const App = () => {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
          <AppContent />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
