'use client'
 
import { useStoreModal } from '@/hooks/use-store-modal'
import { UserButton } from '@clerk/nextjs'
import { useEffect } from 'react'

export default function Home() {

  const onOpen = useStoreModal((state)=>state.onOpen)
  const isOpen = useStoreModal((state)=>state.isOpen)

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  },[isOpen, onOpen])
  
  return (
    /// return Null. we only want it ot intial the modal
    <div>
        This is a protected route!
        <UserButton />
    </div>
  )
}
