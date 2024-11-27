'use client'

import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";

interface AlertModalProps {
    isOnpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
}
export const AlertModal: React.FC<AlertModalProps> = ({
    isOnpen,onClose,onConfirm,loading
}) =>  {
    const [isMounted, setIsMounted] = useState(false)
    useEffect(() => {
        setIsMounted(true);
    },[])

    if(!isMounted){
        return null
    }

  return (
    <Modal
        title="Are you sure?"
        description="Are you sure? This action can not be undone."
        isOpen={isOnpen}
        onClose={onClose}
    >
        <div className="pt-6 flex items-center justify-end w-full space-x-4">
            <Button disabled={loading} variant="outline" onClick={onClose}>
                Cancel
            </Button>
            <Button disabled={loading} variant="destructive" onClick={onConfirm}>
                Continue
            </Button>
        </div>
    
    </Modal>
  )
}
