import prismadb from "@/lib/prismaDb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"


export async function GET(
    req:Request,
    { params }: { params: { productId: string }}
) {
    try {

        if(!params.productId) {
            return new NextResponse("Product Id is required",{status: 400})
        }

        const product = await prismadb.product.findUnique({
            where: {
                id:params.productId,
            },
             include: {
                images: true,
                category: true,
                size: true,
                color: true,
             }
        });

        return NextResponse.json(product)
        
    } catch (error) {
        console.log("PRODUCT GET ~ file: route.ts:8 ~ error:dlete", error)
        return new NextResponse("Internal error", {status: 500});
    }
}


export async function PATCH(
    req:Request,
    { params }: { params: { storeid: string,  productId: string }}
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
            return new NextResponse("unauthorized",{status: 401})
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

        if(!params.productId) {
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

        await prismadb.product.update({
            where: {       
                id: params.productId,
            },
            data: {
                name,  
                price,
                categoryId,
                colorId,
                sizeId,
                images: {
                    deleteMany: {}
                },
                isFeatured,
                isArchived, 
            }
        });

        const product = await prismadb.product.update({
            where: {
                id: params.productId
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image:{url:string})=> image),
                        ]
                    }
                }
            }
        })


        return NextResponse.json(product)

        
    } catch (error) {
        console.log("Product patch ~ file: route.ts:8 ~ error:", error)
        return new NextResponse("Internal error", {status: 500});
    }
}



export async function DELETE(
    req:Request,
    { params }: { params: { storeid: string,  productId: string }}
) {
    try {
        const {userId} = await auth()

        if(!userId) {
            return new NextResponse("unauthnenticated",{status: 401})
        }

        if(!params.productId) {
            return new NextResponse("product Id is required",{status: 400})
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

        const product = await prismadb.product.deleteMany({
            where: {
                id:params.productId,
            },
             
        });

        return NextResponse.json(product)

        
    } catch (error) {
        console.log("Product Delete ~ file: route.ts:8 ~ error:dlete", error)
        return new NextResponse("Internal error", {status: 500});
    }
}