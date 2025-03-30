import prisma from "@/app/db";
import { NextResponse } from "next/server";
export async function GET(req:any,res:any)

{   

     try 
     {
        const response=await prisma.blog.findMany(
            {
    
            }
        )

        return NextResponse.json(
            {
                  response
            }
        )
     }

     catch (e:any)
     {
         return NextResponse.json(
            {
                message:"No Blogs found somethigng went wrong"
            }
         )
     }
   

}