import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

const POOL = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getComments() {
    const [ROWS] = await POOL.query("select * from user_comments_with_details;")
    return ROWS
}

export async function getComment(id) {
    const [ROWS] = await POOL.query(`select * from user_comments_with_details where comment_id = ?;`, [id])
    return ROWS[0]
}

export async function getUser(id) {
    const [ROWS] = await POOL.query(`select * from user_demographics where user_id = ?;`, [id])
    return ROWS[0]
}


export async function getUserIdByUsername(username) {
    const [rows] = await POOL.query(`
        select user_id FROM user_demographics where username = ?
    `, [username])

    if(rows.length > 0) {
        return rows[0].user_id
    } else {
        return null
    }
}

export async function createComment(user_id, description_comment) {
    const [RESULT] = await POOL.query(`
        insert into user_comments(user_id, description_comment)
        values (?, ?)
    `, [user_id, description_comment])
    const ID = RESULT.insertId
    return getComment(ID)
}

export async function registerUser(first_name, last_name, username, user_password, birth_date) {
    const [RESULT] = await POOL.query(`
        insert into user_demographics (first_name, last_name, username, user_password, birth_date)
        values (?, ?, ?, ?, ?)
    `, [first_name, last_name, username, user_password, birth_date])
    
    return { user_id: RESULT.insertId };
}

export async function deleteComment(id) {
    const [RESULT] = await POOL.query(`DELETE FROM user_comments WHERE comment_id = ?`, [id]);
    return RESULT;
}
