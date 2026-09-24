import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
collection,
query,
where,
orderBy,
onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import {
CalendarDays,
ArrowRight,
FileText,
Loader2,
Search,
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Blogs = () => {
const [blogs, setBlogs] = useState([]);
const [filteredBlogs, setFilteredBlogs] = useState([]);
const [loading, setLoading] = useState(true);
const [search, setSearch] = useState("");

useEffect(() => {
const blogsQuery = query(
collection(db, "blogs"),
where("status", "==", "published"),
orderBy("publishedAt", "desc")
);


const unsubscribe = onSnapshot(
  blogsQuery,
  (snapshot) => {
    const data = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));

    setBlogs(data);
    setFilteredBlogs(data);
    setLoading(false);
  },
  (error) => {
    console.error("Error loading blogs:", error);
    setLoading(false);
  }
);

return () => unsubscribe();


}, []);

useEffect(() => {
const term = search.trim().toLowerCase();


if (!term) {
  setFilteredBlogs(blogs);
  return;
}

setFilteredBlogs(
  blogs.filter(
    (blog) =>
      blog.title?.toLowerCase().includes(term) ||
      blog.excerpt?.toLowerCase().includes(term) ||
      blog.category?.toLowerCase().includes(term)
  )
);


}, [search, blogs]);

const formatDate = (timestamp) => {
if (!timestamp?.toDate) return "";


return timestamp.toDate().toLocaleDateString("en-IN", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});


};

return ( <div className="min-h-screen bg-gradient-to-b from-rose-50/30 via-white to-teal-50/20 text-slate-800">


  {/* HERO */}

  <section id="blogs" className="relative overflow-hidden">
    <div className="absolute -top-32 -left-32 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl" />
    <div className="absolute -top-32 -right-32 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl" />

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-widest">
          <FileText className="w-4 h-4" />
          Hospital Updates
        </div>

        <h1 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
          Health, Care &
          <span className="text-teal-700 italic"> Awareness</span>
        </h1>

        <p className="mt-5 text-lg text-slate-600 leading-relaxed max-w-2xl">
          Read the latest health information, hospital updates,
          awareness articles, events, and stories from Sai Brindavan
          Hospital.
        </p>
      </div>
    </div>
  </section>

  {/* SEARCH */}

  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
    <div className="relative max-w-xl">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

      <input
        type="text"
        placeholder="Search articles..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
      />
    </div>
  </section>

  {/* BLOGS */}

  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
    {loading ? (
      <div className="py-24 flex flex-col items-center">
        <Loader2 className="w-8 h-8 text-teal-700 animate-spin" />

        <p className="mt-4 text-slate-500 font-medium">
          Loading articles...
        </p>
      </div>
    ) : filteredBlogs.length === 0 ? (
      <div className="py-24 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center">
          <FileText className="w-7 h-7 text-slate-400" />
        </div>

        <h2 className="mt-5 text-2xl font-bold text-slate-900">
          No articles found
        </h2>

        <p className="mt-2 text-slate-500">
          Please check back later for new updates.
        </p>
      </div>
    ) : (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-7"
      >
        {filteredBlogs.map((blog) => (
          <motion.article
            key={blog.id}
            variants={{
              hidden: {
                opacity: 0,
                y: 20,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
            className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            {/* IMAGE */}

            <div className="relative h-56 bg-slate-100 overflow-hidden">
              {blog.coverImage ? (
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileText className="w-12 h-12 text-slate-300" />
                </div>
              )}

              {blog.category && (
                <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur text-xs font-bold text-teal-700 shadow-sm">
                  {blog.category}
                </span>
              )}
            </div>

            {/* CONTENT */}

            <div className="p-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <CalendarDays className="w-4 h-4" />
                {formatDate(blog.publishedAt || blog.createdAt)}
              </div>

              <h2 className="mt-3 text-xl font-black text-slate-900 leading-snug group-hover:text-teal-700 transition-colors">
                {blog.title}
              </h2>

              <p className="mt-3 text-sm text-slate-500 leading-relaxed line-clamp-3">
                {blog.excerpt ||
                  blog.content?.replace(/<[^>]+>/g, "").slice(0, 180)}
              </p>

              <Link
                to={`/blogs/${blog.slug || blog.id}`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-800"
              >
                Read Article
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.article>
        ))}
      </motion.div>
    )}
  </section>
</div>


);
};

export default Blogs;
