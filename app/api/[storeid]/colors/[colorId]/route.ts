import prismadb from "@/lib/prismaDb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"


export async function GET(
    req:Request,
    { params }: { params: { colorId: string }}
) {
    try {

        if(!params.colorId) {
            return new NextResponse("Color Id is required",{status: 400})
        }

        const color = await prismadb.color.findUnique({
            where: {
                id:params.colorId,
            },
             
        });

        return NextResponse.json(color)
        
    } catch (error) {
        console.log("Color GET ~ file: route.ts:8 ~ error:dlete", error)
        return new NextResponse("Internal error", {status: 500});
    }
}


export async function PATCH(
    req:Request,
    { params }: { params: { storeid: string,  colorId: string }}
) {
    try {
        const {userId} = await auth()
        const body = await req.json()
        const { name, value } = body;

        if(!userId) {
            return new NextResponse("unauthorized",{status: 401})
        }

        if(!name) {
            return new NextResponse("Name is required",{status: 400})
        }
        
        if(!value) {
            return new NextResponse("Value is required",{status: 400})
        }

        if(!params.colorId) {
            return new NextResponse("Color Id is required",{status: 400})
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

        const color = await prismadb.color.updateMany({
            where: {       
                id: params.colorId,
            },
            data: {
                name,
                value
            }
        });


        return NextResponse.json(color)

        
    } catch (error) {
        console.log("Color patch ~ file: route.ts:8 ~ error:", error)
        return new NextResponse("Internal error", {status: 500});
    }
}



export async function DELETE(
    req:Request,
    { params }: { params: { storeid: string,  colorId: string }}
) {
    try {
        const {userId} = await auth()

        if(!userId) {
            return new NextResponse("unauthnenticated",{status: 401})
        }

        if(!params.colorId) {
            return new NextResponse("Color Id is required",{status: 400})
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

        const color = await prismadb.color.deleteMany({
            where: {
                id:params.colorId,
            },
             
        });

        return NextResponse.json(color)

        
    } catch (error) {
        console.log("Color Delete ~ file: route.ts:8 ~ error:dlete", error)
        return new NextResponse("Internal error", {status: 500});
    }
}