import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Brain, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';
import { Button, Input, Spinner } from '../../components/ui';
import useAuthStore from '../../store/authStore';
import api from '../../lib/axios';
import { ROLE_DASHBOARDS } from '../../utils/roleGuard';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const setAuth = useAuthStore(s => s.setAuth);

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirect = new URLSearchParams(location.search).get('redirect');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', {
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      setAuth(data);

      if (data.user.mustResetPassword) {
        navigate('/reset-password');
        return;
      }

      const dest = redirect || ROLE_DASHBOARDS[data.user.role] || '/';
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] flex-shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0f1c19 0%, #162a26 50%, #0a1311 100%)' }}>

        {/* Decorative circles */}
        <div className="absolute top-[-60px] right-[-60px] w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #1C3F39, transparent)' }} />
        <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #C19B6C, transparent)' }} />

        <div className="p-10">
          <div className="mb-12">
            <img src="/assets/logo_full.png" alt="Intel Counselling" className="h-20 w-auto object-contain" />
          </div>

          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Supporting student<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #1C3F39, #C19B6C)' }}>
              mental health
            </span>
          </h2>
          <p className="text-primary-300 text-lg leading-relaxed">
            A comprehensive platform connecting students, families, and mental health professionals.
          </p>
        </div>

        <div className="p-10">


          <p className="text-primary-500 text-sm">
            © {new Date().getFullYear()} Intel Counselling. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right: Login form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-surface-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden">
            <img src="/assets/logo_full.png" alt="Intel Counselling" className="h-12 w-auto object-contain" />
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-surface-900 mb-2">Welcome back</h1>
            <p className="text-surface-500">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <span className="text-red-500 text-lg">⚠️</span>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="email"
                  id="email"
                  autoComplete="email"
                  required
                  placeholder="you@school.edu"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="form-input !pl-11"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-surface-700">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  required
                  placeholder="Your password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="form-input !pl-11 !pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
              Sign In
            </Button>
          </form>


        </div>
      </div>
    </div>
  );
}
