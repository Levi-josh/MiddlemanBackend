
const errorhandler = async (err, req, res, next) => {
    console.log(err.message)
    console.log(err)
}

module.exports = errorhandler