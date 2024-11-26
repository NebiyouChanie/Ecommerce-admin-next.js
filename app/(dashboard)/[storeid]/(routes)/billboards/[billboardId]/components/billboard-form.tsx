'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard } from "@prisma/client";
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
    label: z.string().min(1),
    imageUrl: z.string().min(1),
});

//Ensures form data adheres to the schema structure.
type BillboardsFormValues = z.infer<typeof formSchema>;

//Ensures the component receives the correct props.
interface BillboardsFormsProps {
    initialData: Billboard | null;
}


const BillboardsForm: React.FC<BillboardsFormsProps> = (
    {initialData}
) => {
    const params = useParams();
    const router = useRouter();
    
    
    const title = initialData ? "Edit Billboard" : "Create Billboard"
    const description = initialData ? "Edit a Billboard" : "Add a new Billboard"
    const action = initialData ? "Save Changes" : "Create"
    const toastMessage = initialData ? "Billboard Updated" : "Billboard Created"
    
    const [open, setOpen] = useState(false);
    const [loading, setloading] = useState(false);
    
    const form = useForm<BillboardsFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData || {
            label: '',
            imageUrl: ''
        }
    })
    
    
    const onSubmit = async (data: BillboardsFormValues) => {
        try {
            setloading(true)
            const response = await axios.patch(`/api/stores/${params.storeid}`,data)
            router.refresh();
            toast.success(toastMessage)
            
        } catch (error) {
            toast.error("Something went error.")
        } finally {
            setloading(false)
        }
    }

    const onDelete = async () => {
        try {
            setloading(true)
            const response = await axios.delete(`/api/stores/${params.storeid}`)
            router.refresh();
            router.push('/')
            toast.success("Store Deleted successfully")
            
        } catch (error) {
            toast.error("Make sure you remove all products and categories first.")
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
                            name="imageUrl"
                            render={({field})=>( 
                                <FormItem>
                                    <FormLabel>Background image</FormLabel>
                                    <FormControl>
                                         <ImageUload 
                                            value={field.value?[field.value] : []} 
                                            disabled={loading}
                                            onChange={(url) => field.onChange(url)}
                                            onRemove={() => field.onChange("")}
                                         />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="label"
                            render={({field})=>( 
                                <FormItem>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input  disabled={loading} placeholder="Billboard label" {...field}/>
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

export default BillboardsForm;
