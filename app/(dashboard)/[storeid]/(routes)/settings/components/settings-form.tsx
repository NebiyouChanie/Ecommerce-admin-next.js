'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { Store } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import * as  z from "zod";
import { useState } from "react";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";


interface SettingsFormsProps {
    initialData: Store;
}

type SettingsFormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
    name: z.string().min(1),
});

const onSubmit = async (data: SettingsFormValues) => {
    console.log(data)
}



const SettingsForm: React.FC<SettingsFormsProps> = (
    {initialData}
) => {

    const [open, setOpen] = useState(false);
    const [loading, setloading] = useState(false);

    const form = useForm<SettingsFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData
    })

    return (
        <>
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

        </>
    );
}

export default SettingsForm;
