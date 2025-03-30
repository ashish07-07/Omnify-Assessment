


"use client"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import axios from 'axios'
import { useRouter } from 'next/navigation';

interface BlogPost {
  id: number
  title: string
  description: string
  createdAt: string
}

export default function AuthorBlogs() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session, status } = useSession()
  const [blogupdate, setBlogupdate] = useState<Boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);
  const id = session?.user?.id

  const handleEdit = (blogId: number) => {
    console.log('Edit blog with ID:', blogId)
    router.push(`/edit/${blogId}`)
  }
  
  const handleDelete = async (blogId: number) => {
    try {
      console.log('Delete blog with ID:', blogId)
      const response = await axios.delete('/api/deleteblogs',
        {
          params: {
            id: blogId
          }
        }
      )
      setBlogupdate(true);
      setNotification("Blog post successfully deleted!");
      
    
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (error) {
      console.error("Delete error:", error);
      setNotification("Failed to delete blog post. Please try again.");
      
      
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  }

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true)
        setError(null)

        if (status === 'authenticated' && session?.user?.id) {
          const response:any= await axios.get(`/api/allauthorblogs?id=${id}`)
          if (response.status === 200) {
            setBlogs(response.data)
          } else {
            throw new Error('Failed to fetch blogs')
          }
        }
      } catch (err) {
        console.error("API Error:", err)
        setError("Failed to load blogs. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (status !== 'loading') {
      fetchBlogs()
    }
  }, [status, session?.user?.id, blogupdate])

  if (status === 'loading') {
    return <div className="p-4 bg-white text-black w-full">Loading session...</div>
  }

  if (!session) {
    return <div className="p-4 bg-white text-red-500 w-full">Please sign in to view your blogs</div>
  }

  if (error) {
    return (
      <div className="p-4 bg-white min-h-screen w-full">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white min-h-screen text-black w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Your Blog Posts</h1>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => router.push('/')}
            className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => router.push('/seeallblogs')}
            className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 transition-colors"
          >
            All Blogs
          </button>
        </div>
      </div>
      
      {/* Notification */}
      {notification && (
        <div className={`mb-4 p-3 rounded-lg ${notification.includes("Failed") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"} transition-all duration-300 ease-in-out`}>
          {notification}
        </div>
      )}
      
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-20 rounded-lg"></div>
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="border border-gray-200 p-8 rounded-lg shadow-sm bg-gray-50 text-center">
          <h3 className="text-xl font-medium text-gray-800 mb-2">No Blog Posts Found</h3>
          <p className="text-gray-600 mb-4">You haven't created any blog posts yet.</p>
          <button
            onClick={() => router.push('/createblog')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Create Your First Blog
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {blogs.map(blog => (
            <div key={blog.id} className="border border-gray-200 p-4 rounded-lg shadow-sm bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
                  <p className="text-gray-700 mb-3">{blog.description}</p>
                  <div className="text-sm text-gray-500">
                    Posted on: {new Date(blog.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2 mt-3 sm:mt-0 sm:ml-4">
                  <button
                    className="bg-white text-black border border-gray-300 px-3 py-1 rounded hover:bg-gray-100"
                    onClick={() => handleEdit(blog.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-white text-black border border-gray-300 px-3 py-1 rounded hover:bg-gray-100"
                    onClick={() => handleDelete(blog.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}