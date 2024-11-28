'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard, Category } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import * as  z from "zod";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 

//Used with zodResolver for validating form inputs.  used for defining the type
const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1),
});

//Ensures form data adheres to the schema structure.
type CategoryFormValues = z.infer<typeof formSchema>;

//Ensures the component receives the correct props.
interface CategoryFormProps {
    initialData: Category | null;
    billboards: Billboard[];
}


const CategoryForm: React.FC<CategoryFormProps> = (
    {initialData, billboards}
) => {
    const params = useParams();
    const router = useRouter();
    
    
    const title = initialData ? "Edit Category" : "Create Category"
    const description = initialData ? "Edit a Category" : "Add a new Category"
    const action = initialData ? "Save Changes" : "Create"
    const toastMessage = initialData ? "Category Updated" : "Category Created"
    
    const [open, setOpen] = useState(false);
    const [loading, setloading] = useState(false);
    
    const form = useForm<CategoryFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData || {
            name: '',
            billboardId: '',
            
        }
    })
    
    
    const onSubmit = async (data: CategoryFormValues) => {
        try {
            setloading(true)
            if (initialData) {
                const response = await axios.patch(`/api/${params.storeid}/categories/${params.categoryId}`,data)
            } else {
                const response = await axios.post(`/api/${params.storeid}/categories`,data)
            }
            router.refresh();
            toast.success(toastMessage)
            router.push(`/${params.storeid}/categories`)

        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setloading(false)
        }
    }

    const onDelete = async () => {
        try {
            setloading(true)
            const response = await axios.delete(`/api/${params.storeid}/categories/${params.categoryId}`)
            router.refresh();
            toast.success("Category Deleted successfully")
            router.push(`/${params.storeid}/categories`)
        } catch (error) {
            toast.error("Make sure you removed all categories using this billboard first.")
        } finally {
            setloading(false)
            setOpen(false)
        }
    }


    return (
        <>
            <AlertModal 
                isOnpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading 
                    title= {title}
                    description= {description}
                    />

                {initialData && <Button
                    variant='destructive'
                    size='sm'
                    onClick={()=>{setOpen(true)}}
                    disabled={loading}
                    >
                    <Trash className="h-4 w-4"/>
                </Button>}
            </div>
            <Separator />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                        
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field})=>( 
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input  disabled={loading} placeholder="Category name" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="billboardId"
                            render={({field})=>( 
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <Select 
                                        disabled={loading} 
                                        onValueChange={field.onChange} 
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a billboard" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {billboards.map((billboard) => (
                                                <SelectItem
                                                    key={billboard.id}
                                                    value={billboard.id}
                                                >
                                                    {billboard.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                         {action}
                    </Button>
                </form>
            </Form>
            <Separator />
             

        </>
    );
}

export default CategoryForm;
