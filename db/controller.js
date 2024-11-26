const model = require("./model")

module.exports.getApi = function(req, res) {
  res.status(200).send({endpoints: model.endpoints})
}

module.exports.getApiTopics = function(req, res) {
    res.status(200).send({topics: model.topics})
}