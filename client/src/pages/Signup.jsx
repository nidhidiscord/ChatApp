import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, clearError } from '../store/authSlice';
import AuthCard from '../components/AuthCard';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => { dispatch(clearError()); }, [dispatch]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(signupUser(form));
    if (signupUser.fulfilled.match(res)) navigate('/login'); // success -> login page
  };

  return (
    <AuthCard title="Sign Up" subtitle="Create an account to start chatting">
      <form onSubmit={onSubmit} className="space-y-4">
        <Input variant="dark" label="Email" type="email" name="email" value={form.email} onChange={onChange} required />
        <Input variant="dark" label="Password" type="password" name="password" value={form.password} onChange={onChange} minLength={6} required />
        {error && <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
        <Button variant="dark" type="submit" loading={loading} className="w-full">Sign Up</Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account? <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline">Login</Link>
      </p>
    </AuthCard>
  );
}
