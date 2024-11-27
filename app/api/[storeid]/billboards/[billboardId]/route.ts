import prismadb from "@/lib/prismaDb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"


export async function GET(
    req:Request,
    { params }: { params: { billboardId: string }}
) {
    try {

        if(!params.billboardId) {
            return new NextResponse("Billboard Id is required",{status: 400})
        }

        const billboard = await prismadb.billboard.findMany({
            where: {
                id:params.billboardId,
            },
             
        });

        return NextResponse.json(billboard)
        
    } catch (error) {
        console.log("Billboard GET ~ file: route.ts:8 ~ error:dlete", error)
        return new NextResponse("Internal error", {status: 500});
    }
}


export async function PATCH(
    req:Request,
    { params }: { params: { storeid: string,  billboardId: string }}
) {
    try {
        const {userId} = await auth()
        const body = await req.json()
        const { label, imageUrl } = body;

        if(!userId) {
            return new NextResponse("unauthorized",{status: 401})
        }

        if(!label) {
            return new NextResponse("Label is required",{status: 400})
        }
        
        if(!imageUrl) {
            return new NextResponse("Image url is required",{status: 400})
        }

        if(!params.billboardId) {
            return new NextResponse("Store Id is required",{status: 400})
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

        const billboard = await prismadb.billboard.updateMany({
            where: {       
                id: params.billboardId,
            },
            data: {
                label,
                imageUrl
            }
        });


        return NextResponse.json(billboard)

        
    } catch (error) {
        console.log("Billboard patch ~ file: route.ts:8 ~ error:", error)
        return new NextResponse("Internal error", {status: 500});
    }
}



export async function DELETE(
    req:Request,
    { params }: { params: { storeid: string,  billboardId: string }}
) {
    try {
        const {userId} = await auth()

        if(!userId) {
            return new NextResponse("unauthnenticated",{status: 401})
        }

        if(!params.billboardId) {
            return new NextResponse("Billboard Id is required",{status: 400})
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

        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id:params.billboardId,
            },
             
        });

        return NextResponse.json(billboard)

        
    } catch (error) {
        console.log("Billboard Delete ~ file: route.ts:8 ~ error:dlete", error)
        return new NextResponse("Internal error", {status: 500});
    }
}