const exp = require("express")
const app = exp()
const {getApi} = require("./controller")
module.exports = app

app.get("/api", getApi)

app.use((err, req, res, next) => {

  const status = err.status || 500;
  const msg = err.msg || 'Internal Server Error';
  res.status(status).send({ msg });
})