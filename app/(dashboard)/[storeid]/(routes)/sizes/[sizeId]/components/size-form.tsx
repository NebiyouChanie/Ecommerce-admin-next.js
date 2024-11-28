'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { Size } from "@prisma/client";
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
import ImageUload from "@/components/ui/image-upload";
 

//Used with zodResolver for validating form inputs.  used for defining the type
const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1),
});

//Ensures form data adheres to the schema structure.
type SizeFormValues = z.infer<typeof formSchema>;

//Ensures the component receives the correct props.
interface iSizeFormProps {
    initialData: Size | null;
}


const SizeForm: React.FC<iSizeFormProps> = (
    {initialData}
) => {
    const params = useParams();
    const router = useRouter();
    
    
    const title = initialData ? "Edit Size" : "Create Size"
    const description = initialData ? "Edit a Size" : "Add a new Size"
    const action = initialData ? "Save Changes" : "Create"
    const toastMessage = initialData ? "Size Updated" : "Size Created"
    
    const [open, setOpen] = useState(false);
    const [loading, setloading] = useState(false);
    
    const form = useForm<SizeFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData || {
            name: '',
            value: ''
        }
    })
    
    
    const onSubmit = async (data: SizeFormValues) => {
        try {
            setloading(true)
            if (initialData) {
                const response = await axios.patch(`/api/${params.storeid}/sizes/${params.sizeId}`,data)
            } else {
                const response = await axios.post(`/api/${params.storeid}/sizes`,data)
            }
            router.refresh();
            toast.success(toastMessage)
            router.push(`/${params.storeid}/sizes`)

        } catch (error) {
            toast.error("Something went error.")
        } finally {
            setloading(false)
        }
    }

    const onDelete = async () => {
        try {
            setloading(true)
            const response = await axios.delete(`/api/${params.storeid}/sizes/${params.sizeId}`)
            router.refresh();
            toast.success("Size Deleted successfully")
            router.push(`/${params.storeid}/sizes`)
        } catch (error) {
            toast.error("Make sure you removed all products using this size first.")
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
                                        <Input  disabled={loading} placeholder="Size name" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="value"
                            render={({field})=>( 
                                <FormItem>
                                    <FormLabel>Value</FormLabel>
                                    <FormControl>
                                        <Input  disabled={loading} placeholder="Value" {...field}/>
                                    </FormControl>
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

export default SizeForm;
