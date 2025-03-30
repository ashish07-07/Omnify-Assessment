

import { NextResponse } from 'next/server';
import prisma from '@/app/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        
        
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '6');
        const skip = (page - 1) * limit;

        
        const blogs = await prisma.blog.findMany({
            skip,
            take: limit,
            select: {
                id: true,
                title: true,
                description: true
            }
        });

        
        const total = await prisma.blog.count();

        return NextResponse.json({
            response: blogs,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit)
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching blogs:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}