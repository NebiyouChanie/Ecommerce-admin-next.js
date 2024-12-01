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
        const { 
            name,  
            price,
            categoryId,
            colorId,
            sizeId,
            images,
            isFeatured,
            isArchived,  
        } = body;

        if(!userId) {
            return new NextResponse("unauthencticated",{status: 401})
        }
        
        if(!name) {
            return new NextResponse("Name is required",{status: 400})
        }
        
        if(!images || !images.length) {
            return new NextResponse("Images are required",{status: 400})
        }
        if(!price) {
            return new NextResponse("Price url is required",{status: 400})
        }
        if(!sizeId) {
            return new NextResponse("Size  id  is required",{status: 400})
        }
        if(!categoryId) {
            return new NextResponse("Category id is required",{status: 400})
        }
        if(!colorId) {
            return new NextResponse("Color id is required",{status: 400})
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


        const product = await prismadb.product.create({
            data: {
                name,  
                price,
                categoryId,
                colorId,
                sizeId,
                isFeatured,
                isArchived,
                storeId: params.storeid,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: {url:string}) => image)
                        ]
                    }
                }
            },
        });
        

        return NextResponse.json(product)


    } catch (error) {
         console.log("PRODUCT POST~ file: route.ts:5 ~ POST ~ error:", error)
         return new NextResponse("Internal error",{status:500})
    }
}



export async function GET(
    req:Request,
    { params }: { params: { storeid: string } }
) {
    try {
        const {searchParams} = new URL(req.url);
        const categoryId = searchParams.get("categoryId") || undefined;
        const colorId = searchParams.get("colorId") || undefined;
        const sizeId = searchParams.get("sizeId") || undefined;
        const isFeatured = searchParams.get("isFeatured") || undefined;

        if(!params.storeid) {
            return new NextResponse("Store id is required",{status: 400})
        }
        
 
        const product = await prismadb.product.findMany({
            where: {
                storeId: params.storeid,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false

            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        

        return NextResponse.json(product)


    } catch (error) {
         console.log("Products GET~ file: route.ts:5 ~ POST ~ error:", error)
         return new NextResponse("Internal error",{status:500})
    }
}