const model = require("./model")

module.exports.getApi = function(req, res) {
  res.status(200).send({endpoints: model.endpoints})
}

module.exports.getApiTopics = function(req, res) {
  res.status(200).send({topics: model.topics})
}

module.exports.getArticleById = function(req, res) {
  model.fetchArticleById(req.params.article_id)
  .then(({rows}) => {
    if (rows.length) res.status(200).send({article: rows[0]})
    else res.status(404).send({msg: "No such article"})
  })
}