import { NextResponse } from "next/server";
import prisma from "@/app/db";

export async function DELETE(req: Request) { 
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

  
    if (!id) {
      return NextResponse.json(
        { error: "ID parameter is required" },
        { status: 400 }  
      );
    }

  
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json(
        { error: "Invalid ID format" },
        { status: 400 }
      );
    }

    
    const deletedBlog = await prisma.blog.delete({
      where: { id: numericId }
    });

    
    return NextResponse.json(
      { 
        success: true,
        message: "Blog deleted successfully",
        data: deletedBlog 
      },
      { status: 200 }
    );

  } catch (e: any) {
    console.error("Delete error:", e);
    

    if (e.code === 'P2025') {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    
    return NextResponse.json(
      { 
        error: "Internal server error",
        message: e.message 
      },
      { status: 500 }  
    );
  }
}


