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
        const { label, imageUrl } = body;

        if(!userId) {
            return new NextResponse("unauthencticated",{status: 401})
        }
        
        if(!label) {
            return new NextResponse("label is required",{status: 400})
        }
        
        if(!imageUrl) {
            return new NextResponse("Image url is required",{status: 400})
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


        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeid
            },
        });
        

        return NextResponse.json(billboard)


    } catch (error) {
         console.log("BILLBORD POST~ file: route.ts:5 ~ POST ~ error:", error)
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
        
 
        const billboard = await prismadb.billboard.findMany({
            where: {
                storeId: params.storeid
            },
        });
        

        return NextResponse.json(billboard)


    } catch (error) {
         console.log("BILLBORD GET~ file: route.ts:5 ~ POST ~ error:", error)
         return new NextResponse("Internal error",{status:500})
    }
}