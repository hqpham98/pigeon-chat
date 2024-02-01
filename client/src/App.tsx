// import { useEffect, useState } from 'react';
import './App.css';
import { LandingPage } from './pages/LandingPage';
import { SignupForm } from './pages/SignupForm';
import { SigninForm } from './pages/SigninForm';
import { Route, Routes } from 'react-router-dom';
import { User, Auth } from './lib/types';
import { AppContext } from './components/AppContext';
import { MainScreen } from './MainScreen';
import { Home } from './pages/Home';
import { useEffect, useState } from 'react';

export default function App() {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>();
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [isAuthorizing, setIsAuthorizing] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      const a = JSON.parse(auth);
      setUser(a.user);
      setToken(a.token);
      setLoggedIn(true);
    }
    setIsAuthorizing(false);
  }, []);

  if (isAuthorizing) return null;

  function handleSignIn(auth: Auth) {
    localStorage.setItem('auth', JSON.stringify(auth));
    setUser(auth.user);
    setToken(auth.token);
    setLoggedIn(true);
  }

  function handleSignOut() {
    localStorage.removeItem('auth');
    setUser(undefined);
    setToken(undefined);
    setLoggedIn(false);
  }

  const contextValue = { user, token, handleSignIn, handleSignOut };
  return (
    <AppContext.Provider value={contextValue}>
      <Routes>
        <Route path="/" element={loggedIn ? <Home /> : <LandingPage />} />
        <Route path="/register" element={<SignupForm />} />
        <Route path="/login" element={<SigninForm />} />
      </Routes>
    </AppContext.Provider>
  );
}
