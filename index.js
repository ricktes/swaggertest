const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const low = require("lowdb")
const swaggerUI = require("swagger-ui-express")
const booksRouter = require("./routes/books")
const swaggerJsDoc = require("swagger-jsdoc")
const PORT = process.env.PORT || 4000;


const FileSync = require("lowdb/adapters/FileSync") 
const adapter = new FileSync("db.json") 
const db = low(adapter)

db.defaults({ books: [] }).write()

const options = {
    definition: {
        openapi: "3.0.0",
        infor: {
            title: "Library API",
            version: "1.0.0",
            description: "A simple Express Library API"
        },
        servers: [
            {
                url: "http://localhost:4000"
            }
        ],
        
    },
    apis: ["./routes/*.js"]
}

const spes = swaggerJsDoc(options)


const app = express()

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(spes))



app.db = db;
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

app.use("/books", booksRouter)

app.listen(PORT,() => console.log(`The server is running on port ${PORT}`))

