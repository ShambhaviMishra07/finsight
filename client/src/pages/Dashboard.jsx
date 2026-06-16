import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-gray-900">
          Welcome, {user?.name}!
        </h1>
        <p className="text-gray-500 mt-2">Phase 1 complete. Dashboard coming in Phase 2.</p>
        <button
          onClick={logout}
          className="mt-6 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
}