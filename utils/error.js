module.exports = {
    serverError(res, error){
        console.log(error)
        res.status(500).json({
            message : "server error occurd"
        })
    },
    resourseError(res, message){
        res.status(400).json({ message })
    }
}