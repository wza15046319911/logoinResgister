import prisma from "../lib/prisma.js";
import { findUserByName } from "../utils/getUsers.js";
import { encryption } from "../utils/cryption.js";
import { postUser } from "../utils/postUser.js";

async function register(req, res){
    try {
        const { username, password } = req.body;
        const user = await prisma.user.create({
            data: {
                username,
                password
            }
        });
        if(!username || !password){
            res.status(400).json({
                message: '用户名或密码不能为空',
                code:"2"
            });
        }

        const existingUser = await findUserByName(username);
        if(existingUser){
            res.status(409).json({
                message: '用户名已存在',
                code:"1",
                username
            });
        }

        const encryptionPassword = await encryption(password);
        await postUser({username, password : encryptionPassword});
        

        res.status(201).json({
            message: '注册成功',
            code:"0",
            username
        });
    } catch (error) {
        console.error('注册失败',error);
        return res.status(500).json({
            message: '注册失败',
            code:"3"
        });
    }
}

export { register }