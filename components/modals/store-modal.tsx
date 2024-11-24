'use client'
import * as z from 'zod'
import { Modal } from "@/components/ui/modal"
import { useStoreModal } from "@/hooks/use-store-modal"
import { useForm } from "react-hook-form"
import { FormField , Form, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from '@/components/ui/input'
import { Button } from '../ui/button'
import { useState } from 'react'
import axios from 'axios'
import {toast} from 'react-hot-toast'


const formSchema = z.object({
    name:z.string().min(1),

})

 
export const StoreModal = () => {
    const StoreModal = useStoreModal()
    const [Loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    const onSubmit= async (values:z.infer<typeof formSchema>) => {
        try {
            setLoading(true)
            const response = await axios.post('/api/stores',values)
            toast.success("Store created Successfully.")
        } catch (error) {
            toast.error("something went wrong")
        } finally {
            setLoading(false)
        }
    }
    
    return ( 
    <Modal
        title='Create Store'
        description='Add a new store to manage products and categroires'
        isOpen={StoreModal.isOpen}
        onClose={StoreModal.onClose}
    >
        <div>
            <div className="space-y-4 py-2 pb-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => {
                                return (  
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={Loading} placeholder="E-commerce" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                                )
                            }}
                        />
                    <div className="pt-6 space-x-4 flex items-center justify-end w-full">
                        <Button disabled={Loading} variant={"outline"} onClick={(StoreModal.onClose)}>Cancel</Button>
                        <Button disabled={Loading} type="submit">Continue</Button>
                    </div>
                       
                    </form>
                </Form>
            </div>
        </div>
    </Modal>)
}