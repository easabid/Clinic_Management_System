'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import Card from '../../../../components/ui/Card';
import Badge from '../../../../components/ui/Badge';
import Button from '../../../../components/ui/Button';
import Modal from '../../../../components/ui/Modal';
import { SkeletonTable } from '../../../../components/ui/Skeleton';
import { usersApi } from '../../../../lib/api';
import { parseError } from '../../../../lib/parseError';

function roleVariant(role) {
  return role === 'admin' ? 'warning' : role === 'doctor' ? 'info' : 'success';
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [search, setSearch] = useState('');

  const load = async () => {
    try {
      const res = await usersApi.getAll();
      setUsers(res.data);
    } catch (err) {
      toast.error(parseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await usersApi.delete(deleteId);
      toast.success('User deleted successfully');
      setDeleteId(null);
      load();
    } catch (err) {
      toast.error(parseError(err));
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = users.filter((u) =>
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white w-64"
          />
        </div>

        <Card>
          {isLoading ? <SkeletonTable rows={7} /> : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">👥</p>
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Role</th>
                    <th className="pb-3 font-medium">Phone</th>
                    <th className="pb-3 font-medium">Joined</th>
                    <th className="pb-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="py-4 font-medium text-gray-900">{u.fullName}</td>
                      <td className="py-4 text-gray-500">{u.email}</td>
                      <td className="py-4">
                        <Badge label={u.role} variant={roleVariant(u.role)} />
                      </td>
                      <td className="py-4 text-gray-500">{u.phone || '—'}</td>
                      <td className="py-4 text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        {u.role !== 'admin' && (
                          <Button size="sm" variant="danger"
                            onClick={() => setDeleteId(u.id)}>
                            Delete
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete User"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" isLoading={isDeleting} onClick={handleDelete}>
              Delete User
            </Button>
          </>
        }
      >
        <p className="text-gray-600 text-sm">
          This action cannot be undone. The user and all their data will be
          permanently removed from the system.
        </p>
      </Modal>
    </DashboardLayout>
  );
}