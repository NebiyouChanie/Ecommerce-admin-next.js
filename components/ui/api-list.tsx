'use client'

import { useOrigin } from "@/hooks/use-origin";
import { useParams } from "next/navigation";
import { ApiAlert } from "@/components/ui/api-alert";

interface ApiListProps {
    enitityName: string;
    enitityIdName: string
}

const ApiList: React.FC <ApiListProps> = ({
    enitityName,enitityIdName
}) => {
    const params = useParams()
    const origin = useOrigin()

    const baseUrl = `${origin}/api/${params.storeid}`
    return (
        <>
            <ApiAlert 
                title="GET"
                variant="public"
                description={`${baseUrl}/${enitityName}`}
            />
            
            <ApiAlert 
                title="GET"
                variant="public"
                description={`${baseUrl}/${enitityName}/{${enitityIdName}}`}
            />
            
            <ApiAlert 
                title="POST"
                variant="admin"
                description={`${baseUrl}/${enitityName}`}
            />
            
            <ApiAlert 
                title="PATCH"
                variant="admin"
                description={`${baseUrl}/${enitityName}/{${enitityIdName}}`}
            />
            
            <ApiAlert 
                title="DELETE"
                variant="admin"
                description={`${baseUrl}/${enitityName}/{${enitityIdName}}`}
            />
        </>
    )
}

export default ApiList
