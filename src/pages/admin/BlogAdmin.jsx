import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
Plus,
Search,
Pencil,
Trash2,
Eye,
EyeOff,
X,
Save,
FileText,
CalendarDays,
Image as ImageIcon,
Loader2,
CheckCircle2,
Clock3,
} from "lucide-react";

import {
collection,
addDoc,
updateDoc,
deleteDoc,
doc,
onSnapshot,
serverTimestamp,
query,
orderBy,
} from "firebase/firestore";

import { db } from "../../firebase";

const BlogAdmin = () => {
const [blogs, setBlogs] = useState([]);
const [loading, setLoading] = useState(true);

const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("all");

const [showEditor, setShowEditor] = useState(false);
const [editingBlog, setEditingBlog] = useState(null);
const [saving, setSaving] = useState(false);

const emptyForm = {
title: "",
excerpt: "",
content: "",
category: "",
author: "Sai Brindavan Hospital",
coverImage: "",
status: "draft",
};

const [form, setForm] = useState(emptyForm);

/* =====================================================
FETCH BLOGS
===================================================== */

useEffect(() => {
const blogsQuery = query(
collection(db, "blogs"),
orderBy("createdAt", "desc")
);


const unsubscribe = onSnapshot(
  blogsQuery,
  (snapshot) => {
    const data = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));

    setBlogs(data);
    setLoading(false);
  },
  (error) => {
    console.error("Error loading blogs:", error);
    setLoading(false);
  }
);

return () => unsubscribe();


}, []);

/* =====================================================
FORM HANDLING
===================================================== */

const handleChange = (e) => {
const { name, value } = e.target;


setForm((prev) => ({
  ...prev,
  [name]: value,
}));


};

const openCreate = () => {
setEditingBlog(null);
setForm(emptyForm);
setShowEditor(true);
};

const openEdit = (blog) => {
setEditingBlog(blog);


setForm({
  title: blog.title || "",
  excerpt: blog.excerpt || "",
  content: blog.content || "",
  category: blog.category || "",
  author: blog.author || "Sai Brindavan Hospital",
  coverImage: blog.coverImage || "",
  status: blog.status || "draft",
});

setShowEditor(true);


};

const closeEditor = () => {
if (saving) return;


setShowEditor(false);
setEditingBlog(null);
setForm(emptyForm);


};

/* =====================================================
SAVE BLOG
===================================================== */

const handleSave = async () => {
if (!form.title.trim()) {
alert("Blog title is required.");
return;
}


if (!form.content.trim()) {
  alert("Blog content is required.");
  return;
}

try {
  setSaving(true);

  const slug = form.title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const payload = {
    title: form.title.trim(),
    excerpt: form.excerpt.trim(),
    content: form.content.trim(),
    category: form.category.trim(),
    author: form.author.trim() || "Sai Brindavan Hospital",
    coverImage: form.coverImage.trim(),
    status: form.status,
    slug,
    updatedAt: serverTimestamp(),
  };

  if (editingBlog) {
    await updateDoc(
      doc(db, "blogs", editingBlog.id),
      payload
    );
  } else {
    await addDoc(collection(db, "blogs"), {
      ...payload,
      createdAt: serverTimestamp(),
      publishedAt:
        form.status === "published"
          ? serverTimestamp()
          : null,
    });
  }

  closeEditor();
} catch (error) {
  console.error("Error saving blog:", error);
  alert("Unable to save blog. Please try again.");
} finally {
  setSaving(false);
}


};

/* =====================================================
PUBLISH / UNPUBLISH
===================================================== */

const toggleStatus = async (blog) => {
try {
const newStatus =
blog.status === "published"
? "draft"
: "published";


  await updateDoc(doc(db, "blogs", blog.id), {
    status: newStatus,
    updatedAt: serverTimestamp(),
    publishedAt:
      newStatus === "published"
        ? serverTimestamp()
        : null,
  });
} catch (error) {
  console.error("Error updating blog status:", error);
  alert("Unable to update blog status.");
}


};

/* =====================================================
DELETE
===================================================== */

const handleDelete = async (blog) => {
const confirmed = window.confirm(
`Delete "${blog.title}"?\n\nThis action cannot be undone.`
);


if (!confirmed) return;

try {
  await deleteDoc(doc(db, "blogs", blog.id));
} catch (error) {
  console.error("Error deleting blog:", error);
  alert("Unable to delete blog.");
}


};

/* =====================================================
FILTER
===================================================== */

const filteredBlogs = blogs.filter((blog) => {
const searchTerm = search.toLowerCase();


const matchesSearch =
  blog.title?.toLowerCase().includes(searchTerm) ||
  blog.category?.toLowerCase().includes(searchTerm) ||
  blog.author?.toLowerCase().includes(searchTerm);

const matchesStatus =
  statusFilter === "all" ||
  blog.status === statusFilter;

return matchesSearch && matchesStatus;


});

const publishedCount = blogs.filter(
(blog) => blog.status === "published"
).length;

const draftCount = blogs.filter(
(blog) => blog.status === "draft"
).length;

/* =====================================================
DATE
===================================================== */

const formatDate = (timestamp) => {
if (!timestamp?.toDate) return "—";


return timestamp.toDate().toLocaleDateString("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});


};

/* =====================================================
UI
===================================================== */

return ( <div className="space-y-8 pb-10">


  {/* =================================================
      HEADER
  ================================================= */}

  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

    <div className="flex items-center gap-3">

      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
        <FileText className="w-6 h-6 text-blue-600" />
      </div>

      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Blogs
        </h2>

        <p className="text-slate-500 font-medium mt-1">
          Create and manage hospital articles and updates.
        </p>
      </div>

    </div>

    <button
      onClick={openCreate}
      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#2b4c7e] hover:bg-[#203b62] text-white font-bold shadow-lg shadow-[#2b4c7e]/20 transition-all"
    >
      <Plus className="w-5 h-5" />
      Create Blog
    </button>

  </div>

  {/* =================================================
      STATISTICS
  ================================================= */}

  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <p className="text-xs uppercase tracking-widest font-bold text-slate-400">
        Total Blogs
      </p>

      <p className="text-3xl font-black text-slate-900 mt-2">
        {blogs.length}
      </p>
    </div>

    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <p className="text-xs uppercase tracking-widest font-bold text-slate-400">
        Published
      </p>

      <p className="text-3xl font-black text-emerald-600 mt-2">
        {publishedCount}
      </p>
    </div>

    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <p className="text-xs uppercase tracking-widest font-bold text-slate-400">
        Drafts
      </p>

      <p className="text-3xl font-black text-amber-600 mt-2">
        {draftCount}
      </p>
    </div>

  </div>

  {/* =================================================
      SEARCH / FILTER
  ================================================= */}

  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

    <div className="flex flex-col md:flex-row gap-3">

      <div className="relative flex-1">

        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

        <input
          type="text"
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2b4c7e]/20 focus:border-[#2b4c7e] transition"
        />

      </div>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2b4c7e]/20"
      >
        <option value="all">All Status</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>

    </div>

  </div>

  {/* =================================================
      BLOG LIST
  ================================================= */}

  <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

    {loading ? (

      <div className="py-20 flex flex-col items-center justify-center">

        <Loader2 className="w-8 h-8 text-[#2b4c7e] animate-spin" />

        <p className="mt-3 text-slate-500 font-medium">
          Loading blogs...
        </p>

      </div>

    ) : filteredBlogs.length === 0 ? (

      <div className="py-20 text-center px-6">

        <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center">
          <FileText className="w-7 h-7 text-slate-400" />
        </div>

        <h3 className="mt-5 text-xl font-bold text-slate-900">
          No blogs found
        </h3>

        <p className="text-slate-500 mt-2">
          Create your first hospital blog to get started.
        </p>

      </div>

    ) : (

      <div className="divide-y divide-slate-100">

        {filteredBlogs.map((blog) => (

          <motion.div
            key={blog.id}
            layout
            className="p-5 sm:p-6 hover:bg-slate-50/70 transition"
          >

            <div className="flex flex-col lg:flex-row gap-5">

              {/* IMAGE */}

              <div className="w-full lg:w-48 h-32 rounded-2xl overflow-hidden bg-slate-100 shrink-0">

                {blog.coverImage ? (

                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />

                ) : (

                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">

                    <ImageIcon className="w-8 h-8" />

                    <span className="text-xs mt-2 font-medium">
                      No image
                    </span>

                  </div>

                )}

              </div>

              {/* CONTENT */}

              <div className="flex-1 min-w-0">

                <div className="flex flex-wrap items-center gap-2 mb-2">

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      blog.status === "published"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >

                    {blog.status === "published" ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Clock3 className="w-3.5 h-3.5" />
                    )}

                    {blog.status === "published"
                      ? "Published"
                      : "Draft"}

                  </span>

                  {blog.category && (
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                      {blog.category}
                    </span>
                  )}

                </div>

                <h3 className="text-xl font-black text-slate-900 truncate">
                  {blog.title}
                </h3>

                <p className="text-sm text-slate-500 mt-2 line-clamp-2 max-w-3xl">
                  {blog.excerpt ||
                    blog.content
                      ?.replace(/<[^>]+>/g, "")
                      .slice(0, 180)}
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-4 text-xs font-semibold text-slate-400">

                  <span>
                    {blog.author || "Sai Brindavan Hospital"}
                  </span>

                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {formatDate(blog.createdAt)}
                  </span>

                </div>

              </div>

              {/* ACTIONS */}

              <div className="flex lg:flex-col gap-2 lg:justify-center">

                <button
                  onClick={() => openEdit(blog)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition"
                >
                  <Pencil className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    Edit
                  </span>
                </button>

                <button
                  onClick={() => toggleStatus(blog)}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition ${
                    blog.status === "published"
                      ? "bg-amber-50 hover:bg-amber-100 text-amber-700"
                      : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                  }`}
                >

                  {blog.status === "published" ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      <span className="hidden sm:inline">
                        Unpublish
                      </span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">
                        Publish
                      </span>
                    </>
                  )}

                </button>

                <button
                  onClick={() => handleDelete(blog)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-sm transition"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    Delete
                  </span>
                </button>

              </div>

            </div>

          </motion.div>

        ))}

      </div>

    )}

  </div>

  {/* =================================================
      BLOG EDITOR
  ================================================= */}

  <AnimatePresence>

    {showEditor && (

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
      >

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.98 }}
          className="w-full max-w-5xl max-h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >

          {/* HEADER */}

          <div className="shrink-0 px-6 py-5 border-b border-slate-200 flex items-center justify-between">

            <div>

              <h3 className="text-2xl font-black text-slate-900">
                {editingBlog
                  ? "Edit Blog"
                  : "Create Blog"}
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Add an article or hospital update for your website.
              </p>

            </div>

            <button
              onClick={closeEditor}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>

          </div>

          {/* CONTENT */}

          <div className="flex-1 overflow-y-auto p-6">

            <div className="grid lg:grid-cols-3 gap-6">

              {/* MAIN */}

              <div className="lg:col-span-2 space-y-5">

                {/* TITLE */}

                <div>

                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Blog Title *
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Enter blog title"
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2b4c7e]/20 focus:border-[#2b4c7e]"
                  />

                </div>

                {/* EXCERPT */}

                <div>

                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Short Description
                  </label>

                  <textarea
                    name="excerpt"
                    value={form.excerpt}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Short description shown on the blog cards..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2b4c7e]/20 focus:border-[#2b4c7e] resize-none"
                  />

                </div>

                {/* CONTENT */}

                <div>

                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Blog Content *
                  </label>

                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    rows={16}
                    placeholder="Write the complete blog content here..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2b4c7e]/20 focus:border-[#2b4c7e] resize-y leading-relaxed"
                  />

                  <p className="text-xs text-slate-400 mt-2">
                    Plain text is currently supported.
                    Rich text can be added later.
                  </p>

                </div>

              </div>

              {/* SIDEBAR */}

              <div className="space-y-5">

                {/* CATEGORY */}

                <div>

                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Category
                  </label>

                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="e.g. Women's Health"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2b4c7e]/20 focus:border-[#2b4c7e]"
                  />

                </div>

                {/* AUTHOR */}

                <div>

                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Author
                  </label>

                  <input
                    type="text"
                    name="author"
                    value={form.author}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2b4c7e]/20 focus:border-[#2b4c7e]"
                  />

                </div>

                {/* DEMO IMAGE */}

                <div>

                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Cover Image URL
                  </label>

                  <input
                    type="url"
                    name="coverImage"
                    value={form.coverImage}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2b4c7e]/20 focus:border-[#2b4c7e]"
                  />

                  <p className="text-xs text-slate-400 mt-2">
                    Demo only — paste a public image URL.
                    Firebase Storage will be added later.
                  </p>

                  {form.coverImage && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">

                      <img
                        src={form.coverImage}
                        alt="Cover preview"
                        className="w-full h-40 object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />

                    </div>
                  )}

                </div>

                {/* STATUS */}

                <div>

                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Publication Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#2b4c7e]/20"
                  >

                    <option value="draft">
                      Draft
                    </option>

                    <option value="published">
                      Published
                    </option>

                  </select>

                </div>

              </div>

            </div>

          </div>

          {/* FOOTER */}

          <div className="shrink-0 px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-end gap-3">

            <button
              onClick={closeEditor}
              disabled={saving}
              className="px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-[#2b4c7e] hover:bg-[#203b62] text-white font-bold flex items-center justify-center gap-2 transition disabled:opacity-50"
            >

              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {editingBlog
                    ? "Update Blog"
                    : "Save Blog"}
                </>
              )}

            </button>

          </div>

        </motion.div>

      </motion.div>

    )}

  </AnimatePresence>

</div>


);
};

export default BlogAdmin;
