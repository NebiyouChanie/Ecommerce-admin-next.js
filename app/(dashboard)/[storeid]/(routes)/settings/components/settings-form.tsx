'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { Store } from "@prisma/client";
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
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";


interface SettingsFormsProps {
    initialData: Store;
}

type SettingsFormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
    name: z.string().min(1),
});




const SettingsForm: React.FC<SettingsFormsProps> = (
    {initialData}
) => {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();

    const [open, setOpen] = useState(false);
    const [loading, setloading] = useState(false);
    
    const form = useForm<SettingsFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData
    })
    
    
    const onSubmit = async (data: SettingsFormValues) => {
        try {
            setloading(true)
            const response = await axios.patch(`/api/stores/${params.storeid}`,data)
            router.refresh();
            toast.success("Store updated successfully")
            
        } catch (error) {
            toast.error("Something went wrong.")
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
                    title="Settings"
                    description="Manage Store settings"
                    />
                <Button
                    variant='destructive'
                    size='sm'
                    onClick={()=>{setOpen(true)}}
                    disabled={loading}
                    >
                    <Trash className="h-4 w-4"/>
                </Button>
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
                                        <Input  disabled={loading} placeholder="Store name" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        Save changes
                    </Button>
                </form>
            </Form>
            <Separator />
            <ApiAlert 
                title="NEXT_PUBLIC_API_URL" 
                description={`${origin}/api/${params.storeid}`} 
                variant="public"/>

        </>
    );
}

export default SettingsForm;
