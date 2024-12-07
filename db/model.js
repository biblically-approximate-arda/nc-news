const db = require("./connection")

module.exports.endpoints = require("../endpoints.json")

module.exports.topics = require("./data/development-data/topics.js")

module.exports.fetchArticleById = function(id) {
  return db.query("SELECT * FROM articles WHERE article_id = $1;", [id])
}

module.exports.fetchArticles = function() {
  return db.query("SELECT * FROM articles ORDER BY created_at DESC;")
}

module.exports.fetchCommentsByArticle = function(id, internal = false) {
  const sql = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`
  //console.log(sql)
  if (/^\d+$/.test(id)) {
    //console.log(id)
    if (!internal) {
      return db.query("SELECT * FROM articles WHERE article_id = $1;", [id])
      .then(({rows}) => {
        if (rows.length) {
          return db.query(sql, [id])
        } else {
          return Promise.reject({status: 404, msg:"Article not found"})
      }
      })
    } else return db.query(sql, [id])
  } else 
    return Promise.reject({status: 500, msg:"Invalid article ID"})
}

module.exports.articleComments = function() {
  return db.query(
    `SELECT articles.article_id, comments.comment_id 
    FROM articles JOIN comments
    ON articles.article_id = comments.article_id;`)
}