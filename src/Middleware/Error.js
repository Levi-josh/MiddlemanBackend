
const errorhandler = (err, req, res, next) => {
    let newerror = { username: '', password: '', };
    // Handle Mongoose validation errors (e.g., User validation failed)
    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            newerror[properties.path] = properties.message;
        });
        return res.status(400).json({ errorMessage: newerror });
    }
    if(err.message === 'User already exist'||`User doesn't exist`){
        newerror.username =  err.message;
        return res.status(409).json({ errorMessage: newerror });
    }
    if(err.message === 'Incorrect password'||`password must be six characters`){
        newerror.password =  err.message;
        return res.status(409).json({ errorMessage: newerror });
    }
    // Handle Mongoose duplicate key errors (e.g., Unique constraint violated)
    if (err.code === 11000) {
        newerror.username = 'This username already exists';
        return res.status(409).json({ errorMessage: newerror });  
    } else if (err.code === 'EREFUSED' || err.message.includes('ENOTFOUND')) {
        return res.status(500).json({ errorMessage: 'Network issue, please try again later' });  
    }
    // Handle other unexpected errors (fallback)
    return res.status(500).json({
        errorMessage: err.message || 'Something went wrong'
    });
};

module.exports = errorhandler;