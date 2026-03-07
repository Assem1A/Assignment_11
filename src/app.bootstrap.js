
import { resolve } from 'node:path'
import { NODE_ENV, port } from '../config/config.service.js'
import { connectDataBase } from './DB/connection.db.js'
import { authRouter, userRouter } from './modules/index.js'
import express from 'express'

async function bootstrap() {
    const app = express()
    //convert buffer data
    app.use(express.json())
    await connectDataBase()
    console.log({ssssssssssssssssssssss:resolve( "../uploads")});
    
    app.use("/uploads", express.static(resolve("../uploads"))); 
    
       //application routing
    app.get('/', (req, res) => res.send('Hello World!'))
    app.use('/auth', authRouter)
    app.use('/user', userRouter)



    //invalid routing
    app.use('{/*dummy}', (req, res) => {
        return res.status(404).json({ message: "Invalid application routing" })
    })

    //error-handling
    app.use((error, req, res, next) => {
        const status = error.cause?.status ?? 500
        return res.status(status).json({
            error_message:
                status == 500 ? 'something went wrong' : error.message ?? 'something went wrong',
            stack: error.stack 
        })
    })

    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}
export default bootstrap