import { METHOD } from '~/constants';

type HttpOptions = { method?: METHOD; body?: string | object, headers?: object, responseType?: string; }
export const httpRequest = async (url: string, { method = METHOD.POST, body = {}, headers = {}, responseType = 'json'}: HttpOptions) => {
    const request = await fetch(url, {
        method: method,
        body: method === METHOD.GET ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            ...headers
        }
    }) as Response extends PromiseLike<infer T> ? T : any;
    let data = null;
    if(responseType) {
        data = await request[responseType]();
    }
    return {
        request,
        data
    };
}

export const httpGet = async (url: string, options?: HttpOptions) => {
    return httpRequest(url, { ...options, method: METHOD.GET });
}

export const httpPost = async (url: string, options?: HttpOptions) => {
    return httpRequest(url, { ...options, method: METHOD.POST });
}