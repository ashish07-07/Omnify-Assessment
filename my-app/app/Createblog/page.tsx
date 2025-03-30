

"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Blogdetails {
  title: string;
  description: string;
}

export default function BlogForm() {
  const [blog, setBlog] = useState<Blogdetails>({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const router = useRouter();
  const session = useSession();
  const email = session.data?.user?.email;

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [session.status, router]);

  async function changeHandler(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setBlog((prev) => ({ ...prev, [name]: value }));
  }

  async function submitHandler(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      setLoading(true);
      console.log("Submitted:", blog);

      const response:any= await axios.get('/api/useriddetails', {
        params: { email }
      });
      console.log(response.data.id);
      console.log(response);

      const id = response.data.id;

      await axios.post("/api/blogcreation", {
        title: blog.title,
        description: blog.description,
        id: id,
      });

      setNotification("Blog created successfully!");
      console.log("Blog Created Successfully!");
      
     
      setTimeout(() => {
        router.push("/seeallblogs");
      }, 1500);
    } catch (error) {
      console.error("Error submitting blog:", error);
      setNotification("Error creating blog. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white w-full p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black">Create New Blog</h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/')}
              className="bg-white text-black px-4 py-2 rounded border border-green-500 hover:bg-green-50 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => router.push('/authorblogs')}
              className="bg-white text-black px-4 py-2 rounded border border-green-500 hover:bg-green-50 transition-colors"
            >
              My Blogs
            </button>
          </div>
        </div>

        {notification && (
          <div className={`mb-6 p-4 rounded-lg ${
            notification.includes("Error") 
              ? "bg-red-100 text-red-700" 
              : "bg-green-100 text-green-700"
          }`}>
            {notification}
          </div>
        )}

        <form onSubmit={submitHandler} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-black mb-1">
                Blog Title
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={blog.title}
                onChange={changeHandler}
                className="w-full px-4 py-3 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-black placeholder-black"
                placeholder="PLease Enter the title Here"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-black mb-1">
                Blog Content
              </label>
              <textarea
                id="description"
                name="description"
                value={blog.description}
                onChange={changeHandler}
                rows={10}
                className="w-full px-4 py-3 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-y text-black placeholder-black"
                placeholder="Write your blog content here..."
                required
              ></textarea>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={!blog.title || !blog.description || loading}
                className={`w-full bg-white text-black px-6 py-3 rounded-lg font-medium border-2 border-green-600 hover:bg-green-50 transition-colors ${
                  (!blog.title || !blog.description || loading) 
                    ? "opacity-50 cursor-not-allowed" 
                    : ""
                }`}
              >
                {loading ? "Creating Blog..." : "Publish Blog"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}