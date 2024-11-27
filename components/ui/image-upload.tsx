 'use client'

import { useEffect, useState } from "react";
import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget} from 'next-cloudinary'

interface ImageUloadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[];
}

const ImageUload:React.FC<ImageUloadProps>=({
    disabled,
    onChange, 
    onRemove,
    value,
})=> {
    //hydration
    const [isMounted, setIsMounted] = useState(false)

    useEffect(()=>{
        setIsMounted(true);
    },[])

    
    const onUpload = (result: any) => {
        onChange(result.info.secure_url);
    }
    
    if(!isMounted){
        return null
    }
    return (
        <div>

            <div className="mb-4 flex items-center gap-4">
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                        <div className="z-10 absolute top-2 right-2">
                            <Button type="button" variant='destructive' size='icon' onClick={() => onRemove(url)}>
                                <Trash className="w-4 h-4"/>
                            </Button>
                        </div>
                            <Image 
                                fill={true}
                                className="object-cover"
                                alt="Image"
                                src={url}
                            />
                    </div>
                ))}
            </div>
            <CldUploadWidget onSuccess={onUpload} uploadPreset="EcommerceAdmin">
                {({open}) => {
                    const onClick =()=>{
                        open()
                    }

                    return (
                        <Button
                            type="button"
                            disabled={disabled}
                            variant='secondary'
                            onClick={onClick}
                        >
                            <ImagePlus className="h-4 w-4 mr-2"/>
                            Upload Image
                        </Button>
                    )
                }}
            </CldUploadWidget>
    </div>
    
  )
}

export default ImageUload
