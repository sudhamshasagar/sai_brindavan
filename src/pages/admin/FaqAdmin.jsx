import React, { useEffect, useMemo, useState } from "react";
import { db } from "../../firebase.js";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import {
  HelpCircle,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  MessageCircleQuestion,
  Pencil,
  X,
  Save,
  CheckCircle2,
  Search,
  CalendarCheck,
  Stethoscope,
  HeartPulse,
  ShieldPlus,
  LayoutGrid,
  Filter,
  Sparkles,
  RotateCcw,
} from "lucide-react";

// -----------------------------------------------------
// CATEGORY CONFIGURATION
// -----------------------------------------------------
const CATEGORY_OPTIONS = [
  { key: "general", label: "General Care", icon: MessageCircleQuestion },
  { key: "appointment", label: "Appointments", icon: CalendarCheck },
  { key: "treatment", label: "Treatments", icon: Stethoscope },
  { key: "insurance", label: "Insurance & TPA", icon: ShieldPlus },
  { key: "emergency", label: "Emergency & ICU", icon: HeartPulse },
];

const catMeta = (key) =>
  CATEGORY_OPTIONS.find((category) => category.key === key) ||
  CATEGORY_OPTIONS[0];

const normalizeText = (value) => {
  if (value === null || value === undefined) return "";
  return String(value);
};

const normalizeCategory = (value) => {
  const category = normalizeText(value).trim().toLowerCase();
  return category || "general";
};

const FaqAdmin = () => {
  // ---------------------------------------------------
  // STATE
  // ---------------------------------------------------
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  // Add Form
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("general");

  // Edit Form
  const [editingId, setEditingId] = useState(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");
  const [editCategory, setEditCategory] = useState("general");

  // Filters
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // ---------------------------------------------------
  // 1. FETCH FAQS (Single Read on Mount)
  // ---------------------------------------------------
  useEffect(() => {
    let isMounted = true;

    const fetchFaqs = async () => {
      setLoading(true);
      setError("");

      try {
        const q = query(
          collection(db, "faqs"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);
        if (!isMounted) return;

        const faqData = snapshot.docs.map((faqDoc) => ({
          id: faqDoc.id,
          ...faqDoc.data(),
        }));

        setFaqs(faqData);
      } catch (err) {
        console.error("Error fetching FAQs:", err);
        if (isMounted) setError("Failed to load FAQs. Please check network connection.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFaqs();
    return () => {
      isMounted = false;
    };
  }, []);

  // Toast Auto-Dismiss
  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(timeout);
  }, [toast]);

  const clearError = () => setError("");

  const resetAddForm = () => {
    setQuestion("");
    setAnswer("");
    setCategory("general");
  };

  // ---------------------------------------------------
  // 2. ADD FAQ (Optimistic Update)
  // ---------------------------------------------------
  const handleAdd = async (event) => {
    event.preventDefault();

    const cleanQuestion = question.trim();
    const cleanAnswer = answer.trim();
    const cleanCategory = normalizeCategory(category);

    if (!cleanQuestion || !cleanAnswer) {
      setError("Question and answer are both required.");
      return;
    }

    setSubmitting(true);
    clearError();

    try {
      const faqData = {
        question: cleanQuestion,
        answer: cleanAnswer,
        category: cleanCategory,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "faqs"), faqData);

      setFaqs((currentFaqs) => [
        {
          id: docRef.id,
          ...faqData,
          createdAt: new Date(),
        },
        ...currentFaqs,
      ]);

      resetAddForm();
      setToast("New FAQ published to hospital site.");
    } catch (err) {
      console.error("Error adding FAQ:", err);
      setError("Failed to publish FAQ. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------------------------------
  // 3. DELETE FAQ (Optimistic Update)
  // ---------------------------------------------------
  const handleDelete = async (id, questionTitle) => {
    if (!id) return;

    if (!window.confirm(`Delete question: "${questionTitle}"?`)) {
      return;
    }

    clearError();
    const rollback = [...faqs];
    setFaqs((prev) => prev.filter((faq) => faq.id !== id));
    if (editingId === id) setEditingId(null);

    try {
      await deleteDoc(doc(db, "faqs", id));
      setToast("FAQ removed.");
    } catch (err) {
      console.error("Error deleting FAQ:", err);
      setFaqs(rollback);
      setError("Failed to delete FAQ. Reverted.");
    }
  };

  // ---------------------------------------------------
  // 4. INLINE EDIT HANDLERS
  // ---------------------------------------------------
  const startEdit = (faq) => {
    if (!faq) return;
    setEditingId(faq.id);
    setEditQuestion(normalizeText(faq.question));
    setEditAnswer(normalizeText(faq.answer));
    setEditCategory(normalizeCategory(faq.category));
    clearError();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditQuestion("");
    setEditAnswer("");
    setEditCategory("general");
    setSavingEdit(false);
  };

  const saveEdit = async (id) => {
    if (!id) return;

    const cleanQuestion = editQuestion.trim();
    const cleanAnswer = editAnswer.trim();
    const cleanCategory = normalizeCategory(editCategory);

    if (!cleanQuestion || !cleanAnswer) {
      setError("Question and answer cannot be blank.");
      return;
    }

    setSavingEdit(true);
    clearError();

    try {
      const updatedData = {
        question: cleanQuestion,
        answer: cleanAnswer,
        category: cleanCategory,
      };

      await updateDoc(doc(db, "faqs", id), updatedData);

      setFaqs((currentFaqs) =>
        currentFaqs.map((faq) =>
          faq.id === id ? { ...faq, ...updatedData } : faq
        )
      );

      setToast("FAQ updated successfully.");
      cancelEdit();
    } catch (err) {
      console.error("Error updating FAQ:", err);
      setError("Failed to update FAQ.");
    } finally {
      setSavingEdit(false);
    }
  };

  // ---------------------------------------------------
  // 5. MEMOIZED COUNTS & FILTERING
  // ---------------------------------------------------
  const counts = useMemo(() => {
    const result = { all: faqs.length };
    CATEGORY_OPTIONS.forEach((option) => {
      result[option.key] = 0;
    });

    faqs.forEach((faq) => {
      const faqCategory = normalizeCategory(faq.category);
      result[faqCategory] = (result[faqCategory] || 0) + 1;
    });

    return result;
  }, [faqs]);

  const filtered = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return faqs.filter((faq) => {
      const faqCategory = normalizeCategory(faq.category);
      const faqQuestion = normalizeText(faq.question).toLowerCase();
      const faqAnswer = normalizeText(faq.answer).toLowerCase();

      const matchCategory =
        filter === "all" || faqCategory === filter;

      const matchSearch =
        !searchTerm ||
        faqQuestion.includes(searchTerm) ||
        faqAnswer.includes(searchTerm);

      return matchCategory && matchSearch;
    });
  }, [faqs, filter, search]);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 p-4 sm:p-6 lg:p-2">
      {/* Toast Notification */}
      {toast && (
        <div
          className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white shadow-xl text-xs sm:text-sm font-semibold animate-in fade-in slide-in-from-top-2 duration-200"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1a365d] text-white shadow-xs">
              <HelpCircle className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#1a365d] tracking-tight">
                FAQ & Knowledge Base Management
              </h1>
            </div>
          </div>
        </div>
        {/* Global Error Banner */}
        {error && (
          <div
            role="alert"
            className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs sm:text-sm text-red-800 shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={clearError}
              className="text-red-400 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {/* Main Grid: Sticky Composer (Left) + FAQ Roster (Right) */}
        <div className="grid items-start gap-8 lg:grid-cols-12">
          {/* =================================================
              COMPOSER ASIDE (Sticky on Desktop)
          ================================================= */}
          <aside className="lg:col-span-5 lg:sticky lg:top-6 space-y-4">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-[#1f9b90]">
                  <Plus className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#1a365d]">
                    Add New FAQ Question
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Will reflect instantly across the public site
                  </p>
                </div>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                {/* Category Selection */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Select Topic Category
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORY_OPTIONS.map((option) => {
                      const Icon = option.icon;
                      const active = category === option.key;

                      return (
                        <button
                          key={option.key}
                          type="button"
                          onClick={() => setCategory(option.key)}
                          className={[
                            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
                            active
                              ? "bg-[#1a365d] text-white shadow-xs"
                              : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                          ].join(" ")}
                        >
                          <Icon className={`w-3.5 h-3.5 ${active ? "text-[#f6ac42]" : "text-[#1f9b90]"}`} />
                          <span>{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                {/* Question Input */}
                <div>
                  <label
                    htmlFor="faq-question"
                    className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700"
                  >
                    Question Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="faq-question"
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g. Do you accept cashless insurance?"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-[#1f9b90] focus:bg-white focus:ring-2 focus:ring-[#1f9b90]/15"
                    required
                  />
                </div>
                {/* Answer Textarea */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="faq-answer"
                      className="text-xs font-bold uppercase tracking-wider text-slate-700"
                    >
                      Answer Body <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {answer.length} chars
                    </span>
                  </div>
                  <textarea
                    id="faq-answer"
                    rows={4}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Write a clear, patient-friendly response..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-[#1f9b90] focus:bg-white focus:ring-2 focus:ring-[#1f9b90]/15"
                    required
                  />
                </div>
                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1a365d] to-[#1f9b90] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-slate-900/10 transition hover:opacity-95 active:scale-[0.99] disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Publish to FAQ</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </aside>
          {/* =================================================
              FAQ ROSTER & MANAGEMENT STREAM (Right)
          ================================================= */}
          <section className="lg:col-span-7 space-y-4">     
            {/* Toolbar Filter Deck (Wrapped, No Horizontal Scroll) */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Search */}
                <div className="relative w-full sm:flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search questions or answers..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-xs sm:text-sm outline-none focus:border-[#1f9b90] focus:bg-white"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 shrink-0">
                  <Filter className="w-3.5 h-3.5 text-[#1f9b90]" />
                  <span>
                    Showing {filtered.length} of {faqs.length} FAQs
                  </span>
                </div>
              </div>
              {/* Wrapped Category Filter Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-100">
                {[
                  { key: "all", label: "All Topics", icon: LayoutGrid },
                  ...CATEGORY_OPTIONS,
                ].map((option) => {
                  const Icon = option.icon;
                  const active = filter === option.key;
                  const count = counts[option.key] || 0;

                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setFilter(option.key)}
                      className={[
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all",
                        active
                          ? "bg-[#1a365d] text-white shadow-2xs font-bold"
                          : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900",
                      ].join(" ")}
                    >
                      <Icon className={`w-3.5 h-3.5 ${active ? "text-[#f6ac42]" : "text-[#1f9b90]"}`} />
                      <span>{option.label}</span>
                      <span
                        className={`ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] ${
                          active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Questions List */}
            {loading ? (
              <div className="rounded-3xl border border-slate-200 bg-white py-20 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-[#1f9b90] mb-2" />
                <p className="text-xs font-bold uppercase tracking-wider">
                  Loading FAQ Registry...
                </p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-16 px-6 text-center">
                <HelpCircle className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <h3 className="font-bold text-base text-slate-800">
                  No FAQs matching your query
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try clearing the search box or select "All Topics".
                </p>
                {(search || filter !== "all") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setFilter("all");
                    }}
                    className="mt-3 inline-flex items-center gap-1 rounded-xl bg-[#1a365d] px-3.5 py-1.5 text-xs font-semibold text-white"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Filters</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((faq, index) => {
                  const faqCategory = normalizeCategory(faq.category);
                  const meta = catMeta(faqCategory);
                  const Icon = meta.icon;
                  const isEditing = editingId === faq.id;

                  return (
                    <article
                      key={faq.id}
                      className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs transition hover:shadow-xs"
                    >
                      {isEditing ? (
                        /* INLINE EDIT MODE */
                        <div className="space-y-3.5">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#1a365d]">
                              Editing Question
                            </span>
                            <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-bold uppercase">
                              Active Editor
                            </span>
                          </div>
                          {/* Category Switcher in Edit Mode */}
                          <div className="flex flex-wrap gap-1.5">
                            {CATEGORY_OPTIONS.map((opt) => {
                              const active = editCategory === opt.key;
                              return (
                                <button
                                  key={opt.key}
                                  type="button"
                                  onClick={() => setEditCategory(opt.key)}
                                  className={[
                                    "px-2.5 py-1 text-xs rounded-full font-semibold transition",
                                    active
                                      ? "bg-[#1a365d] text-white"
                                      : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-white",
                                  ].join(" ")}
                                >
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>
                          <input
                            type="text"
                            value={editQuestion}
                            onChange={(e) => setEditQuestion(e.target.value)}
                            disabled={savingEdit}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-bold text-slate-900 outline-none focus:border-[#1f9b90]"
                          />
                          <textarea
                            rows={3}
                            value={editAnswer}
                            onChange={(e) => setEditAnswer(e.target.value)}
                            disabled={savingEdit}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-slate-700 outline-none focus:border-[#1f9b90] resize-none"
                          />
                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={cancelEdit}
                              disabled={savingEdit}
                              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => saveEdit(faq.id)}
                              disabled={savingEdit}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-2xs"
                            >
                              {savingEdit ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Save className="w-3.5 h-3.5" />
                              )}
                              <span>Save Changes</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* VIEW CARD MODE */
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="inline-flex items-center gap-1 rounded-md bg-teal-50 border border-teal-200/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#1f9b90]">
                                <Icon className="w-3 h-3" />
                                <span>{meta.label}</span>
                              </span>
                            </div>
                            <h3 className="text-sm sm:text-base font-bold text-[#1a365d] leading-snug break-words">
                              {faq.question}
                            </h3>
                            <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-600 font-medium whitespace-pre-line break-words">
                              {faq.answer}
                            </p>
                          </div>
                          {/* Action Buttons */}
                          <div className="flex items-center gap-1 shrink-0 ml-2">
                            <button
                              type="button"
                              onClick={() => startEdit(faq)}
                              title="Edit Question"
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-[#1f9b90] hover:text-[#1f9b90] transition shadow-2xs"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(faq.id, faq.question)}
                              title="Delete Question"
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition shadow-2xs"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
    </div>
  );
};

export default FaqAdmin;