'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import {  Category, Color, Image, Product, Size } from "@prisma/client";
import { Check, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import * as  z from "zod";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUload from "@/components/ui/image-upload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@radix-ui/react-checkbox";
 

//Used with zodResolver for validating form inputs.  used for defining the type
const formSchema = z.object({
    name: z.string().min(1),
    categoryId: z.string().min(1),
    sizeId: z.string().min(1),
    colorId: z.string().min(1),
    isFeatured: z.boolean().default(false) ,
    isArchived: z.boolean().default(false) ,
    price: z.coerce.number().min(1),
    images: z.object({url: z.string()}).array(),
});

//Ensures form data adheres to the schema structure.
type ProductFormValues = z.infer<typeof formSchema>;

//Ensures the component receives the correct props.
interface ProductFormsProps {
    initialData: Product & {
        image: Image[]
    } | null;
    categories:Category[];
    colors:Color[];
    sizes:Size[];
    
}


const ProductForm: React.FC<ProductFormsProps> = (
    {initialData, categories, sizes, colors}
) => {
    const params = useParams();
    const router = useRouter();
    
    
    const title = initialData ? "Edit Product" : "Create Product"
    const description = initialData ? "Edit a Product" : "Add a new Product"
    const action = initialData ? "Save Changes" : "Create"
    const toastMessage = initialData ? "Product Updated" : "Product Created"
    
    const [open, setOpen] = useState(false);
    const [loading, setloading] = useState(false);
    
    const form = useForm<ProductFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData ? {
            ...initialData,
            price: parseFloat(String(initialData?.price))
        }: {
            name: '',
            images: [],
            price: 0,
            categoryId:'',
            sizeId: '',
            colorId: '',
            isArchived: false,
            isFeatured: false,
        }
    })
    
    
    const onSubmit = async (data: ProductFormValues) => {
        try {
            setloading(true)
            if (initialData) {
                const response = await axios.patch(`/api/${params.storeid}/products/${params.productId}`,data)
            } else {
                const response = await axios.post(`/api/${params.storeid}/products`,data)
            }
            router.refresh();
            toast.success(toastMessage)
            router.push(`/${params.storeid}/products`)

        } catch (error) {
            toast.error("Something went error.")
        } finally {
            setloading(false)
        }
    }

    const onDelete = async () => {
        try {
            setloading(true)
            const response = await axios.delete(`/api/${params.storeid}/products/${params.productId}`)
            router.refresh();
            toast.success("Product Deleted successfully")
            router.push(`/${params.storeid}/products`)
        } catch (error) {
            toast.error("Something went wrong")
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
                        <FormField
                            control={form.control}
                            name="images"
                            render={({field})=>( 
                                <FormItem>
                                    <FormLabel>Images</FormLabel>
                                    <FormControl>
                                         <ImageUload 
                                            value={field.value.map((image) => image.url)} 
                                            disabled={loading}
                                            onChange={(url) => field.onChange([...field.value, {url}])}
                                            onRemove={(url) => field.onChange([...field.value.filter((current)=> current.url !== url)])}
                                         />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field})=>( 
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input  disabled={loading} placeholder="Product name" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({field})=>( 
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input type="number"  disabled={loading} placeholder="9.99" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({field})=>( 
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select 
                                        disabled={loading} 
                                        onValueChange={field.onChange} 
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sizeId"
                            render={({field})=>( 
                                <FormItem>
                                    <FormLabel>Size</FormLabel>
                                    <Select 
                                        disabled={loading} 
                                        onValueChange={field.onChange} 
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a size" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sizes.map((size) => (
                                                <SelectItem
                                                    key={size.id}
                                                    value={size.id}
                                                >
                                                    {size.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="colorId"
                            render={({field})=>( 
                                <FormItem>
                                    <FormLabel>Color</FormLabel>
                                    <Select 
                                        disabled={loading} 
                                        onValueChange={field.onChange} 
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a color" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {colors.map((color) => (
                                                <SelectItem
                                                    key={color.id}
                                                    value={color.id}
                                                >
                                                    {color.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="isFeatured"
                            render={({field})=>( 
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                     <FormControl>
                                        <Checkbox 
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                     </FormControl>
                                     <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Featured
                                        </FormLabel>
                                        <FormDescription>
                                            This product will appear on the home page.
                                        </FormDescription>
                                     </div>
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="isArchived"
                            render={({field})=>( 
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                     <FormControl>
                                        <Checkbox 
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                     </FormControl>
                                     <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Archived
                                        </FormLabel>
                                        <FormDescription>
                                            This product will not appear on anywhere in the store.
                                        </FormDescription>
                                     </div>
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

export default ProductForm;
