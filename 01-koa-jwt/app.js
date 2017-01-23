var koa = require('koa')
var parse = require('co-body')
var jwt = require('koa-jwt')
var fs = require('fs')

var app = koa()
var publicKey = fs.readFileSync('demo.rsa.pub')
var privateKey = fs.readFileSync('demo.rsa')

// JWT ERROR CATCHER
app.use(function *(next){
  try {
    yield next // Attempt to go through th eJWT Validator
  } catch(e) {
    if (e.status == 401) {
      // prepare response to user
      this.status = e.status
      this.body = 'you dont have a signed token dude'
    } else {
      throw e // pass the error to the next handler since it wasnt a jwt error
    }
  }
})

// public endpoint to login
app.use(function * (next){
  if (this.url.match(/^\/login/)) {
    var claims = yield parse(this)
    var token = jwt.sign(claims, privateKey, { algorithm: 'RS256'})
    this.status = 200
    this.body = { token: token }
  } else {
    yield next
  }
})

// everything behind this will be protected
app.use(jwt({
  secret: publicKey,
  algorithm: 'RS256'
}))

app.use(function *(){
  this.status = 200
  this.body = 'you are logged in dude! Welcome'
})

app.listen(3000)
