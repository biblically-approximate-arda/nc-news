const db = require("./connection")

module.exports.endpoints = require("../endpoints.json")

module.exports.topics = require("./data/development-data/topics.js")

module.exports.fetchArticleById = function(id) {
  return db.query("SELECT * FROM articles WHERE article_id = $1;", [id])
}