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

module.exports.getArticles = function(req, res) {
  model.fetchArticles()
  .then(({rows}) => {
    const articlesById = {}
    rows.forEach((entry) => {
      delete entry.body
      articlesById[entry.article_id] = entry
    })
    const commentLists = []
    for (let i in articlesById) {
      commentLists[i] = model.fetchCommentsByArticle(i)
    }
    Promise.all(commentLists).then((commentListsRes) => {
      for (let i in articlesById) {
        articlesById[i].comment_count = commentListsRes[i].rows.length
      }
      res.status(200).send({articles: rows})
    })
  })
}