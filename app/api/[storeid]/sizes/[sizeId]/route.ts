import prismadb from "@/lib/prismaDb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"


export async function GET(
    req:Request,
    { params }: { params: { sizeId: string }}
) {
    try {

        if(!params.sizeId) {
            return new NextResponse("Size Id is required",{status: 400})
        }

        const size = await prismadb.size.findUnique({
            where: {
                id:params.sizeId,
            },
             
        });

        return NextResponse.json(size)
        
    } catch (error) {
        console.log("Size GET ~ file: route.ts:8 ~ error:dlete", error)
        return new NextResponse("Internal error", {status: 500});
    }
}


export async function PATCH(
    req:Request,
    { params }: { params: { storeid: string,  sizeId: string }}
) {
    try {
        const {userId} = await auth()
        const body = await req.json()
        const { name, value } = body;

        if(!userId) {
            return new NextResponse("unauthorized",{status: 401})
        }

        if(!name) {
            return new NextResponse("Label is required",{status: 400})
        }
        
        if(!value) {
            return new NextResponse("Image url is required",{status: 400})
        }

        if(!params.sizeId) {
            return new NextResponse("Size Id is required",{status: 400})
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

        const size = await prismadb.size.updateMany({
            where: {       
                id: params.sizeId,
            },
            data: {
                name,
                value
            }
        });


        return NextResponse.json(size)

        
    } catch (error) {
        console.log("Size patch ~ file: route.ts:8 ~ error:", error)
        return new NextResponse("Internal error", {status: 500});
    }
}



export async function DELETE(
    req:Request,
    { params }: { params: { storeid: string,  sizeId: string }}
) {
    try {
        const {userId} = await auth()

        if(!userId) {
            return new NextResponse("unauthnenticated",{status: 401})
        }

        if(!params.sizeId) {
            return new NextResponse("Size Id is required",{status: 400})
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

        const size = await prismadb.size.deleteMany({
            where: {
                id:params.sizeId,
            },
             
        });

        return NextResponse.json(size)

        
    } catch (error) {
        console.log("Size Delete ~ file: route.ts:8 ~ error:dlete", error)
        return new NextResponse("Internal error", {status: 500});
    }
}