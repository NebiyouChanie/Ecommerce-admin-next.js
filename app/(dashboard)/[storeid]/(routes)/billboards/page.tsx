import prismadb from "@/lib/prismaDb"
import { BillboardClient } from "./components/client"
import { Billboard } from "@prisma/client"
import { BillboardColumn } from "./components/columns"
import {format} from 'date-fns'

const BillboardsPage = async({
    params 
} : {
    params :  { storeid: string}
}) =>{
    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId: params.storeid
        },
        orderBy: {
            createdAt: 'desc' //newest
        }
    })

    const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
        id: item.id,
        label: item.label,
        createdAt: format(item.createdAt,"MMMM do, yyyy")
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardClient data={formattedBillboards}/>
            </div>
        </div>
    )
}

export default BillboardsPage