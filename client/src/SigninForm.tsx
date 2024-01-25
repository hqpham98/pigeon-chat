import { Link } from 'react-router-dom';

export function SigninForm() {
  return (
    <div className="flex bg-gray-700 min-h-screen justify-center">
      <form className="bg-[#303338] w-[40rem] p-10 form-control self-center rounded-md shadow-xl shadow-gray-800">
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
