import { useEffect, useState } from "react";
import styled from "styled-components";
import React from 'react';
import axios from "axios";
import { registerRoute } from "../utils/APIRoutes";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";

export default function Register() {

    const [errorMsg, setErrorMsg] = useState();
    const [currentuser, setcurrentuser] = useState("");
    const [isloaded, setisloaded] = useState(false);

    let navigate = useNavigate();

    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        cfpassword: ""
    })
    const handlechange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })
    }

    

    const handlesubmit = async(e) => {
        e.preventDefault();
        const { password, username, email } = values;

        createUserWithEmailAndPassword(auth, email, password)
            .then(async(res) => {
                const user = res.user;
                await updateProfile(user, {
                    displayName: username
                });
                setcurrentuser(user)
                setisloaded(true)
                console.log(res.user);
                navigate('/');

                await axios.post(registerRoute, {
                    username,
                    email,
                    password
                });
            })
            .catch((err) => {
                console.log(err.message);
                setErrorMsg(err.message);
            })

       
        // if(handleValidation()){
        //     const{data}=await axios.post(registerRoute,{
        //         username,
        //         email,
        //         password
        //     });

        // if(data.status===false){
        //     setErrorMsg( data.msg)
        // }
        // if(data.status===true){
        //     localStorage.setItem("chat-app-user",JSON.stringify(data.collection));
        //     navigate("/");
        // } 
        // } 
    }
    // useEffect(()=>{
    //     if(currentuser!=""){
    //         navigate("/")
    //     }
    //   },[currentuser])

    // const handleValidation=()=>{
    //     const{password,cfpassword,username,email}=values;
    //     if (username===""){
    //         setErrorMsg("please fill Username");
    //         return false;
    //     }
    //     else if(email===""){
    //         setErrorMsg("please fill email");
    //         return false;
    //     }
    //     else if (password!==cfpassword){
    //         setErrorMsg("Password and Confirm password must be same")
    //         return false;
    //     }
    //     return true;
    // }

    return (

        <>
            <Container>

                <form onSubmit={(e) => handlesubmit(e)}>
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        onChange={(e) => handlechange(e)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        onChange={(e) => handlechange(e)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={(e) => handlechange(e)}
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="cfpassword"
                        onChange={(e) => handlechange(e)}
                    />
                    <span className="err">{errorMsg}</span>
                    <button type="submit">Create User</button>
                    <span>Already have an account? <Link to="/login">Login</Link></span>
                </form>

            </Container>
        </>

    )
}
const Container = styled.div`
margin:0;
background-color:#ffffff;
height:100vh;
width:100vw;
display:flex;
align-items:center;
justify-content:center;
form{
    display:flex;
    align-items:center;
    justify-content:center;
    background-color:#d7dada;
    padding:2.5rem 1rem;
    max-width:30rem;
    flex-direction:column;
    border-radius:2rem;
    gap:1rem;
    box-shadow: 0 0px 0px 0 rgba(0, 0, 0, 1), 0 0px 70px 0 rgba(0, 0, 0, 0.2);

    input{
        padding:1rem;
        background-color:;
        width:60%;
        max-width:12rem;
        outline:none;
        border:none;
        border-radius:0.6rem;
        &::placeholder {
            color: #a7a9a9;
            opacity:0.8;
          }
        &::selection{
            
        }
    }
    .err{
        font-size:0.8rem;
        color:red;
    }
    button{
        background-color:#42cdaf;
        border:none;
        width:7rem;
        height:2.5rem;
        border-radius:0.5rem;
        color:white;
        &:hover{
            cursor:pointer;
        }
    }
    span{
        display:flex;
        gap:0.5rem;
        justify-content:center;
        align-items:center;
        color:white;
        padding:0 1.2rem;
    }
}
`
