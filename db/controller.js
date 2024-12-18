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
      commentLists[i] = model.fetchCommentsByArticle(i, true)
    }
    Promise.all(commentLists).then((commentListsRes) => {
      for (let i in articlesById) {
        articlesById[i].comment_count = commentListsRes[i].rows.length
      }
      res.status(200).send({articles: rows})
    })
  })
}

module.exports.getCommentsByArticle = function(req, res) {
  model.fetchCommentsByArticle(req.params.article_id)
  .then(({rows}) => {
    res.status(200).send({comments: rows})
  })
  .catch((err) => {
    console.log(err)
    res.status(err.status).send(err.msg) 
  })
}

module.exports.postComment = function(req, res) {
  model.postComment(req.params.article_id, req.body)
  .then(({rows}) => {
    res.status(200).send({comment: {
      body: rows[0].body,
      username: rows[0].author
    }})
  })
  .catch((err) => {
    console.log(err)
    res.status(err.status).send(err.msg) 
  })
}

module.exports.patchArticle = function(req, res) {
  model.voteArticle(req.params.article_id, req.body.inc_votes)
  .then(({rows}) => {
    res.status(200).send(rows)
  })
  .catch((err) => {
    console.log(err)
    res.status(err.status).send(err.msg) 
  })
}

module.exports.deleteComment = function(req, res) {
  model.delComment(req.params.comment_id)
  .then(() => {
    res.status(204).send()
  })
  .catch((err) => {
    console.log(err)
    res.status(err.status).send(err.msg) 
  })
}