'use client'

import { Modal } from '@/components/ui/modal'
import { UserButton } from '@clerk/nextjs'

export default function Home() {
  return (
    <div>
        This is a protected route!
        <UserButton />
        <Modal title="Test" description='test description' isOpen onClose={()=>{}}>
          Children
        </Modal>
    </div>
  )
}
