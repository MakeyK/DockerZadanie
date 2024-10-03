const express = require("express")
require("dotenv").config()
const sequelize = require("./db")
const cors = require('cors')
const {DataTypes} = require('sequelize')


const http = require('http')
// const HOST=process.env.HOST
// const PORT = process.env.PORT
const app = express()
const server = http.createServer(app)


app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    next();
  });
app.use(cors())
app.use(express.json())

const User = sequelize.define('users', {
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    login:{type: DataTypes.STRING, unique: true},
    passwd: {type:DataTypes.STRING},
    role: {type:DataTypes.STRING, defaultValue: "Student"},
})

app.post('/auth', async(req, res) =>{
    const {login, passwd} = req.body
    if (!login)
    {
    res.send("Неверные данные")
    }
    const user = await User.findOne({where:{login}})

    if (passwd != user.passwd){
    res.send("Неверные данные")
    }
    if (passwd == user.passwd)
    {
    res.send("OK")
    }
})

app.get('/', async (req, res) => {
    res.send("Hello world!")
})

app.post('/add', async(req, res) => {
    const {login, passwd} = req.body
    const user = await User.create({login, passwd})
    res.send("It's ok")
   })
   app.delete('/delete', async(req, res) => {
    const {id} = req.body
    const user = await User.destroy({where:{id}})
    res.send("It's ok")
   })
   app.get('/people/:id', async(req, res) =>{
    const id = req.params.id
    const user = await User.findOne({where:{id}})
    res.send(`<h1> У пользователя ${user.login } пароль ${user.passwd } <h1>`)
})

const PORT = 6800
const HOST = '0.0.0.0'

const start = async () => {
    try{
        await sequelize.authenticate()
        await sequelize.sync()
        server.listen(PORT, HOST, () => console.log(`Server start on ${HOST}:${PORT}`))
    }
    catch(e){
        console.log(e)
    }
}

start()