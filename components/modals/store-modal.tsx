'use client'
import * as z from 'zod'
import { Modal } from "@/components/ui/modal"
import { useStoreModal } from "@/hooks/use-store-modal"
import { useForm } from "react-hook-form"
import { FormField , Form, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from '@/components/ui/input'
import { Button } from '../ui/button'


const formSchema = z.object({
    name:z.string().min(1),

})

 
export const StoreModal = () => {
    const StoreModal = useStoreModal()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    const onSubmit= async (values:z.infer<typeof formSchema>) => {
            console.log(values)
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
                                        <Input  placeholder="E-commerce" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                                )
                            }}
                        />
                    <div className="pt-6 space-x-4 flex items-center justify-end w-full">
                        <Button   variant={"outline"} onClick={(StoreModal.onClose)}>Cancel</Button>
                        <Button   type="submit">Continue</Button>
                    </div>
                       
                    </form>
                </Form>
            </div>
        </div>
    </Modal>)
}