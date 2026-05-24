// Instead of sending random success responses everywhere, we standardize them
class ApiResponse {
    constructor(
        statusCode,
        data, 
        message = "Success",
    ) {
        this.statusCode = statusCode;
        this.data = data,
        this.message = message,
        this.success = statusCode < 400;
    }
}

export {ApiResponse};