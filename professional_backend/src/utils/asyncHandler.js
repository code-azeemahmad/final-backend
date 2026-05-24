// utility file of async/ await wrapper

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise
        .resolve(requestHandler(req, res, next))
        .catch((err) => next(err));     // .catch(next)
    }
}

/*
What this code actually does?
Your async route
        ↓
wrapped by asyncHandler
        ↓
errors automatically caught
        ↓
sent to Express error middleware
*/

export {asyncHandler};

// const asyncHandler = (fn) => async(req, res, next) => {    // interesting, higher order function
//     try {
//         await fn(req, res, next);
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         });
//     }
// }