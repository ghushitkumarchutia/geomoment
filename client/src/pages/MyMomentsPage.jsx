import { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import useAuthStore from '../store/authStore';
import * as userService from '../services/userService';
import * as momentService from '../services/momentService';
import PageWrapper from '../components/layout/PageWrapper';
import MomentCard from '../components/moments/MomentCard';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { noteRules } from '../utils/validators';

const NOTE_MAX = noteRules.maxLength.value;

export default function MyMomentsPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { enqueueSnackbar } = useSnackbar();

  const [moments, setMoments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const [editingMoment, setEditingMoment] = useState(null);
  const [editNote, setEditNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMoments = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        const res = await userService.getMyMoments(page, 20);
        setMoments(res.data.moments);
        setPagination(res.data.pagination);
      } catch (err) {
        enqueueSnackbar(err.message, { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    },
    [enqueueSnackbar]
  );

  useEffect(() => {
    if (isAuthenticated) fetchMoments();
  }, [isAuthenticated, fetchMoments]);

  const handleEdit = (moment) => {
    setEditingMoment(moment);
    setEditNote(moment.note || '');
  };

  const handleSaveEdit = async () => {
    if (!editingMoment) return;
    setIsSaving(true);
    try {
      await momentService.updateMoment(editingMoment._id, { note: editNote });
      setMoments((prev) =>
        prev.map((m) => (m._id === editingMoment._id ? { ...m, note: editNote } : m))
      );
      setEditingMoment(null);
      enqueueSnackbar('Note updated', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await momentService.deleteMoment(deletingId);
      setMoments((prev) => prev.filter((m) => m._id !== deletingId));
      setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
      setDeletingId(null);
      enqueueSnackbar('Moment deleted', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isAuthenticated) return <Navigate to="/" replace />;

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">My Moments</h1>
          <p className="text-[13px] text-white/50 mt-1">
            {pagination.total} moment{pagination.total !== 1 ? 's' : ''} submitted
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" className="text-white/30" />
        </div>
      ) : moments.length === 0 ? (
        <div className="bg-white/4 border border-white/6 rounded-[28px] p-12 text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-white/40"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <p className="text-[14px] font-medium text-white/70">
            You haven't tagged any locations yet.
          </p>
          <p className="text-[13px] text-white/40 mt-1.5">
            Go to the map and click anywhere to start tagging.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {moments.map((m) => (
              <MomentCard
                key={m._id}
                moment={m}
                actions={
                  <>
                    <button
                      type="button"
                      onClick={() => handleEdit(m)}
                      className="p-1.5 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      aria-label="Edit note"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingId(m._id)}
                      className="p-1.5 rounded-full text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      aria-label="Delete moment"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </>
                }
              />
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="ghost"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => fetchMoments(pagination.page - 1)}
              >
                Previous
              </Button>
              <span className="text-[12px] font-medium text-white/50 tabular-nums">
                {pagination.page} / {pagination.pages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={pagination.page >= pagination.pages}
                onClick={() => fetchMoments(pagination.page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <Modal isOpen={!!editingMoment} onClose={() => setEditingMoment(null)} title="Edit Note">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2 ml-1">
            <label htmlFor="edit-note" className="text-[13px] font-medium text-white/90">
              Note
            </label>
            <span
              className={[
                'text-[11px] tabular-nums',
                editNote.length > NOTE_MAX ? 'text-red-400' : 'text-white/40',
              ].join(' ')}
            >
              {editNote.length}/{NOTE_MAX}
            </span>
          </div>
          <textarea
            id="edit-note"
            value={editNote}
            onChange={(e) => setEditNote(e.target.value)}
            maxLength={NOTE_MAX}
            rows={3}
            className="w-full bg-white/2 border border-white/6 rounded-2xl px-4 py-3 text-[13px] text-white/90 placeholder:text-white/30 focus:outline-none focus:border-white/20 focus:bg-white/4 transition-colors duration-200 resize-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
          />
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setEditingMoment(null)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} isLoading={isSaving} className="flex-1">
            Save
          </Button>
        </div>
      </Modal>

      <Modal isOpen={!!deletingId} onClose={() => setDeletingId(null)} title="Delete Moment">
        <p className="text-[14px] text-white/70 mb-6 ml-1">
          This action cannot be undone. This moment will be permanently removed.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setDeletingId(null)} className="flex-1">
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={isDeleting} className="flex-1">
            Delete
          </Button>
        </div>
      </Modal>
    </PageWrapper>
  );
}
