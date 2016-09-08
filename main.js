var express = require('express'),
app = express(),
fs = require('fs'),
router = express.Router(),
handlebars = require('hbs/node_modules/handlebars'),
layouts = require('handlebars-layouts')
handlebars.registerHelper(layouts(handlebars))

var bodyParser = require('body-parser')
app.set('views', './views')
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.listen(3000, function () {
    console.log('Now listening on port 3000')
})

app.post('/add', function (req, res) {
    fs.readFile('./data/todos.json', 'utf8', function (err, data) {
        if(err){console.log(err)}

        var file = JSON.parse(data);
        req.body.active = 1
        req.body.done = 0
        req.body.date_ended = 0
        file.todos.unshift(req.body)
        jsonres = JSON.stringify(file)
        fs.writeFile('./data/todos.json', jsonres, 'utf8', function (err) {
            if (err) return console.log(err);

            res.status(200).send()
        });
    })
})

app.post('/done', function (req, res) {
    fs.readFile('./data/todos.json', 'utf8', function (err, data) {
        if(err){console.log(err)}

        var id = req.body.id
        var date = req.body.date
        var file = JSON.parse(data);
        console.log(id)
        if(file.todos[id].done === 1){
            file.todos[id].done = 0
            file.todos[id].date_ended = 0;
        }else{
            file.todos[id].done = 1
            file.todos[id].date_ended = date;
        }
        jsonres = JSON.stringify(file)
        fs.writeFile('./data/todos.json', jsonres, 'utf8', function (err) {
            if (err) return console.log(err);

            res.status(200).send()
        });
    })
})

app.post('/deleteperm', function (req, res) {
    fs.readFile('./data/todos.json', 'utf8', function (err, data) {
        if(err){console.log(err)}

        var id = req.body.id
        var file = JSON.parse(data);
        file.todos.splice(id, 1)
        jsonres = JSON.stringify(file)
        fs.writeFile('./data/todos.json', jsonres, 'utf8', function (err) {
            if (err) return console.log(err);

            res.status(200).send()
        });
    })
})

app.post('/remove', function (req, res) {
    fs.readFile('./data/todos.json', 'utf8', function (err, data) {
        if(err){console.log(err)}

        var id = req.body.id
        var file = JSON.parse(data);
        console.log(file.todos[id].active)
        if(file.todos[id].active == 0){
            file.todos[id].active = 1
        }else{
            file.todos[id].active = 0
        }
        jsonres = JSON.stringify(file)
        fs.writeFile('./data/todos.json', jsonres, 'utf8', function (err) {
            if (err) return console.log(err);

            res.status(200).send()
        });

    })
})

app.get('/', function (req, res) {
    var todos;
    fs.readFile('./data/todos.json', 'utf8', function (err, data) {
        if(err) console.log(err)

        todos = JSON.parse(data)
        res.render('index', {todos: todos})
    })
})

app.get('/deleted', function (req, res) {
    var todos;
    fs.readFile('./data/todos.json', 'utf8', function (err, data) {
        if(err) console.log(err)

        todos = JSON.parse(data)
        res.render('deleted', {todos: todos})
    })
})

app.get('/todos', function (req, res) {
    fs.readFile('./data/todos.json', 'utf8', function (err, data) {
        if(err) console.log(err)

        todos = JSON.parse(data)
        res.render('partials/todos', {todos: todos}, function (err, html) {
            res.send(html)
        })
    })
})
app.get('/todosdeleted', function (req, res) {
    fs.readFile('./data/todos.json', 'utf8', function (err, data) {
        if(err) console.log(err)

        todos = JSON.parse(data)
        res.render('partials/deletedtodos', {todos: todos}, function (err, html) {
            res.send(html)
        })
    })
})

app.use(express.static('./public'))