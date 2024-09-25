
const errorhandler = (err, req, res, next) => {
    let newError = { username: '', password: '',otherErr:'' };
    console.log(err.message)
    // Handle Mongoose validation errors (e.g., User validation failed)
    // if (err.message.includes('User validation failed')) {
    //     Object.values(err.errors).forEach(({ properties }) => {
    //         newerror[properties.path] = properties.message;
    //     });
    //     return res.status(400).json({ errorMessage: newerror });
    // }
    // if(err.message === 'User already exist'||`User doesn't exist`){
    //     newerror.username =  err.message;
    //     return res.status(409).json({ errorMessage: newerror });
    // }
    // if(err.message === 'Incorrect password'||`password must be six characters`){
    //     newerror.password =  err.message;
    //     return res.status(409).json({ errorMessage: newerror });
    // }
    // // Handle Mongoose duplicate key errors (e.g., Unique constraint violated)
    // if (err.code === 11000) {
    //     newerror.username = 'This username already exists';
    //     return res.status(409).json({ errorMessage: newerror });  
    // } else if (err.code === 'EREFUSED' || err.message.includes('ENOTFOUND')) {
    //     return res.status(500).json({ errorMessage: 'Network issue, please try again later' });  
    // }
    // // Handle other unexpected errors (fallback)
    // return res.status(500).json({
    //     errorMessage: err.message || 'Something went wrong'
    // });
    switch (err.message) {
        case 'Incorrect password':
            newError.password = 'Incorrect password';
            return res.status(401).json({ errorMessage: newError });
        case `User doesn't exist`:
            newError.username = `User doesn't exist`;
            return res.status(404).json({ errorMessage: newError });
        case `User already exist`:
            newError.username = `User already exist`;
            return res.status(401).json({ errorMessage: newError });
        case 'password must be six characters':
            newError.password = 'Password must be six characters';
            return res.status(400).json({ errorMessage: newError });
        case 'OTP expired':
            newError.otherErr= 'OTP expired';
            return res.status(400).json({ errorMessage: newError });
        case 'No user found':
            newError.otherErr= 'No user found';
            return res.status(404).json({ errorMessage: newError });
        case 'No file uploaded':
            newError.otherErr= 'No file uploaded';
            return res.status(404).json({ errorMessage: newError });
        case 'Request has already been sent':
            newError.otherErr= 'Request has already been sent';
            return res.status(401).json({ errorMessage: newError });
        case 'Insufficient balance!':
            newError.otherErr= 'Insufficient balance!';
            return res.status(400).json({ errorMessage: newError });
        default:
            // Generic error response
            newError.otherErr ='something went wrong'
            return res.status(500).json({ errorMessage: newError});
    }
    
};

module.exports = errorhandler;