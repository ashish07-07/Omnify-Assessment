

"use client"
import React, { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { ChevronLeft, ChevronRight, Eye, Plus, Home } from "lucide-react"
import Link from "next/link"
import { Button } from "../components/ui/button"
import { useRouter } from "next/navigation"

interface BlogPost {
  id: string
  title: string
  description: string
  coverImage?: string
  author?: string
  date?: string
}

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const BLOGS_PER_PAGE = 6

  useEffect(() => {
    async function fetchBlogs() {
      try {
        setIsLoading(true)
        const response: any = await axios.get('/api/getallblogscl', {
          params: {
            page: currentPage,
            limit: BLOGS_PER_PAGE
          }
        })

        setBlogs(response.data.response)
        setTotalPages(Math.ceil(response.data.total / BLOGS_PER_PAGE))
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to fetch blogs", error)
        setIsLoading(false)
      }
    }

    fetchBlogs()
  }, [currentPage])

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-pulse">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex justify-between mb-8">
          <Button 
            onClick={() => router.push('/')}
            className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm flex items-center"
          >
            <Home className="mr-2 h-5 w-5" /> Home
          </Button>
          
          <Button 
            onClick={() => router.push('/Createblog')}
            className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm flex items-center"
          >
            <Plus className="mr-2 h-5 w-5" /> Create Blog
          </Button>
        </div>

      
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Our Latest Insights
          </h1>
          <p className="mt-5 text-xl text-gray-500 max-w-3xl mx-auto">
            Discover thought-provoking articles and stories that inspire and inform.
          </p>
        </div>

        
        <div className="flex justify-center space-x-4 mb-10">
          <Button 
            onClick={handlePrevPage} 
            disabled={currentPage === 1}
            className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm"
          >
            <ChevronLeft className="mr-2 h-5 w-5" /> Previous
          </Button>
          <Button 
            onClick={handleNextPage} 
            disabled={currentPage === totalPages}
            className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm"
          >
            Next <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Card 
              key={blog.id} 
              className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2"
            >
              
              {blog.coverImage && (
                <div className="h-48 w-full overflow-hidden rounded-t-xl">
                  <img 
                    src={blog.coverImage} 
                    alt={blog.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}

              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-start">
                  <span className="text-xl font-semibold text-gray-900 line-clamp-2">
                    {blog.title}
                  </span>
                  <Link href={`/blog/${blog.id}`} className="ml-2">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="text-gray-500 hover:text-blue-600"
                    >
                      <Eye className="h-5 w-5" />
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600 line-clamp-3 mb-4">
                  {blog.description}
                </p>

                
                {(blog.author || blog.date) && (
                  <div className="flex justify-between text-sm text-gray-500">
                    {blog.author && <span>{blog.author}</span>}
                    {blog.date && <span>{blog.date}</span>}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        
        <div className="mt-10 text-center">
          <span className="text-gray-600 font-medium">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      </div>
    </div>
  )
}