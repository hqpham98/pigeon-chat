import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <div className="bg-gray-700 min-h-screen">
      <div className="container px-2 mx-auto">
        <div className="flex basis-full justify-center pt-[25%]">
          <h1 className="font-medium text-5xl text-white">Pigeon</h1>
        </div>
        <div className="flex basis-full justify-center py-4">
          <Link to="/login">
            <button className="btn btn-sm btn-primary mr-2">Login</button>
          </Link>
          <Link to="/register">
            <button className="btn btn-sm btn-primary">Signup</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
