

"use client"
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import axios from 'axios'
import { Button } from '@/app/components/ui/button'

interface BlogPost {
  id: number
  title: string
  description: string
  authorid: number
}

export default function BlogDetail() {
  const router = useRouter()
  const params = useParams()
  const [blog, setBlog] = useState<BlogPost>({ 
    title: "", 
    description: "", 
    id: 0, 
    authorid: 0 
  })
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBlog() {
      try {
        setLoading(true)
        const id = params.id
        const response:any= await axios.get('/api/seedetailedblog', {
          params: { id }
        })
        console.log(response.data)
        setBlog(response.data)
      } catch (err) {
        console.error("API Error:", err)
        setError("Failed to load blog. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchBlog()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      console.log(`After editing the final blog is ${blog.title} ${blog.description} and id is ${blog.id}`)
      
      const response = await axios.put('/api/updateblog', {
        blog
      })
      
      console.log(response)
      setNotification("Blog successfully updated!")
      
      
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    } catch (err) {
      console.error("Update Error:", err)
      setNotification("Failed to update blog. Please try again.")
      
      
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setBlog(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (loading) {
    return (
      <div className="p-4 max-w-3xl mx-auto bg-white min-h-screen text-black">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 max-w-3xl mx-auto bg-white min-h-screen text-black">
        <button 
          onClick={() => router.push('/authorblogs')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
        </button>
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
    <div className="p-4 max-w-3xl mx-auto bg-white min-h-screen text-black">
      <button 
        onClick={() => router.push('/authorblogs')}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
      </button>
      
      <h1 className="text-2xl font-bold mb-6">Edit Blog Post</h1>
      
    
      {notification && (
        <div className={`mb-4 p-3 rounded-lg ${notification.includes("Failed") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"} transition-all duration-300 ease-in-out`}>
          {notification}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Blog Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={blog.title}
            onChange={handleInputChange}
            className="block w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
            placeholder="Enter blog title"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Blog Content
          </label>
          <textarea
            id="description"
            name="description"
            value={blog.description}
            onChange={handleInputChange}
            rows={8}
            className="block w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black resize-y"
            placeholder="Enter blog content"
            required
          ></textarea>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Update Blog
          </button>
        </div>
      </form>
    </div>
  )
}