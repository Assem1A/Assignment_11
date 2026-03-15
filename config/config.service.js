import { resolve } from 'node:path'
import { config } from 'dotenv'

export const NODE_ENV = process.env.NODE_ENV

const envPath = {
    development: `.env.development`,
    production: `.env.production`,
}
console.log({ en: envPath[NODE_ENV] });


config({ path: resolve(`./config/.env.development`) })


export const port = process.env.PORT ?? 7000
export const DB_URI=process.env.DB_URI
export const JWT_SECRET=process.env.JWT_SECRET
export const JWT_EXPIRES=process.env.JWT_EXPIRES
export const REFRESH_SECRET=process.env.REFRESH_SECRET
export const REDIS_URI=process.env.REDIS_URI
export const MY_FIRST_APP_PASSWORD=process.env.MY_FIRST_PROJECT_PASSWORD

export const EMAIL_APP=process.env.EMAIL_APP
export const APP=process.env.APP





export const SALT_ROUND = parseInt(process.env.SALT_ROUND ?? '10')
