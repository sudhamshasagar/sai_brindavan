import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  CalendarDays,
  ArrowRight,
  FileText,
  Loader2,
  Search,
  RefreshCw,
  Sparkles,
  Clock,
  X,
  BookOpen,
  TrendingUp,
  BookTemplate,
  LucideBookImage,
} from "lucide-react";

// =====================================================
// IN-MEMORY CACHE (Zero duplicate Firestore reads)
// =====================================================
let blogsCache = null;
let blogsFetchPromise = null;

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // ---------------------------------------------------
  // 1. FETCH PUBLISHED BLOGS (Cached)
  // ---------------------------------------------------
  const fetchBlogs = async (force = false) => {
    setLoading(true);
    setError("");

    try {
      if (!force && blogsCache) {
        setBlogs(blogsCache);
        setLoading(false);
        return;
      }

      if (!blogsFetchPromise || force) {
        const blogsQuery = query(
          collection(db, "blogs"),
          where("status", "==", "published"),
          orderBy("publishedAt", "desc")
        );

        blogsFetchPromise = getDocs(blogsQuery)
          .then((snapshot) => {
            const data = snapshot.docs.map((blogDoc) => ({
              id: blogDoc.id,
              ...blogDoc.data(),
            }));
            blogsCache = data;
            return data;
          })
          .catch((err) => {
            blogsFetchPromise = null;
            throw err;
          });
      }

      const blogsData = await blogsFetchPromise;
      setBlogs(blogsData);
    } catch (err) {
      console.error("Error loading articles:", err);
      setError("Unable to retrieve health guides right now. Please try again.");
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // ---------------------------------------------------
  // 2. CATEGORIES & FILTERING
  // ---------------------------------------------------
  const categories = useMemo(() => {
    const unique = [
      ...new Set(blogs.map((b) => b.category?.trim()).filter(Boolean)),
    ].sort();
    return ["all", ...unique];
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    const term = search.trim().toLowerCase();

    return blogs.filter((blog) => {
      const title = blog.title?.toLowerCase() || "";
      const excerpt = blog.excerpt?.toLowerCase() || "";
      const category = blog.category?.toLowerCase() || "";

      const matchesSearch =
        !term ||
        title.includes(term) ||
        excerpt.includes(term) ||
        category.includes(term);

      const matchesCategory =
        selectedCategory === "all" ||
        category === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [blogs, search, selectedCategory]);

  // Featured Lead Story (First item when no search/filters are applied)
  const isDefaultView = !search.trim() && selectedCategory === "all";
  const leadArticle = isDefaultView && filteredBlogs.length > 0 ? filteredBlogs[0] : null;
  const secondaryArticles = leadArticle ? filteredBlogs.slice(1) : filteredBlogs;

  // ---------------------------------------------------
  // 3. HELPERS
  // ---------------------------------------------------
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    try {
      const date =
        typeof timestamp?.toDate === "function"
          ? timestamp.toDate()
          : timestamp instanceof Date
          ? timestamp
          : null;
      if (!date || Number.isNaN(date.getTime())) return "";

      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  const getExcerpt = (blog, limit = 140) => {
    if (blog.excerpt?.trim()) return blog.excerpt.trim();
    if (!blog.content) return "";

    const plain = blog.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return plain.slice(0, limit) + (plain.length > limit ? "..." : "");
  };

  const estimateReadTime = (blog) => {
    const text = (blog.content || blog.excerpt || "").replace(/<[^>]+>/g, " ");
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return `${Math.max(1, Math.ceil(words / 200))} min read`;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans pb-24">
      {/* ===================================================
          1. EDITORIAL HEADER & SEARCH BAR
      =================================================== */}
      <header className="border-b border-slate-200/80 pt-2 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-teal-50 px-3.5 py-1 text-xs font-semibold text-[#1f9b90]">
                <LucideBookImage className="w-3.5 h-3.5" />
                <span>Clinical Journal & Health Library</span>
              </div>

              <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a365d] tracking-tight">
                Health & Wellness Insights
              </h1>

              <p className="mt-2 text-sm sm:text-base text-slate-500 max-w-xl leading-relaxed">
                Evidence-based medical advice, maternity guidance, and hospital developments curated by our specialists.
              </p>
            </div>

            {/* Quick Search */}
            <div className="relative w-full md:w-80 shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles or topics..."
                className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/70 text-xs sm:text-sm font-medium outline-none focus:border-[#1f9b90] focus:bg-white transition-all shadow-2xs"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="mt-8 flex flex-wrap items-center gap-2 pt-6 border-t border-slate-100">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={[
                    "px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all",
                    active
                      ? "bg-[#1a365d] text-white shadow-xs font-bold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900",
                  ].join(" ")}
                >
                  {cat === "all" ? "All Topics" : cat}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ===================================================
          2. MAIN CONTENT STREAM
      =================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Loading Spinner */}
        {loading && (
          <div className="py-28 flex flex-col items-center justify-center rounded-3xl bg-white border border-slate-200">
            <Loader2 className="w-9 h-9 text-[#1f9b90] animate-spin mb-3" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Fetching Medical Library...
            </p>
          </div>
        )}

        {/* Error Screen */}
        {!loading && error && (
          <div className="py-20 text-center rounded-3xl bg-white border border-red-200 p-8 shadow-xs">
            <FileText className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">{error}</h3>
            <button
              type="button"
              onClick={() => fetchBlogs(true)}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1a365d] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#122846]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Empty Search Screen */}
        {!loading && !error && filteredBlogs.length === 0 && (
          <div className="py-20 text-center rounded-3xl bg-white border border-dashed border-slate-300 p-8">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">No medical articles match your search</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your query or browse under "All Topics".
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-[#1a365d] text-white text-xs font-semibold hover:bg-[#122846]"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* -------------------------------------------------
            FEATURED LEAD STORY (SPLIT HERO CARD)
        ------------------------------------------------- */}
        {!loading && !error && leadArticle && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-3.5 text-xs font-bold uppercase tracking-wider text-[#1f9b90]">
              <TrendingUp className="w-4 h-4" />
              <span>Lead Editorial</span>
            </div>

            <article className="group relative rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Cover Image Half */}
              <div className="lg:col-span-7 relative min-h-[280px] lg:min-h-[420px] bg-slate-100 overflow-hidden">
                {leadArticle.coverImage ? (
                  <img
                    src={leadArticle.coverImage}
                    alt={leadArticle.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100">
                    <FileText className="w-14 h-14 text-slate-300" />
                  </div>
                )}
                {leadArticle.category && (
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-white/95 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-[#1a365d] shadow-sm">
                    {leadArticle.category}
                  </span>
                )}
              </div>

              {/* Story Content Half */}
              <div className="lg:col-span-5 p-7 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold mb-3">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-[#1f9b90]" />
                      {formatDate(leadArticle.publishedAt || leadArticle.createdAt)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#f6ac42]" />
                      {estimateReadTime(leadArticle)}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#1a365d] leading-snug group-hover:text-[#1f9b90] transition-colors break-words">
                    {leadArticle.title}
                  </h2>

                  <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-4">
                    {getExcerpt(leadArticle, 220)}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100">
                  <Link
                    to={`/blogs/${leadArticle.slug || leadArticle.id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#1a365d] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white group-hover:bg-[#1f9b90] transition-colors shadow-2xs"
                  >
                    <span>Read Full Story</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>
          </div>
        )}

        {/* -------------------------------------------------
            SECONDARY ARTICLES (GRID DECK)
        ------------------------------------------------- */}
        {!loading && !error && secondaryArticles.length > 0 && (
          <div>
            {leadArticle && (
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-5">
                More Medical Updates & Articles
              </h3>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {secondaryArticles.map((blog) => {
                const title = blog.title?.trim() || "Untitled Article";
                const date = formatDate(blog.publishedAt || blog.createdAt);
                const excerpt = getExcerpt(blog, 120);
                const slug = blog.slug || blog.id;
                const readTime = estimateReadTime(blog);

                return (
                  <article
                    key={blog.id}
                    className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="relative h-48 bg-slate-100 overflow-hidden">
                        {blog.coverImage ? (
                          <img
                            src={blog.coverImage}
                            alt={title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-50">
                            <FileText className="w-9 h-9 text-slate-300" />
                          </div>
                        )}

                        {blog.category && (
                          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-xs text-[10px] font-bold uppercase tracking-wider text-[#1a365d] shadow-2xs border border-slate-100">
                            {blog.category}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 sm:p-6">
                        <div className="flex items-center gap-2.5 text-xs text-slate-400 font-semibold mb-2">
                          {date && (
                            <span className="flex items-center gap-1">
                              <CalendarDays className="w-3.5 h-3.5 text-[#1f9b90]" />
                              {date}
                            </span>
                          )}
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#f6ac42]" />
                            {readTime}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-[#1a365d] leading-snug group-hover:text-[#1f9b90] transition-colors break-words">
                          {title}
                        </h3>

                        {excerpt && (
                          <p className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-3">
                            {excerpt}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Footer Action */}
                    <div className="px-5 sm:px-6 pb-5 pt-0 border-t border-slate-100 mt-auto">
                      <Link
                        to={`/blogs/${slug}`}
                        className="pt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1f9b90] group-hover:text-[#1a365d] transition-colors"
                      >
                        <span>Read Article</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Blogs;