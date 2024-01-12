import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import {BiPowerOff} from 'react-icons/bi';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function Logout() {

    const navigate=useNavigate();

    const handleclick=async()=>{
        signOut(auth).then(()=>{
          navigate('/Login');
        }).catch(err=>console.log(err))
    }

  return (
    <Button onClick={handleclick}>
      <BiPowerOff/>
    </Button>
  )
}

const Button=styled.button`
display:flex;
background:#4f4f52;
border:none;
font-size:1.1rem;
border-radius:5rem;
padding:0.3rem 0.4rem;
padding-bottom:0.5rem;
color:white;
&:hover{
  cursor:pointer;
}
`;
