import prismadb from "@/lib/prismaDb"
import { ColorsClient } from "./components/client"
import { ColorColumn } from "./components/columns"
import {format} from 'date-fns'

const ColorsPage = async({
    params 
} : {
    params :  { storeid: string}
}) =>{
    const colors = await prismadb.color.findMany({
        where: {
            storeId: params.storeid
        },
        orderBy: {
            createdAt: 'desc' //newest
        }
    })

    const formattedColors: ColorColumn[] = colors.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt,"MMMM do, yyyy")
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ColorsClient data={formattedColors}/>
            </div>
        </div>
    )
}

export default ColorsPage