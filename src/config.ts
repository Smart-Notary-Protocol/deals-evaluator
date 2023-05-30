import dotenv from 'dotenv'
dotenv.config()
const config = {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDB,
    password: process.env.PGPWD,
    port: parseInt(process.env.PGPORT || ''),
}

export default config