import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]   = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Create account</h1>
        <p className="text-gray-500 text-sm mb-6">Start tracking your finances with Finsight</p>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm px-4 py-2 rounded-lg mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {['name', 'email', 'password'].map((field) => (
            <div key={field}>
              <label className="text-sm font-medium text-gray-700 block mb-1 capitalize">{field}</label>
              <input
                type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                required
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder={field === 'name' ? 'Your name' : field === 'email' ? 'you@example.com' : '••••••••'}
              />
            </div>
          ))}
          <button
            type="submit" disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}