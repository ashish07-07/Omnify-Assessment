interface Blogdetails{
    title:string,
    description:string,
    id:number

}
import prisma from "@/app/db"
import { NextResponse } from "next/server";
export async  function POST(req:any,res:any)
{
   try 
   {
       const body:Blogdetails= await req.json()
       console.log(`the body is ${body}`);

       const response= await prisma.blog.create(


        {
            data:
            {
                 title:body.title,
                 description:body.description,
                 authorId:body.id

            }
        }
       )

      return NextResponse.json(
        {
            response
        },
        {
            status:200
        }
      )


   }

   catch (e:any)
   {
       return NextResponse.json(
        {
            message:"Not able to add the Blog"
        },
        {
            status:404
        }
       )
   }

}