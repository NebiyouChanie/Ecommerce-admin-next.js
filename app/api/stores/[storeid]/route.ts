import prismadb from "@/lib/prismaDb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"

export async function PATCH(
    req:Request,
    { params }: { params: { storeid: string }}
) {
    try {
        const {userId} = await auth()
        const body = await req.json()
        const { name } = body;

        if(!userId) {
            return new NextResponse("unauthorized",{status: 401})
        }

        if(!name) {
            return new NextResponse("Name is required",{status: 400})
        }

        if(!params.storeid) {
            return new NextResponse("Store Id is required",{status: 400})
        }

        const store = await prismadb.store.updateMany({
            where: {
                id:params.storeid,
                userId
            },
            data:{
                name
            }
        });

        return NextResponse.json(store)

        
    } catch (error) {
        console.log("🚀 ~ file: route.ts:8 ~ error:", error)
        return new NextResponse("Internal error", {status: 500});
    }
}



export async function DELETE(
    req:Request,
    { params }: { params: { storeid: string }}
) {
    try {
        const {userId} = await auth()

        if(!userId) {
            return new NextResponse("unauthorized",{status: 401})
        }

        if(!params.storeid) {
            return new NextResponse("Store Id is required",{status: 400})
        }

        const store = await prismadb.store.deleteMany({
            where: {
                id:params.storeid,
                userId
            },
             
        });

        return NextResponse.json(store)

        
    } catch (error) {
        console.log("🚀 ~ file: route.ts:8 ~ error:dlete", error)
        return new NextResponse("Internal error", {status: 500});
    }
}