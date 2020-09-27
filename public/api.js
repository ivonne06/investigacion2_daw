const express = require('express');
const bodyParser = require('body-parser')
const fs = require('fs');
const path = require('path');
const { json } = require('body-parser');
const { nextTick } = require('process');
const { EMLINK } = require('constants');
const file = path.join(__dirname,'../users.json');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

//Route
app.get('/', (req, res) => {
    res.send('Welcome to my API!');
});

app.get('/users',(req, res) => {
    try{        
        const data = fs.readFileSync(file);
        res.send(JSON.parse(data));
    } catch(e){
        console.log(e);        
    }    
});

app.post('/add', (req, res) => {
    try{        
        if(req.body.nombres == undefined || req.body.nombres.trim() == ''){
            res.send("El campo nombres es obligatorio");
        }
        else if(req.body.primerApellido == undefined || req.body.primerApellido.trim() == ''){
            res.send("El campo primerApellido es obligatorio");
        }
        else{
            const data = fs.readFileSync(file);
            const users = JSON.parse(data);
            let id = users.length + 1;
            const newUsers = {
                id: id,
                nombres: req.body.nombres,
                primerApellido: req.body.primerApellido,
                segundoApellido: req.body.segundoApellido,
                telefono: req.body.telefono
            };        
            users.push(newUsers);              
            fs.writeFileSync(file, JSON.stringify(users));    
            res.status(201).json(users); 
        }            
    } catch(e){
        console.log(e);        
    }    
});

app.put('/update/:id', (req, res) => {        
    try{
        if(isNaN(parseInt(req.params.id))){
            res.send("El parametro id debe ser entero");
        }
        else if(req.body.nombres == undefined || req.body.nombres.trim() == ''){
            res.send("El campo nombres es obligatorio");
        }
        else if(req.body.primerApellido == undefined || req.body.primerApellido.trim() == ''){
            res.send("El campo primerApellido es obligatorio");
        }
        else{                        
            const {id} = req.params;                        
            const data = fs.readFileSync(file);
            const users = JSON.parse(data);
            const i = parseInt(id);
            
            const indexed = users.reduce((acc, el) => ({
                ...acc,
                [el.id]: el
            }),{});
            //const user = users.find(elem => elem.id = i);
            const user = indexed[i];                    
            user.nombres = req.body.nombres;
            user.primerApellido = req.body.primerApellido;
            user.segundoApellido = req.body.segundoApellido;
            user.telefono = req.body.telefono;

            users[i-1] = user;               
            fs.writeFileSync(file, JSON.stringify(users));    
            res.status(201).json(users);
        }                  
    } catch(e){
        console.log(e);
    }    
});

app.delete('/delete/:id', (req, res) => {
    const {id} = req.params;    

    try{
        if(isNaN(parseInt(req.params.id))){
            res.send("El parametro id debe ser entero");
        }
        else{            
            const i = parseInt(id);
            const data = fs.readFileSync(file);
            let users = JSON.parse(data);    

            userDelete = users.splice(i-1,1);                    
            fs.writeFileSync(path.join(file), JSON.stringify(users));    
            res.status(201).json(users);  
        }                
    } catch(e){
        console.log(e);
    }   
});

app.listen(PORT, () => console.log(`Server running on port ${PORT} api`));