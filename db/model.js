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
      return checkArticle(id)
      .then((exists) => {
        console.log(Object.keys(exists))
        if (exists) {
          return db.query(sql, [id])
        } else {
          return Promise.reject({status: 404, msg:"Article not found"})
      }
      })
    } else return db.query(sql, [id])
  } else 
    return Promise.reject({status: 400, msg:"Invalid article ID"})
}

function checkArticle(id) {
  return db.query("SELECT * FROM articles WHERE article_id = $1;", [id])
      .then(({rows}) => {
        if (rows.length) {
          return true
        } else {
          return false
      }
      })
}

module.exports.postComment = function(id, comment) {
  if (/^\d+$/.test(id)) {
    return checkArticle(id)
    .then((exists) => {
      if (exists) {
        return db.query(
          `INSERT INTO comments (body, author, article_id, votes, created_at)
          VALUES ($1, $2, $3, $4, NOW()) RETURNING *;`, 
        [comment.body, comment.author, id, 0])
        .catch(() => {
          //noErrHandler
        })
      } else {
        return Promise.reject({status: 404, msg:"Article not found"})
      }
    })
  }
  else
    return Promise.reject({status: 400, msg:"Invalid article ID"})
}

module.exports.articleComments = function() {
  return db.query(
    `SELECT articles.article_id, comments.comment_id 
    FROM articles JOIN comments
    ON articles.article_id = comments.article_id;`)
}

module.exports.voteArticle = function(id, vote) {
  if (/^\d+$/.test(id)) {
    return checkArticle(id)
    .then((exists) => {
      if (exists) {
        return db.query(
          `SELECT votes FROM articles WHERE article_id = $1;`, 
        [id])
        .then(({rows}) => {
          return db.query(`UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *;`,
            [rows[0].votes + vote, id])
          .catch(() => {
            //noErrHandler
          })
        })
        .catch(() => {
          //noErrHandler
        })
      } else {
        return Promise.reject({status: 404, msg:"Article not found"})
      }
    })
  }
  else
    return Promise.reject({status: 400, msg:"Invalid article ID"})
}

module.exports.delComment = function(id) {
  if (/^\d+$/.test(id)) {
    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`,
      [id]
    )
    .then(({rows}) => {
      if (rows.length) {
        return
      } else {
        return Promise.reject({status: 400, msg:"Invalid article ID"})
      }
    })
  }
  else
    return Promise.reject({status: 400, msg:"Invalid comment ID"})
}