import prismadb from "@/lib/prismaDb"
import { CategoryClient } from "./components/client"
import {  CategoryColumn } from "./components/columns"
import {format} from 'date-fns'

const CategoriesPage = async({
    params 
} : {
    params :  { storeid: string}
}) =>{
    const categories = await prismadb.category.findMany({
        where: {
            storeId: params.storeid
        },
        include:{
            billboard: true,
        },
        orderBy: {
            createdAt: 'desc' //newest
        }
    })

    const formattedCategories: CategoryColumn[] = categories.map((item) => ({
        id: item.id,
        name: item.name,
        billboardLabel: item.billboard.label,
        createdAt: format(item.createdAt,"MMMM do, yyyy")
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryClient data={formattedCategories}/>
            </div>
        </div>
    )
}

export default CategoriesPage