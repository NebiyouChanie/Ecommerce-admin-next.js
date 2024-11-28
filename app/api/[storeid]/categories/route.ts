import prismadb from "@/lib/prismaDb";
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(
    req:Request,
    { params }: { params: { storeid: string } }
) {
    try {
        const {userId} = await auth()
        const body = await req.json()
        const { name, billboardId } = body;

        if(!userId) {
            return new NextResponse("unauthencticated",{status: 401})
        }
        
        if(!name) {
            return new NextResponse("Name is required",{status: 400})
        }
        
        if(!billboardId) {
            return new NextResponse("Billboard url is required",{status: 400})
        }

        if(!params.storeid) {
            return new NextResponse("Store id is required",{status: 400})
        }
        
        const storeByUserId = await prismadb.store.findFirst({
            where: {       
                id: params.storeid,
                userId
            },
        });

        if(!storeByUserId) {
            return new NextResponse("Unauthorized",{status: 403})
        }


        const category = await prismadb.category.create({
            data: {
                name,
                billboardId,
                storeId: params.storeid
            },
        });
        

        return NextResponse.json(category)


    } catch (error) {
         console.log("Categories POST~ file: route.ts:5 ~ POST ~ error:", error)
         return new NextResponse("Internal error",{status:500})
    }
}



export async function GET(
    req:Request,
    { params }: { params: { storeid: string } }
) {
    try {
        
        if(!params.storeid) {
            return new NextResponse("Store id is required",{status: 400})
        }
        
 
        const Categories = await prismadb.category.findMany({
            where: {
                storeId: params.storeid
            },
        });
        

        return NextResponse.json(Categories)


    } catch (error) {
         console.log("Categories GET~ file: route.ts:5 ~ POST ~ error:", error)
         return new NextResponse("Internal error",{status:500})
    }
}