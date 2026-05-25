'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { authApi } from '../../../lib/api';
import { parseError } from '../../../lib/parseError';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

export default function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setSubmitError('Reset token is missing or invalid. Please request a new link.');
      return;
    }

    const nextError = {};
    if (!form.password || form.password.length < 6) {
      nextError.password = 'Password must be at least 6 characters';
    }
    if (!form.confirmPassword) {
      nextError.confirmPassword = 'Please confirm your password';
    } else if (form.password !== form.confirmPassword) {
      nextError.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(nextError);
    if (Object.keys(nextError).length) return;

    setSubmitError('');
    setIsLoading(true);

    try {
      await authApi.resetPassword({ token, password: form.password });
      toast.success('Password reset successfully. Please sign in.');
      router.push('/login');
    } catch (err) {
      const message = parseError(err);
      setSubmitError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center space-y-4">
          <div>
            <span className="text-4xl">🔒</span>
            <h1 className="text-2xl font-bold text-gray-900 mt-3">Invalid reset link</h1>
            <p className="text-gray-500 mt-1 text-sm">
              The reset link is missing or expired. Request a new one.
            </p>
          </div>
          <Link
            href="/forgot-password"
            className="inline-flex justify-center px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Request new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Link href="/login" className="inline-flex items-center gap-2 mb-6">
          <span className="text-3xl">🏥</span>
          <span className="text-2xl font-bold text-blue-700">ClinicMS</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Set new password</h1>
        <p className="text-gray-500 mt-1 text-sm">Choose a new password for your account</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {submitError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          )}
          <Input
            label="New password"
            type="password"
            placeholder="Min. 6 characters"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            error={fieldErrors.password}
            autoComplete="new-password"
          />
          <Input
            label="Confirm password"
            type="password"
            placeholder="Repeat your new password"
            value={form.confirmPassword}
            onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
            error={fieldErrors.confirmPassword}
            autoComplete="new-password"
          />
          <Button type="submit" isLoading={isLoading} size="lg" className="w-full mt-2">
            {isLoading ? 'Updating password...' : 'Reset password'}
          </Button>
        </form>
      </div>
    </div>
  );
}