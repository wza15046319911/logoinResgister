import "./index.scss"; 

import * as dom from "./src/dom.js";
import { clearDomValue , isInputHasContent } from "./src/utils"; 

import axios from "axios"; //前端用来请求后端 API 的工具
import * as animation from "./src/animation.js";

const backendPath = import.meta.env.VITE_BACKEDN_PATH="http://localhost:9090"
const loginToken = import.meta.env.VITE_LOGIN_TOKEN="login-token"
//console.log(backendPath)
//console.log(loginToken); 

// btn function
const RegisterToLoginBtnFun = (event) => {
  event.preventDefault();
  animation.RegisterToLogin();

  
}

const LoginToRegisterBtnFun = (event) => {
  event.preventDefault();
  animation.LoginToRegister();


}




dom.toLoginBtn.addEventListener("click", RegisterToLoginBtnFun);

dom.toRegisterBtn.addEventListener("click", LoginToRegisterBtnFun);



dom.loginBtn.addEventListener("click", login)
dom.registerBtn.addEventListener("click", register)
dom.signOutBtn.addEventListener("click", signOut)  

async function login(event){
    event.preventDefault()

    if(isInputHasContent([dom.username, dom.password]) === -1){
        animation.showError()
        return
    }

    try{
        const response = await axios.post(
            `${backendPath}/api/login`,
            {
                username:dom.username.value,
                password:dom.password.value,
            }
        ).then(res => res.data)
        if(response.code === "0"){
            dom.welcomeUsername.innerHTML = response.username
            clearDomValue([dom.username, dom.password])
            animation.showCorrect()
            animation.LoginToWelcome()

            //检查token
            if (response.token) {
                localStorage.setItem(loginToken, response.token);
            }            
        }   
    }catch(error){
        console.log(error)

        const code = error?.response?.data?.code
        switch(code){
            case"1":
            case"2":
              animation.showError()
              break;
            default:
              animation.showError()
              break;

        }

    }
}

async function register(event){
    event.preventDefault()

    const statusCoide = isInputHasContent([dom.new_username, dom.password_one, dom.password_two])

    if (statusCoide === 1 || statusCoide === -1 || dom.password_one.value !== dom.password_two.value) {
        animation.showError()
        return
    }

    try{
        const response = await axios.post(
            `${backendPath}/api/register`,
            {
                username:dom.new_username.value,
                password:dom.password_one.value,
            }
        ).then(res => res.data)
        if(response.code === "0"){
            clearDomValue([dom.new_username, dom.password_one, dom.password_two])
            animation.showCorrect()
            animation.RegisterToLogin()
        }

    }catch(error){
        console.log(error)

        const code = error?.response?.data?.code
        switch(code){
            case"1":
            case"2":
              animation.showError()
              break;
            default:
              animation.showError()
              break;
            
        }
    }
}

async function signOut(event){
    event.preventDefault()
    clearDomValue([
        dom.username,
        dom.password,
        dom.new_username,
        dom.password_one,
        dom.password_two,
        dom.welcomeUsername

    ])

    animation.WelcomeToLogin()
    localStorage.removeItem(loginToken)
}


async function checkToken(){
    const token = localStorage.getItem(loginToken)
    if(!token) return   //如果token不存在

    const configuration = {
        headers:{
            Authorization:`Bearer ${token}`
        }
    }

    try{
        const response = await axios.post(
            `${backendPath}/api/login`, {
                message:"token"
            },
            configuration
        ).then(res => res.data)

        if(response.code === "0"){
            dom.welcomeUsername.innerHTML = response.username
            animation.LoginToWelcome()
        }
            
        
    }catch(error){
        console.log(error)
        localStorage.removeItem(loginToken)
    }
}

checkToken()

