import React, { useState, useEffect } from 'react';
import { db } from '../../firebase.js';
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { 
  HelpCircle, 
  Plus, 
  Trash2, 
  Loader2, 
  AlertCircle,
  MessageCircleQuestion
} from 'lucide-react';

const FaqAdmin = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [newFaq, setNewFaq] = useState({
    question: '',
    answer: ''
  });

  const faqsCollectionRef = collection(db, 'faqs');

  // Fetch FAQs on component mount
  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      // Fetch FAQs ordered by creation time
      const q = query(faqsCollectionRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const faqData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setFaqs(faqData);
    } catch (err) {
      console.error("Error fetching FAQs:", err);
      setError("Failed to load FAQs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFaq(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddFaq = async (e) => {
    e.preventDefault();
    setError('');

    if (!newFaq.question.trim() || !newFaq.answer.trim()) {
      setError('Both Question and Answer are required.');
      return;
    }

    try {
      setSubmitting(true);
      const docRef = await addDoc(faqsCollectionRef, {
        question: newFaq.question.trim(),
        answer: newFaq.answer.trim(),
        createdAt: serverTimestamp()
      });

      // Update local state immediately without re-fetching
      setFaqs(prev => [{
        id: docRef.id,
        question: newFaq.question.trim(),
        answer: newFaq.answer.trim(),
      }, ...prev]);

      // Reset form
      setNewFaq({ question: '', answer: '' });
      
    } catch (err) {
      console.error("Error adding FAQ:", err);
      setError("Failed to add FAQ. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFaq = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      await deleteDoc(doc(db, 'faqs', id));
      // Remove from local state
      setFaqs(prev => prev.filter(faq => faq.id !== id));
    } catch (err) {
      console.error("Error deleting FAQ:", err);
      alert("Failed to delete FAQ. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-2 font-sans text-slate-800">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3 mb-2">
          <HelpCircle className="w-8 h-8 text-[#2b4c7e]" />
          FAQ Management
        </h1>
        <p className="text-slate-500 font-medium">Add, manage, and remove frequently asked questions for the hospital website.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg flex items-center gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Add FAQ Form */}
        <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-5">
          <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#C19B6C]" />
            Add New FAQ
          </h2>
          
          <form onSubmit={handleAddFaq} className="space-y-5">
            <div>
              <label htmlFor="question" className="block text-sm font-bold text-slate-700 mb-1.5">
                Question <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="question"
                name="question"
                value={newFaq.question}
                onChange={handleInputChange}
                placeholder="e.g., What are your visiting hours?"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2b4c7e] focus:border-[#2b4c7e] outline-none transition-all placeholder:text-slate-400 font-medium"
                disabled={submitting}
              />
            </div>

            <div>
              <label htmlFor="answer" className="block text-sm font-bold text-slate-700 mb-1.5">
                Answer <span className="text-red-500">*</span>
              </label>
              <textarea
                id="answer"
                name="answer"
                value={newFaq.answer}
                onChange={handleInputChange}
                placeholder="Provide a clear, helpful answer..."
                rows="5"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#2b4c7e] focus:border-[#2b4c7e] outline-none transition-all placeholder:text-slate-400 font-medium resize-none"
                disabled={submitting}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#2b4c7e] hover:bg-sky-500 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md shadow-sky-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Adding...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" /> Publish FAQ
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Existing FAQs List */}
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
            <MessageCircleQuestion className="w-5 h-5 text-[#C19B6C]" />
            Active FAQs ({faqs.length})
          </h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#2b4c7e] mb-4" />
              <p className="font-medium">Loading FAQs...</p>
            </div>
          ) : faqs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center text-slate-500">
              <HelpCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-lg font-semibold text-slate-700">No FAQs found</p>
              <p className="text-sm">Use the form on the left to add your first question.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {faqs.map((faq) => (
                <div 
                  key={faq.id} 
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6 justify-between items-start group"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Q: {faq.question}</h3>
                    <p className="text-slate-600 leading-relaxed font-medium text-sm">
                      <span className="font-bold text-slate-400 mr-1">A:</span> 
                      {faq.answer}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteFaq(faq.id)}
                    className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0 border border-transparent hover:border-red-100"
                    title="Delete FAQ"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default FaqAdmin;