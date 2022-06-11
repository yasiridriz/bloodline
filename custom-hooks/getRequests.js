import  {useEffect, useState} from 'react'

export default function getRequests(client){
    const query = '*[_type=="request"]'
    const [requests, setRequests] = useState(null)
    useEffect(()=>{
        client.fetch(query).then((res) => {
      
            setRequests(res);
        })
    }, [])
    
    return [requests]
}