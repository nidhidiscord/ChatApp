import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../store/authSlice';
import AuthCard from '../components/AuthCard';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Login() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => { dispatch(clearError()); }, [dispatch]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = (e) => { e.preventDefault(); dispatch(loginUser(form)); }; // Guest route redirects to dashboard

  return (
    <AuthCard title="Login" subtitle="Welcome back, sign in to continue">
      <form onSubmit={onSubmit} className="space-y-4">
        <Input variant="dark" label="Email" type="email" name="email" value={form.email} onChange={onChange} required />
        <Input variant="dark" label="Password" type="password" name="password" value={form.password} onChange={onChange} required />
        {error && <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
        <Button variant="dark" type="submit" loading={loading} className="w-full">Login</Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-400">
        New here? <Link to="/signup" className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline">Create new account</Link>
      </p>
    </AuthCard>
  );
}
