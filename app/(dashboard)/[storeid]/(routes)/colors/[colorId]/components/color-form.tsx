'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { Color } from "@prisma/client";
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
    value: z.string().min(4).regex(/^#/,{
        message:'String must be a valid hex code'
    }),
});

//Ensures form data adheres to the schema structure.
type ColorFormValues = z.infer<typeof formSchema>;

//Ensures the component receives the correct props.
interface ColorFormProps {
    initialData: Color | null;
}


const ColorForm: React.FC<ColorFormProps> = (
    {initialData}
) => {
    const params = useParams();
    const router = useRouter();
    
    
    const title = initialData ? "Edit Color" : "Create Color"
    const description = initialData ? "Edit a Color" : "Add a new Color"
    const action = initialData ? "Save Changes" : "Create"
    const toastMessage = initialData ? "Color Updated" : "Color Created"
    
    const [open, setOpen] = useState(false);
    const [loading, setloading] = useState(false);
    
    const form = useForm<ColorFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData || {
            name: '',
            value: ''
        }
    })
    
    
    const onSubmit = async (data: ColorFormValues) => {
        try {
            setloading(true)
            if (initialData) {
                const response = await axios.patch(`/api/${params.storeid}/colors/${params.colorId}`,data)
            } else {
                const response = await axios.post(`/api/${params.storeid}/colors`,data)
            }
            router.refresh();
            toast.success(toastMessage)
            router.push(`/${params.storeid}/colors`)

        } catch (error) {
            toast.error("Something went error.")
        } finally {
            setloading(false)
        }
    }

    const onDelete = async () => {
        try {
            setloading(true)
            const response = await axios.delete(`/api/${params.storeid}/colors/${params.colorId}`)
            router.refresh();
            toast.success("Color Deleted successfully")
            router.push(`/${params.storeid}/colors`)
        } catch (error) {
            toast.error("Make sure you removed all products using this color first.")
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
                                        <Input  disabled={loading} placeholder="Color name" {...field}/>
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
                                        <div className="flex items-center gap-x-4">
                                            <Input  disabled={loading} placeholder="Color alue" {...field}/>
                                            <div className="border p-4 rounded-full" style={{backgroundColor:field.value}}></div>
                                        </div>
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

export default ColorForm;
