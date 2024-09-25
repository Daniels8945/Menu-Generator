import { useState, useEffect } from "react";

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [isPending, setIspending] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const abortCont = new AbortController();

        setTimeout(() => {
            fetch(url, {signal: abortCont.signal})
            .then(response => {
                if(!response.ok){
                    throw Error('Could not fetch data for resource!')
                }
                return response.json();
            })
            .then(data => {
                setData(data)
                setIspending(false)
                setError(null)
                console.log(data)
            })
            .catch(error => {
                if(error.name === "AbortError"){
                    return
                }
                setIspending(false)
                setError(error.message)
            });
        }, 1000)
        return () => abortCont.abort();
    }, [url])
    
    return { data, isPending, error }
}
 
export default useFetch;