const express = require('express');
const session = require('express-session');
const { engine } = require("express-handlebars");
 const fs = require('fs');


 
const app = express();
const PORT = 3000;


 
//bd
const users = JSON.parse(fs.readFileSync('bd.json', 'utf-8'));
 

app.set("views", __dirname + "\\views");
console.log(app.get("views"));
app.engine("hbs", engine(
    {
        layoutsDir: __dirname + "\\views\\layouts",
        defaultLayout: "main",
        extname: '.hbs',

    }
));
app.set("view engine", "hbs");


//middleware
 
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'test',
    resave: false,
    saveUninitialized: false,
  }));  

  
  //middleware para validar la session.
  const vlogin = (req, res, next) => {
    if(!req.session.userId){
        return res.status(401).send('No autorizado');
    }
    next();
  }

app.get('/', (req, res) => {   
    res.send('Hello World');
});

app.get('/login', (req, res) => {   
    
    res.render('login');
});

app.get('/home', vlogin, (req, res) => {
    
    res.render('home');
});


app.get('/edit', vlogin,     (req, res) => {
    const user = users.find(user => user.id === req.session.userId);
    res.render('edit', {user});

});

app.post('/edit', vlogin, (req, res) => {
    const user = users.find(user => user.id === req.session.userId);
    user.email = req.body.email;
    console.log(`Usuario ${user.name} editado`);
    res.send('Usuario editado');
    
});
app.post('/login', (req, res) => {   
    //console.log(req.body);
    const user = users.find(user => user.email === req.body.email);
    if(!user){
        return res.status(400).send('Usuario no encontrado');
    }
    if(user.password !== req.body.password){
        return res.status(400).send('Contraseña incorrecta');
    }   
  req.session.userId = user.id;
  console.log(req.session);
  res.send('Login correcto');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});