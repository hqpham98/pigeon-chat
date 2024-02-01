import { Link, useNavigate } from 'react-router-dom';
import { FormEvent, useState, useContext, useEffect } from 'react';
import { AppContext } from '../components/AppContext';
import { Auth } from '../lib/types';

export function SigninForm() {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const appContext = useContext(AppContext);
  const handleSignIn = appContext.handleSignIn;
  const user = appContext.user;

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const loginInfo = Object.fromEntries(formData);
      const res = await fetch('/api/pigeon/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginInfo),
      });
      if (!res.ok) {
        throw new Error(`Oops. Response Code: ${res.status}`);
      }
      const auth: Auth = await res.json();
      handleSignIn(auth);
    } catch (err) {
      setMessage('' + (err as Error).message);
    }
  }

  return (
    <div className="flex bg-gray-700 min-h-screen justify-center">
      <form
        className="bg-[#303338] w-[40rem] p-10 form-control self-center rounded-md shadow-xl shadow-gray-800"
        onSubmit={handleSubmit}>
        {message && <p className="text-red-500">{message}</p>}
        <h1 className="text-white text-2xl font-bold text-center">
          Welcome Back
        </h1>
        <label className="text-[#B5BAC1] font-bold py-2 mb-2">
          Username
          <input
            className="input block w-full bg-[#1E1F22] font-medium"
            name="username"
            required
          />
        </label>
        <label className="text-[#B5BAC1] font-bold py-2 mb-2">
          Password
          <input
            className="input block w-full bg-[#1E1F22] font-medium"
            name="password"
            type="password"
            required
          />
        </label>
        <button
          className="bg-[#5865F2] rounded text-white font-bold text-lg mt-2 py-2"
          type="submit">
          Log In
        </button>
        <p className="text-[#949BA4] font-medium pt-2">
          Need an account?{' '}
          <Link to="/register" className="text-[#00A8FC]">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
