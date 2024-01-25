import { useState } from 'react';
import { Link } from 'react-router-dom';

export function SignupForm() {
  const [username, setUser] = useState();
  const [password, setPass] = useState();
  const [email, setEmail] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();

  return (
    <div className="flex bg-gray-700 min-h-screen justify-center">
      <form className="bg-[#303338] w-[40rem] p-10 form-control self-center rounded-md shadow-xl shadow-gray-800">
        <h1 className="text-white text-2xl font-bold text-center">
          Create an account
        </h1>
        <label className="text-[#B5BAC1] font-bold py-2 mb-2">
          Email
          <input
            className="input block w-full bg-[#1E1F22] font-medium"
            name="email"
            type="email"
            required
          />
        </label>
        <label className="text-[#B5BAC1] font-bold py-2 mb-2">
          First Name
          <input
            className="input block w-full bg-[#1E1F22] font-medium"
            name="firstName"
            required
          />
        </label>
        <label className="text-[#B5BAC1] font-bold py-2 mb-2">
          Last Name
          <input
            className="input block w-full bg-[#1E1F22] font-medium"
            name="lastName"
            required
          />
        </label>
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
          className="bg-[#5865F2] rounded text-white font-bold text-lg my-2 py-2"
          type="submit">
          Signup
        </button>
        <p className="text-[#949BA4] font-medium pt-2">
          <Link to="/login" className="text-[#00A8FC]">
            Already have an account?
          </Link>
        </p>
      </form>
    </div>
  );
}
