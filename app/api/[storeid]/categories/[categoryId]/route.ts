import prismadb from "@/lib/prismaDb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"


export async function GET(
    req:Request,
    { params }: { params: { categoryId: string }}
) {
    try {

        if(!params.categoryId) {
            return new NextResponse("Category Id is required",{status: 400})
        }

        const category = await prismadb.category.findUnique({
            where: {
                id:params.categoryId,
            },
             
        });

        return NextResponse.json(category)
        
    } catch (error) {
        console.log("Category GET ~ file: route.ts:8 ~ error:dlete", error)
        return new NextResponse("Internal error", {status: 500});
    }
}


export async function PATCH(
    req:Request,
    { params }: { params: { storeid: string,  categoryId: string }}
) {
    try {
        const {userId} = await auth()
        const body = await req.json()
        const { name, billboardId } = body;

        if(!userId) {
            return new NextResponse("unauthorized",{status: 401})
        }

        if(!name) {
            return new NextResponse("Name is required",{status: 400})
        }
        
        if(!billboardId) {
            return new NextResponse("Billboard Id is required",{status: 400})
        }

        if(!params.categoryId) {
            return new NextResponse("Category Id is required",{status: 400})
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

        const category = await prismadb.category.updateMany({
            where: {       
                id: params.categoryId,
            },
            data: {
                name,
                billboardId
            }
        });


        return NextResponse.json(category)

        
    } catch (error) {
        console.log("Category patch ~ file: route.ts:8 ~ error:", error)
        return new NextResponse("Internal error", {status: 500});
    }
}



export async function DELETE(
    req:Request,
    { params }: { params: { storeid: string,  categoryId: string }}
) {
    try {
        const {userId} = await auth()

        if(!userId) {
            return new NextResponse("unauthnenticated",{status: 401})
        }

        if(!params.categoryId) {
            return new NextResponse("Category Id is required",{status: 400})
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

        const category = await prismadb.category.deleteMany({
            where: {
                id:params.categoryId,
            },
             
        });

        return NextResponse.json(category)

        
    } catch (error) {
        console.log("Category Delete ~ file: route.ts:8 ~ error:dlete", error)
        return new NextResponse("Internal error", {status: 500});
    }
}