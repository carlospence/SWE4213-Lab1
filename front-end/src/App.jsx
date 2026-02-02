// src/App.jsx
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import Header from "./components/Header";
import AuthContainer from "./components/AuthContainer";
import ContactModal from "./components/ContactModal";
import Listings from "./components/Listings"; // 1. Import the new component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [myListings, setMyListings] = useState(false);

  function onLogout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setMyListings(false);
  }

  function parseJwt(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join(""),
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = parseJwt(token);
      if (payload && payload.exp * 1000 > Date.now()) {
        setIsLoggedIn(true);
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Toaster />
      {!isLoggedIn ? (
        <div className="flex-grow flex items-center justify-center px-6">
          <AuthContainer onLoginClick={() => setIsLoggedIn(true)} />
        </div>
      ) : (
        <>
          <Header setMyListings={setMyListings} onLogout={onLogout} />

          <main className="flex-grow px-[50px] py-10">
            <Listings
              onSelectItem={(item) => setSelectedItem(item)}
              myListings={myListings}
            />
          </main>

          <Footer />

          <ContactModal
            isOpen={!!selectedItem}
            onClose={() => setSelectedItem(null)}
            email={selectedItem?.owner_email}
            title={selectedItem?.title}
          />
        </>
      )}
    </div>
  );
}

export default App;
