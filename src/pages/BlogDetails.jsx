import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
doc,
getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import {
ArrowLeft,
CalendarDays,
Loader2,
FileText,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BlogDetails = () => {
const { slug } = useParams();

const [blog, setBlog] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
const fetchBlog = async () => {
try {
const blogRef = doc(db, "blogs", slug);
const snapshot = await getDoc(blogRef);


    if (snapshot.exists()) {
      const data = snapshot.data();

      if (data.status === "published") {
        setBlog({
          id: snapshot.id,
          ...data,
        });
      }
    }
  } catch (error) {
    console.error("Error loading blog:", error);
  } finally {
    setLoading(false);
  }
};

fetchBlog();


}, [slug]);

const formatDate = (timestamp) => {
if (!timestamp?.toDate) return "";


return timestamp.toDate().toLocaleDateString("en-IN", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});


};

if (loading) {
return ( <div className="min-h-screen bg-white"> <Navbar />


    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-teal-700 animate-spin" />
    </div>
  </div>
);


}

if (!blog) {
return ( <div className="min-h-screen bg-white"> <Navbar />


    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
        <FileText className="w-7 h-7 text-slate-400" />
      </div>

      <h1 className="mt-5 text-3xl font-black text-slate-900">
        Article Not Found
      </h1>

      <p className="mt-2 text-slate-500">
        This article may have been removed or is no longer available.
      </p>

      <Link
        to="/blogs"
        className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-700 text-white font-bold"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Blogs
      </Link>
    </div>

    <Footer />
  </div>
);


}

return ( <div className="min-h-screen bg-gradient-to-b from-rose-50/20 via-white to-teal-50/20"> <Navbar />


  {/* HERO IMAGE */}

  <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
    <Link
      to="/blogs"
      className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-teal-700 transition"
    >
      <ArrowLeft className="w-4 h-4" />
      Back to Blogs
    </Link>

    <div className="mt-8">
      {blog.coverImage ? (
        <div className="h-[280px] sm:h-[400px] lg:h-[520px] rounded-[2rem] overflow-hidden shadow-xl">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : null}
    </div>
  </section>

  {/* ARTICLE */}

  <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="flex flex-wrap items-center gap-3">
      {blog.category && (
        <span className="px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wide">
          {blog.category}
        </span>
      )}

      <span className="flex items-center gap-1.5 text-sm text-slate-400 font-medium">
        <CalendarDays className="w-4 h-4" />
        {formatDate(blog.publishedAt || blog.createdAt)}
      </span>
    </div>

    <h1 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
      {blog.title}
    </h1>

    {blog.excerpt && (
      <p className="mt-6 text-xl text-slate-500 leading-relaxed">
        {blog.excerpt}
      </p>
    )}

    <div className="mt-8 pb-8 border-b border-slate-200">
      <p className="text-sm font-bold text-slate-600">
        By {blog.author || "Sai Brindavan Hospital"}
      </p>
    </div>

    <article className="mt-10">
      <div className="whitespace-pre-line text-lg text-slate-700 leading-[1.9]">
        {blog.content}
      </div>
    </article>
  </main>

  <Footer />
</div>


);
};

export default BlogDetails;
