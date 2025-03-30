import axios from "axios";
import prisma from "@/app/db";
import { NextResponse } from "next/server";
export async function PUT(req:any,res:any)
{
     try 
     {
           const body= await req.json();
           console.log(body.blog.title);
           console.log(body.blog.description)
           console.log(body.blog.id)
           let id = parseInt(body.blog.id, 10);
         const response=await prisma.blog.update(
            {
                where:
                {
                     id:id
                },data:
                {
                      title:body.blog.title,
                      description:body.blog.description,
                      authorId:body.blog.authorId
                }
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
                message:"Something went wrong dude"
            }
          )
     }

}