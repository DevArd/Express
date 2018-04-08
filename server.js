const express = require('express'),
app = express(),
bodyParser = require('body-parser'),
session = require('express-session'),
todo = require('./models/todo'),
PORT = process.env.PORT || 8080;

//Moteur de template
app.set('view engine', 'ejs')

//MiddleWares
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/assets', express.static('public'))
app.use(session({
    secret: 'arnaud',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
app.use(require('./middlewares/flash'))

//Routes
app.all('/', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '/');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');  
    res.redirect('todos')
    next()
});

app.get('/todos', (req, res) => {
    todo.all(function(todos){
        res.render('todos/index', { todos : todos})
    })
})

app.post('/todos', (req,res) => {
    if (req.body.task === undefined || req.body.task === '') {
        req.flash('error', 'Vous n\'avez pas écrit de todo !') 
        res.redirect('todos')
    } else if (req.body.state === undefined || req.body.state === '') {
        req.flash('error', 'Vous n\'avez pas saisie l\'état du todo !') 
        res.redirect('todos')
    } else {
        todo.create(req.body,function(){
            req.flash('success', 'Bravo, vous avez créé un todo !')
            res.redirect('todos') 
        })
    }
})

app.get('/todos/:id', (req, res) => {
    todo.find(req.params.id, function(todo){
        res.render('todos/show', {todo : todo })
    })
})

app.put('/todos/:id', (req, res) => {
    if (req.body.task === undefined || req.body.task === '') {
        console.log(req.params.id)
        req.flash('error', 'Vous n\'avez pas écrit de todo !') 
        res.redirect('todos/:id')
    } else if (req.body.state === undefined || req.body.state === '') {
        req.flash('error', 'Vous n\'avez pas saisie l\'état du todo !') 
        res.redirect('todos/:id')
    } else {
        todo.update(req.params.id, req.body, function(){
            req.flash('success', 'Bravo, vous avez bien modifié le todo !')
            res.redirect('todos/:id')
        })
    }
    req.flash('error', 'Une erreur s\'est produite')
    res.redirect('todos')
})

app.delete('/todos/:id', function (req, res) {
    todo.delete(req.params.id, function(){
        req.flash('success', 'Vous avez bien supprimé un todo !')
        res.redirect('todos') 
    })
    req.flash('error', 'Une erreur s\'est produite')
    res.redirect('todos')
});

app.use((req, res) => {
    res.send(404, 'Not Found')
})

app.use((req, res) => { 
    res.send(501, 'Not Implemented')
})

app.listen(PORT, () => {
    console.log('Serveur sur port : ', PORT)
})