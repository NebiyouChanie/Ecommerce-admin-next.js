import prismadb from "@/lib/prismaDb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation"

export default async function DashboardLayout({
    children,params
}:{
    children:React.ReactNode;
    params: {sotreId: string}
}){
    const { userId } = await auth();

    if (!userId) {
        redirect('/sign-in');
    }

    const store = await prismadb.store.findFirst({
        where: {
            id: params.sotreId,
            userId
        }
    })

    if (!store) {
        redirect('/');
    }

    return (
        <>
            This will be a navbar
            {children}
        </>
    )

}