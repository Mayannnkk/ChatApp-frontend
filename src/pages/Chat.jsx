import React, { useEffect, useState, useRef} from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { showcurrentuser, host, showaddeduser } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import Chatcontainer from '../components/Chatcontainer';
import {io} from "socket.io-client";
import { auth } from '../firebase';
import { reload } from 'firebase/auth';

export default function Chat() {

  const navigate = useNavigate();
  const socket = useRef();

  const [contacts, setcontacts] = useState([]);
  const [currentuser, setcurrentuser] = useState([]);
  const [currentchat, setcurrentchat] = useState();
  const [isloaded, setisloaded] = useState(false);
  const [curruser, setcurruser] = useState();

   
  useEffect(()=>{
    if(currentuser===""){
      navigate("/Login")
    }else{
      auth.onAuthStateChanged((user)=>{
        if(user){
          setcurrentuser(user);
          setisloaded(true)
        }else setcurrentuser("")
      })
    }
  },[currentuser])

  useEffect(()=>{
  if(currentuser.displayName){async function fetchdata(){
    await axios.post(showcurrentuser,{currentuser:currentuser.displayName}).
    then(res=>{
    setcurruser(res.data)
    console.log(res.data) 
    })
  }
  fetchdata()}
},[currentuser.displayName])

  useEffect(()=>{
    async function fetchdata(){
    if(currentuser.displayName){
      socket.current=io(host)
      socket.current.emit("add-user",curruser._id);
      console.log(`${currentuser.displayName} connected`)
      
    //   if (count==0 && currentuser.displayName) {
    //     await axios.post(showaddeduser,{currentuser:currentuser.displayName}).
    //      then(res=>{
    //        console.log(res.data.addedContacts)
    //        setcontacts(res.data.addedContacts)
    //       //  setcount(1)
    //      })
    //    }
    }
  }
  fetchdata()
  },[curruser]);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     // if (!localStorage.getItem("chat-app-user")) {
  //     //   navigate("/login");
  //     // }
  //     // else {
  //     //   setcurrentuser(await JSON.parse(localStorage.getItem("chat-app-user")));
  //     //   setisloaded(true);
  //     // }
  //   }
  //   fetchData()
  // }, [])

  // useEffect(()=>{
  //   setisloaded(false)
  // },[])
  useEffect(() => {
    async function fetchData() {
      if ( isloaded && currentuser.displayName) {
       await axios.post(showaddeduser,{currentuser:currentuser.displayName}).
        then(res=>{
          // console.log(res.data.addedContacts)
          setcontacts(res.data.addedContacts)
          setisloaded(false);
          handlechatchange = (chat) => {
            setcurrentchat(chat)
          }  
        })
      }
    }
    fetchData()
  }, [isloaded]);

  let handlechatchange = (chat) => {
    setcurrentchat(chat)
  }  

  return (
    <>
    {
    currentuser && (<Container>
      <div className='container'>
        <Contacts contacts={contacts} currentuser={currentuser} changechat={handlechatchange} setcontacts={setcontacts} setisloaded={setisloaded}/>
        {
          (!currentchat) ?
          (<Welcome currentuser={currentuser}/>)
          :
          (<Chatcontainer currentchat={currentchat} currentuser={curruser} socket={socket}/>)
        }
            
      </div>
      </Container>
  )}
  </>
  )
}

const Container = styled.div`

background-color:#ffffff;
height:100vh;
width:100vw;
display:flex;
flex-direction:colummn;
justify-content:center;
align-items:center;

.container{
  height:85vh;
  width:85vw;
  background-color:#fdfefe;
  display:grid;
  grid-template-columns: 25% 75%;
  box-shadow: 0 0px 0px 0 rgba(0, 0, 0, 1), 0 1px 30px 0 rgba(0, 0, 0, 0.19);
}

@media screen and (max-width: 768px) {
  
  .container{
    height:100%;
    width:100%;
    grid-template-columns:100%;
    grid-template-rows:35% 75%;
   }
}
`
