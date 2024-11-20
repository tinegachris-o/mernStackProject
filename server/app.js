const express= require('express')
const app = express()
const {graphqlHTTP}= require('express-graphql')
const colors= require('colors')
require('dotenv').config()
let port= process.env.PORT
const connectDB= require('./connection.js')
//console.log('hello ',connectDB());

const schema= require('./schema/schema.js')
// graphql http

///pasword=

//middleware
app.use('/graphql',graphqlHTTP({
    schema,
    graphiql:true
}))
// database
connectDB()
app.listen(port,()=>{
    console.log(` server listening on port ${port}`);
    
})