import { METHOD } from '@/constants';
// interface RequestData {
//     body?: Record<string, string>;
//     headers?: Record<string, string>;
// }
export const httpPost = async (url: string, { body = {}, headers = {}}: any) => {
    const response = await fetch(url, {
        method: METHOD.POST,
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            ...headers
        }
    });
    const data = await response.json();
    return data;
}