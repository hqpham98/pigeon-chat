// import { useEffect, useState } from 'react';
import './App.css';
import { LandingPage } from './LandingPage';
import { SignupForm } from './SignupForm';
import { SigninForm } from './SigninForm';
import { Route, Routes } from 'react-router-dom';
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<SignupForm />} />
      <Route path="/login" element={<SigninForm />} />
    </Routes>
  );
}
