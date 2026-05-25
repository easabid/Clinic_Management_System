'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { authApi } from '../../../lib/api';
import { parseError } from '../../../lib/parseError';
import { useAuth } from '../../../context/AuthContext';

export default function ChangePasswordPage() {
  const { logout } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = {};
    if (!form.currentPassword.trim()) {
      nextErrors.currentPassword = 'Current password is required';
    }
    if (!form.newPassword || form.newPassword.length < 6) {
      nextErrors.newPassword = 'New password must be at least 6 characters';
    }
    if (!form.confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your new password';
    } else if (form.newPassword !== form.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitError('');
    setIsLoading(true);

    try {
      const res = await authApi.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success(res.data.message || 'Password changed successfully. Please log in again.');
      setTimeout(() => logout(), 350);
    } catch (err) {
      const message = parseError(err);
      setSubmitError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
          <p className="text-gray-500 mt-1 text-sm">Update your password from the dashboard.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {submitError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {submitError}
              </div>
            )}

            <Input
              label="Current password"
              type="password"
              placeholder="Enter current password"
              value={form.currentPassword}
              onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))}
              error={fieldErrors.currentPassword}
              autoComplete="current-password"
            />
            <Input
              label="New password"
              type="password"
              placeholder="Min. 6 characters"
              value={form.newPassword}
              onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
              error={fieldErrors.newPassword}
              autoComplete="new-password"
            />
            <Input
              label="Confirm new password"
              type="password"
              placeholder="Repeat your new password"
              value={form.confirmPassword}
              onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
              error={fieldErrors.confirmPassword}
              autoComplete="new-password"
            />

            <Button type="submit" isLoading={isLoading} size="lg" className="w-full mt-2">
              {isLoading ? 'Updating password...' : 'Change password'}
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}