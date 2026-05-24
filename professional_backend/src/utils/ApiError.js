// Node js Error Class, handling errors
class ApiError extends Error {  // custom error class. Used to standardize errors across APIs.
    // my own constructor and I will overwrite it
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = "",
    ) {
        super(message);

        this.statusCode = statusCode;
        this.data = null;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }   
}

// How you use it
// throw new ApiError(400, "Username is required");

export {ApiError};

// errors are traced in node but request, response is handled by express

