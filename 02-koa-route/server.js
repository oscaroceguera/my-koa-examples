var _ = require('koa-route')
var app = require('koa')()

var db = {
  tobi: { name: 'tobi', species: 'ferret' },
  loki: { name: 'loki', species: 'ferret' },
  jane: { name: 'jane', species: 'ferret' }
};

var pets = {
  list: function *() {
    var names = Object.keys(db)
    this.body = 'pets: ' + names.join(', ')
  },

  show: function *(name){
    var pet = db[name]
    if(!pet) return this.throw('canot find that pet', 404)
    this.body = pet.name + ' is a ' + pet.species;
  }
}

app.use(_.get('/pets', pets.list));
app.use(_.get('/pets/:name', pets.show));

app.listen(3000);
console.log('listening on port 3000');
