
const errorhandler = async (err, req, res, next) => {
    console.log(err.message)
    console.log(err)
     let newerror = { username: '', password: '', other: '' }

        if (err.message.includes('User validation failed')) {
            Object.values(err.errors).forEach(({ properties }) => {
                newerror[properties.path] = properties.message;
            })
        }
        if (err.code === 11000) {
            newerror.username = 'this user already exist'
        }
        console.log(newerror)
}

module.exports = errorhandler