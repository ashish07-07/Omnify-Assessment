'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/app/components/ui/button'

interface BlogPost {
  id: number
  title: string
  description: string
}

export default function BlogDetail() {
  const params = useParams()
  const router = useRouter()
  const [blog, setBlog] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        if (!params.id) return

        const response = await fetch(`/api/seedetailedblog?id=${params.id}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Blog post not found')
          } else {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
        }

        const data = await response.json()
        setBlog(data)
      } catch (err) {
        console.error('Fetch error:', err)
        setError('Failed to load blog post')
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [params.id])

  const handleGoBack = () => {
    router.push('/seeallblogs')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-pulse">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center bg-black min-h-screen flex flex-col justify-center">
        <h2 className="text-3xl font-bold text-red-600 mb-4">
          {error}
        </h2>
        <Button onClick={handleGoBack} className="mx-auto">
          <ArrowLeft className="mr-2" /> Back to Blogs
        </Button>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center bg-black min-h-screen flex flex-col justify-center">
        <h2 className="text-3xl font-bold text-gray-600 mb-4">
          No blog data available
        </h2>
        <Button onClick={handleGoBack} className="mx-auto">
          <ArrowLeft className="mr-2" /> Back to Blogs
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
      
        <div className="mb-8">
          <Button 
            onClick={handleGoBack} 
            variant="outline" 
            className="mb-6 text-black-700 hover:bg-black-50"
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Blog List
          </Button>
        </div>

        
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold text-gray-900">
            {blog.title}
          </h1>
          
          <div className="prose prose-lg text-gray-600">
            {blog.description.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}