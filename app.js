import express from 'express'
import path from 'path'
import { readdirSync } from 'fs'
import { fileURLToPath } from 'url';
import {getComments, getComment, createComment, deleteComment, getUserIdByUsername, registerUser} from './connect_db.js'

const APP = express()
const PORT = process.env.PORT || 4000

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

APP.use(express.static(path.join(__dirname, 'public')));

APP.set("view engine", "ejs")
APP.use(express.urlencoded({extended: false}))
APP.use(express.json())
// APP.use(express.static("public"))


APP.get("/", async (req, res) => {
    const COMMENTS = await getComments();

    COMMENTS.forEach(comment => {
        const date = new Date(comment.post_date)
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        comment.formatted_date = `${day}.${month}.${year} ${hours}:${minutes}`
    });

    const imageDir = path.join(__dirname, 'public', 'images', 'users')
    const imageFiles = readdirSync(imageDir)
    res.render("index.ejs", {
        COMMENTS, imageFiles
    })
})

APP.get("/comments/:comment_id", async (req, res) => {
    const COMMENT_ID = +req.params.comment_id

    const SINGLE_COMMENT = await getComment(COMMENT_ID);
    if(!SINGLE_COMMENT) {
        res.status(404).render("comment404.ejs")
        return
    }

    res.render("singleComment.ejs", {
        SINGLE_COMMENT
    })
})

APP.post("/comments", async (req, res) => {
    const { description_comment, first_name, last_name, username, user_password, birth_date } = req.body;
    console.log("Request body:", req.body); 

    try {
        let user_id = await getUserIdByUsername(username);
        console.log("User ID:", user_id); 

        if (!user_id && first_name && last_name && birth_date) {
            const newUser = await registerUser(first_name, last_name, username, user_password, birth_date);
            user_id = newUser.user_id;
            console.log("New User ID:", user_id); 
        }

        if (user_id) {
            await createComment(user_id, description_comment);
            res.status(200).json({ status: 'comment_created' });
        } else {
            res.status(200).json({ status: 'user_not_found' });
        }
    } catch (error) {
        console.error("Error:", error); 
        res.status(400).json({ error: error.message });
    }
});

// APP.post("/comments/:comment_id/delete", async (req, res) => {
//     const COMMENT_ID = +req.params.comment_id
//     await deleteComment(COMMENT_ID);
//     res.redirect("/comments");
// })

// APP.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something broke :( ')
// })

// APP.use(express.static("public"))

APP.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})