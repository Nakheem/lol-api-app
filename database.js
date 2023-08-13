import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getNotes(){
    const [rows] = await pool.query("Select * FROM notes")
    return rows
}

export async function getNote(id){
    const[rows] = await pool.query(`
    Select *
    FROM notes
    Where id = ?
    `, [id])
    return rows[0]
}

export async function createNote(title,content){
    const result = await pool.query(`
    INSERT INTO notes (title, contents)
    VALUES(?,?)
    `, [title, content])
    return result
}
