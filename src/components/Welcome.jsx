import React ,{useEffect, useState} from 'react';
import styled from 'styled-components';
import { auth } from '../firebase';

export default function Welcome() {
  const [currentusername,setcurrentusername]=useState([]);

  useEffect(()=>{
    auth.onAuthStateChanged((user)=>{
      if(user){
        setcurrentusername(user);
      }else setcurrentusername("")
    })
  },[])
//   useEffect(()=>{
// setcurrentusername(currentuser.displayName)
//   },[currentusername])
  
  return (
    <>{
      <Container>
      <h1>
        Welcome, <span className='username'>{currentusername.displayName}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </Container>
    }
    </>
  )
}

const Container = styled.div`
display:flex;
flex-direction:column;
justify-content:center;
align-items:center;
  h1{
    color:3232327;
  }
  .username{
    color:#42cdaf;
  }
  h3{
    color:#232327;
  }
`;
