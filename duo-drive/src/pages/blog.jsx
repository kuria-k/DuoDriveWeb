import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const API_KEY = "pub_205b7a603b164e74a875a265aa0beff1"; 
        const res = await fetch(
          `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=automotive%20OR%20cars&language=en`
        );
        const data = await res.json();
        setBlogs(data.results || []); 
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      <section className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold mb-10 text-center">
          Auto <span className="text-[#2fa88a]">Insights</span>
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading latest articles...</p>
        ) : blogs.length === 0 ? (
          <p className="text-center text-gray-500">
            No articles found right now — try again soon.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {blogs.map((blog, idx) => (
              <article
                key={idx}
                className="bg-white shadow-lg rounded-xl overflow-hidden hover:scale-105 transition"
              >
                {blog.image_url && (
                  <img
                    src={blog.image_url}
                    alt={blog.title}
                    className="h-48 w-full object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2 text-black">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {blog.description}
                  </p>
                  <a
                    href={blog.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2fa88a] font-semibold hover:underline"
                  >
                    Read More →
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Blog;

