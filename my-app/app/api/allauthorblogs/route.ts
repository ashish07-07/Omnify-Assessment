

import prisma from "@/app/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const numericUserId = parseInt(userId, 10);
    if (isNaN(numericUserId)) {
      return NextResponse.json(
        { error: "Invalid User ID format" },
        { status: 400 }
      );
    }

    const blogs = await prisma.blog.findMany({
      where: {
        authorId: numericUserId
      },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true
      }
    });

    return NextResponse.json(blogs, { status: 200 });

  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}