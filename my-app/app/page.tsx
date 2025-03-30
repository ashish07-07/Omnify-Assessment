

import Link from "next/link";
import { BookOpen, PenSquare, LogIn } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      
      <header className="w-full py-6 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xl sm:text-2xl">Omnify</span>
          </div>
          
          <Link href="/api/auth/signin">
            <button className="flex items-center space-x-2 px-4 py-2 border border-black rounded-full hover:bg-black hover:text-white transition-colors duration-300">
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          </Link>
        </div>
      </header>

      
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-12">
            Create & Explore Blogs
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/Createblog">
              <button className="w-full sm:w-auto bg-black text-white px-8 py-4 rounded-lg flex items-center justify-center space-x-3 hover:bg-gray-900 transition-colors duration-300 shadow-lg">
                <PenSquare className="w-5 h-5" />
                <span>Create Blog</span>
              </button>
            </Link>
            
            <Link href="/seeallblogs">
              <button className="w-full sm:w-auto bg-white text-black px-8 py-4 rounded-lg flex items-center justify-center space-x-3 border-2 border-black hover:bg-gray-50 transition-colors duration-300 shadow-lg">
                <BookOpen className="w-5 h-5" />
                <span>See Blogs</span>
              </button>
            </Link>
          </div>
        </div>
      </main>

      
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-sm text-gray-500">Made with Love</span>
        </div>
      </footer>
    </div>
  );
}