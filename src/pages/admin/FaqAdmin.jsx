import React, { useEffect, useMemo, useState } from 'react';
import { db } from '../../firebase.js';
import {
  collection, getDocs, addDoc, deleteDoc, updateDoc,
  doc, serverTimestamp, query, orderBy,
} from 'firebase/firestore';
import {
  HelpCircle, Plus, Trash2, Loader2, AlertCircle, MessageCircleQuestion,
  Pencil, X, Save, CheckCircle2, Search, CalendarCheck, Stethoscope,
  HeartPulse, ShieldPlus, Sparkles, LayoutGrid, Filter, ArrowUpRight,
} from 'lucide-react';

const CATEGORY_OPTIONS = [
  { key: 'general',     label: 'General',      icon: MessageCircleQuestion },
  { key: 'appointment', label: 'Appointments', icon: CalendarCheck },
  { key: 'treatment',   label: 'Treatments',   icon: Stethoscope },
  { key: 'insurance',   label: 'Insurance',    icon: ShieldPlus },
  { key: 'emergency',   label: 'Emergency',    icon: HeartPulse },
];

const catMeta = (key) =>
  CATEGORY_OPTIONS.find((c) => c.key === key) || CATEGORY_OPTIONS[0];

const FaqAdmin = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('general');

  const [editingId, setEditingId] = useState(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [editCategory, setEditCategory] = useState('general');

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  // ------ Fetch ------
  const fetchFaqs = async () => {
    setLoading(true);
    setError('');
    try {
      const q = query(collection(db, 'faqs'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setFaqs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
      setError('Failed to load FAQs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFaqs(); }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  // ------ Actions ------
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'faqs'), {
        question: question.trim(),
        answer: answer.trim(),
        category,
        createdAt: serverTimestamp(),
      });
      setQuestion(''); setAnswer(''); setCategory('general');
      setToast('FAQ added successfully');
      fetchFaqs();
    } catch (err) {
      console.error(err);
      setError('Failed to add FAQ.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this FAQ?')) return;
    try {
      await deleteDoc(doc(db, 'faqs', id));
      setToast('FAQ deleted');
      setFaqs((p) => p.filter((f) => f.id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to delete FAQ.');
    }
  };

  const startEdit = (f) => {
    setEditingId(f.id);
    setEditQuestion(f.question);
    setEditAnswer(f.answer);
    setEditCategory(f.category || 'general');
  };
  const cancelEdit = () => setEditingId(null);

  const saveEdit = async (id) => {
    if (!editQuestion.trim() || !editAnswer.trim()) return;
    try {
      await updateDoc(doc(db, 'faqs', id), {
        question: editQuestion.trim(),
        answer: editAnswer.trim(),
        category: editCategory,
      });
      setToast('FAQ updated');
      setEditingId(null);
      fetchFaqs();
    } catch (err) {
      console.error(err);
      setError('Failed to update FAQ.');
    }
  };

  // ------ Derived ------
  const counts = useMemo(() => {
    const c = { all: faqs.length };
    CATEGORY_OPTIONS.forEach((o) => (c[o.key] = 0));
    faqs.forEach((f) => { c[f.category || 'general'] = (c[f.category || 'general'] || 0) + 1; });
    return c;
  }, [faqs]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return faqs.filter((f) => {
      const matchCat = filter === 'all' || (f.category || 'general') === filter;
      const matchSearch = !s ||
        f.question?.toLowerCase().includes(s) ||
        f.answer?.toLowerCase().includes(s);
      return matchCat && matchSearch;
    });
  }, [faqs, filter, search]);

  // ============================== RENDER ==============================
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white shadow-xl text-sm font-medium">
          <CheckCircle2 className="w-4 h-4" /> {toast}
        </div>
      )}

      {/* Header */}
   

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-2 grid gap-8 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        {/* ---------- Composer ---------- */}
        <aside className="lg:sticky lg:top-6 self-start">
          <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-br from-sky-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white grid place-items-center shrink-0">
                  <Plus className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-black text-lg leading-tight">Add New FAQ</h2>
                  <p className="text-xs text-slate-500">Publish instantly to the public FAQ page</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleAdd} className="p-5 sm:p-6 space-y-4">
              {/* Category */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_OPTIONS.map((c) => {
                    const Icon = c.icon;
                    const active = category === c.key;
                    return (
                      <button
                        type="button"
                        key={c.key}
                        onClick={() => setCategory(c.key)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          active
                            ? 'bg-slate-900 text-white border-slate-900 shadow'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" /> {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Question</label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. What are your consultation hours?"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Answer</label>
                  <span className="text-[10px] text-slate-400">{answer.length} chars</span>
                </div>
                <textarea
                  rows={5}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Write a clear, patient-friendly response…"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm uppercase tracking-widest disabled:opacity-60 transition-all"
              >
                {submitting ? (<><Loader2 className="w-4 h-4 animate-spin" /> Publishing…</>) : (<><Plus className="w-4 h-4" /> Publish FAQ</>)}
              </button>

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {error}
                </div>
              )}
            </form>
          </div>
        </aside>

        {/* ---------- Listing ---------- */}
        <section className="min-w-0">
          {/* Toolbar */}
          <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-4 sm:p-5 mb-6">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] sm:flex sm:items-center gap-3">
                <div className="relative min-w-0">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search questions & answers…"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm"
                  />
                </div>
                <div className="shrink-0 inline-flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold">
                  <Filter className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{filtered.length} of {faqs.length}</span>
                  <span className="sm:hidden">{filtered.length}/{faqs.length}</span>
                </div>
              </div>

              {/* Category chips — horizontal scroll on mobile */}
              <div className="-mx-1 overflow-x-auto">
                <div className="flex items-center gap-2 px-1 min-w-max">
                  {[{ key: 'all', label: 'All', icon: LayoutGrid }, ...CATEGORY_OPTIONS].map((c) => {
                    const Icon = c.icon;
                    const active = filter === c.key;
                    return (
                      <button
                        key={c.key}
                        onClick={() => setFilter(c.key)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition-all ${
                          active
                            ? 'bg-sky-600 text-white border-sky-600 shadow'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" /> {c.label}
                        <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${active ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
                          {counts[c.key] || 0}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* List */}
          {loading ? (
            <div className="rounded-3xl bg-white border border-slate-200 py-24 flex flex-col items-center justify-center text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
              <p className="mt-3 text-sm">Loading FAQs…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-3xl bg-white border border-dashed border-slate-300 py-20 px-6 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 grid place-items-center">
                <HelpCircle className="w-7 h-7 text-slate-400" />
              </div>
              <h3 className="mt-4 font-black text-lg">No FAQs found</h3>
              <p className="text-sm text-slate-500 mt-1">Try clearing your filters or add a new one.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((f, i) => {
                const meta = catMeta(f.category || 'general');
                const Icon = meta.icon;
                const isEditing = editingId === f.id;
                return (
                  <article
                    key={f.id}
                    className="group relative rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
                  >
                    <span className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500 to-sky-700" />

                    {isEditing ? (
                      // ---------- EDIT MODE ----------
                      <div className="p-4 sm:p-6 pl-5 sm:pl-8 space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {CATEGORY_OPTIONS.map((c) => {
                            const CIcon = c.icon;
                            const active = editCategory === c.key;
                            return (
                              <button
                                key={c.key}
                                onClick={() => setEditCategory(c.key)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                                  active
                                    ? 'bg-slate-900 text-white border-slate-900'
                                    : 'bg-white text-slate-700 border-slate-200'
                                }`}
                              >
                                <CIcon className="w-3.5 h-3.5" /> {c.label}
                              </button>
                            );
                          })}
                        </div>
                        <input
                          type="text"
                          value={editQuestion}
                          onChange={(e) => setEditQuestion(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none font-semibold text-sm"
                        />
                        <textarea
                          rows={4}
                          value={editAnswer}
                          onChange={(e) => setEditAnswer(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm resize-none"
                        />
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                          <button
                            onClick={cancelEdit}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50"
                          >
                            <X className="w-4 h-4" /> Cancel
                          </button>
                          <button
                            onClick={() => saveEdit(f.id)}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
                          >
                            <Save className="w-4 h-4" /> Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      // ---------- VIEW MODE ----------
                      <div className="p-4 sm:p-6 pl-5 sm:pl-8">
                        <div className="grid grid-cols-[auto_minmax(0,1fr)] sm:flex sm:items-start gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-sky-50 text-sky-700 grid place-items-center font-black text-sm border border-sky-100">
                            {String(i + 1).padStart(2, '0')}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-widest">
                                <Icon className="w-3 h-3" /> {meta.label}
                              </span>
                            </div>
                            <h3 className="font-black text-base sm:text-lg text-slate-900 leading-snug break-words">
                              {f.question}
                            </h3>
                            <p className="mt-2 text-sm text-slate-600 leading-relaxed break-words">
                              {f.answer}
                            </p>
                          </div>

                          {/* Actions — inline on desktop, full-width row on mobile */}
                          <div className="hidden sm:flex shrink-0 flex-col gap-2">
                            <button
                              onClick={() => startEdit(f)}
                              aria-label="Edit"
                              className="w-9 h-9 rounded-xl bg-white border border-slate-200 grid place-items-center text-slate-600 hover:text-sky-700 hover:border-sky-400 transition-all"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(f.id)}
                              aria-label="Delete"
                              className="w-9 h-9 rounded-xl bg-white border border-slate-200 grid place-items-center text-slate-600 hover:text-rose-700 hover:border-rose-400 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Mobile actions */}
                        <div className="sm:hidden mt-4 grid grid-cols-2 gap-2">
                          <button
                            onClick={() => startEdit(f)}
                            className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:border-sky-400 hover:text-sky-700"
                          >
                            <Pencil className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(f.id)}
                            className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:border-rose-400 hover:text-rose-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default FaqAdmin;
