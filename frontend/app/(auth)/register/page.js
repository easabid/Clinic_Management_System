'use client';
import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { authApi } from '../../../lib/api';
import { parseError } from '../../../lib/parseError';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const roles = [
  { value: 'patient', label: 'Patient', icon: '🤒', desc: 'Book and manage appointments' },
  { value: 'doctor', label: 'Doctor', icon: '👨‍⚕️', desc: 'Manage your schedule' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'patient',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email) e.email = 'Email is required';
    if (!form.password || form.password.length < 6)
      e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await authApi.register(form);
      toast.success('Account created! Please sign in.');
      router.push('/login');
    } catch (err) {
      toast.error(parseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <span className="text-3xl">🏥</span>
          <span className="text-2xl font-bold text-blue-700">ClinicMS</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
        <p className="text-gray-500 mt-1 text-sm">Join ClinicMS today</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Role selector */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">I am a</label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, role: r.value }))}
                  className={`flex flex-col items-center gap-1 p-4 rounded-xl border-2
                    text-center transition-all duration-150 cursor-pointer
                    ${form.role === r.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <span className="text-2xl">{r.icon}</span>
                  <span className="text-sm font-semibold text-gray-800">{r.label}</span>
                  <span className="text-xs text-gray-400">{r.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Full name"
            placeholder="John Doe"
            value={form.fullName}
            onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
            error={errors.fullName}
          />
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            error={errors.email}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Min. 6 characters"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            error={errors.password}
          />
          <Input
            label="Phone (optional)"
            type="tel"
            placeholder="+8801700000000"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />

          <Button type="submit" isLoading={isLoading} size="lg" className="w-full">
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}