import groq from 'groq';
import client from '../lib/sanity/client';
import useSWR from 'swr';

export default  function useSanity(query) {
    const { data, error, mutate } = useSWR(groq`${query}`, query =>
        client.fetch(query)
    );

    return {
        data: data,
        mutate: mutate,
        isLoading: !data && !error,
        isError: error
    }
}

