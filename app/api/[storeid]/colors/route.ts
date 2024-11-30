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
        const { name, value } = body;

        if(!userId) {
            return new NextResponse("unauthencticated",{status: 401})
        }
        
        if(!name) {
            return new NextResponse("Name is required",{status: 400})
        }
        
        if(!value) {
            return new NextResponse("Value url is required",{status: 400})
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


        const color = await prismadb.color.create({
            data: {
                name,
                value,
                storeId: params.storeid
            },
        });
        

        return NextResponse.json(color)


    } catch (error) {
         console.log("Color POST~ file: route.ts:5 ~ POST ~ error:", error)
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
        
 
        const Colors = await prismadb.color.findMany({
            where: {
                storeId: params.storeid
            },
        });
        

        return NextResponse.json(Colors)


    } catch (error) {
         console.log("Color GET~ file: route.ts:5 ~ POST ~ error:", error)
         return new NextResponse("Internal error",{status:500})
    }
}