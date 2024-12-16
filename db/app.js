const exp = require("express")
const cors = require('cors');
const app = exp()
const {getApi, getApiTopics, getArticleById,
  getArticles, getCommentsByArticle, postComment, 
  patchArticle, deleteComment} = require("./controller")
module.exports = app

app.use(cors())
app.use(exp.json())

app.get("/api", getApi)
app.get("/api/topics", getApiTopics)
app.get("/api/articles/:article_id", getArticleById)
app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id/comments", getCommentsByArticle)
app.post("/api/articles/:article_id/comments", postComment)
app.patch("/api/articles/:article_id", patchArticle)
app.delete("/api/comments/:comment_id", deleteComment)

app.use((req, res, next) => {
  // const status = err.status || 500;
  // const msg = err.msg || 'Internal Server Error';
  res.status(404).send({ msg:"Not found" });
})