'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { authApi } from '../../../lib/api';
import { parseError } from '../../../lib/parseError';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Email is required');
      return;
    }

    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const res = await authApi.forgotPassword({ email });
      setMessage(res.data.message);
      toast.success('Reset link sent if the email exists.');
    } catch (err) {
      const message = parseError(err);
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Link href="/login" className="inline-flex items-center gap-2 mb-6">
          <span className="text-3xl">🏥</span>
          <span className="text-2xl font-bold text-blue-700">ClinicMS</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Forgot password</h1>
        <p className="text-gray-500 mt-1 text-sm">We&apos;ll send a reset link to your email</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {message && (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </div>
          )}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <Button type="submit" isLoading={isLoading} size="lg" className="w-full mt-2">
            {isLoading ? 'Sending link...' : 'Send reset link'}
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        Remembered your password?{' '}
        <Link href="/login" className="text-blue-600 font-medium hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}