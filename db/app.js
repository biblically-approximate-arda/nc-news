const exp = require("express")
const app = exp()
const {getApi, getApiTopics, getArticleById} = require("./controller")
module.exports = app

app.use(exp.json())

app.get("/api", getApi)
app.get("/api/topics", getApiTopics)
app.get("/api/articles/:article_id", getArticleById)

app.use((req, res, next) => {
  console.log("ping")
  // const status = err.status || 500;
  // const msg = err.msg || 'Internal Server Error';
  res.status(500).send({ msg:"Internal Server Error" });
})