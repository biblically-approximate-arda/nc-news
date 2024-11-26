const model = require("./model")

module.exports.getApi = function(req, res, next) {
    res.status(200).send({endpoints: model.endpoints})
}
