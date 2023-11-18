export enum METHOD {
    GET="GET",
    POST="POST"
} 

export const HTTP_CODE = {
    100: 101, // ** (Informational) – server acknowledges a request
    200: 200, // ** (Success) – server completed the request as expected
    300: 300, // ** (Redirection) – client needs to perform further actions to complete the request
    400: 400, // ** ((Client error) – client sent an invalid request) OR Bad Request – client sent an invalid request, such as lacking required request body or parameter
    401: 401, // ** Unauthorized – client failed to authenticate with the server
    403: 403, // ** Forbidden – client authenticated but does not have permission to access the requested resource
    404: 404, // ** Not Found – the requested resource does not exist
    412: 412, // ** Precondition Failed – one or more conditions in the request header fields evaluated to false
    500: 500, // ** (Server error) – server failed to fulfill a valid request due to an error with server OR Internal Server Error – a generic error occurred on the server
    503: 503, // ** Unavailable – the requested service is not available
  }