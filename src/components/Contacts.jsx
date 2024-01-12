import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Logout from './Logout';
import axios from 'axios';
import { alluserroutes,addusers } from '../utils/APIRoutes';
import { auth } from '../firebase';

export default function Contacts({contacts,setcontacts,changechat,setisloaded}) {

    const [currentuser, setcurrentuser] = useState([]);
    const [searchcontact, setsearchcontact] = useState([]);
    const [currentselected, setcurrentselected] = useState([]);
    const [i, seti] = useState("");
    const [errmsg, seterrmsg] = useState([]);


    useEffect(()=>{
        auth.onAuthStateChanged((user)=>{
          if(user){
            setcurrentuser(user);
          }else setcurrentuser("")
        
        })
      },[])
    // useEffect(() => {
    //     if (currentuser) {
    //         setcurrentusername(currentuser.displayName)
    //     }
    // }, [currentuser]);

    function showerrmsg(){
        seterrmsg("")
    }

    // useEffect(()=>{
    //     setcurrentselected(0)
    // },[ch])

    const changecurrentchat = (index, contact) => {
        setcurrentselected(index);
        seti(index)
        changechat(contact);
    }

    const findContact=async(e)=>{
        e.preventDefault();
        await axios.post(alluserroutes,{searchcontact})
        .then(res=>{
            console.log(res)
            if(res.data==null)seterrmsg(`no user found named ${searchcontact}`);
            else{
                // setcontactAdd(res.data)
                // console.log(res.data[0].username)
                // console.log(res.data)
                // setisloaded(true)
                axios.post(addusers,{currentuser:currentuser.displayName,contacttobeadded:res.data}).
                then(res=>{
                    if(res.data=="error")seterrmsg("user already added");
                    setisloaded(true)
                    setcurrentselected(i+1)
                    
                }).catch(err=>console.log(err)) 
            }
        })
        .catch(err=>console.log(err))
        setTimeout(showerrmsg, 2000);
        // return(setisloaded(true))
    }

    // useEffect(async()=>{
    //     await axios.post(addusers,{currentuser.displayName},)
    // },[contactAdd])


    // useEffect(() => {
    //     async function fetchData() {
          
    //         await axios.post(addusers,{currentuser:currentuser.displayName,contacttobeadded:contactAdd.username}).
    //         then(res=>{console.log(res)})
          
    //     }
    //     fetchData()
    //   }, []);

    return (
        <>
            {
                (
                    <Container>
                        <div className="brand">
                            <h3>ChatApp</h3>
                        </div>

                        <div className='add'>
                        <form className='addcontact' onSubmit={(e) => findContact(e)}>
                            <input type="text" placeholder={'Search user'} value={searchcontact} onChange={(e) => setsearchcontact(e.target.value)} />
                            <button className='submit'>
                                Search
                            </button>
                        </form>
                            <div className="errbox">{errmsg}</div>
                        </div>

                        <div className="contacts">
                            {
                                contacts.map((contact, index) => {
                                    return (
                                        <div className={`contact ${index === currentselected ? "selected" : ""}`} key={index} onClick={() => { changecurrentchat(index, contact) }}>
                                            <div className="pfp"></div>
                                            <div className="username">
                                                <h3>{contact.username}</h3>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <div className="currentuser">
                            <div className="username">
                                <h2>{currentuser.displayName}</h2>
                            </div>
                            <div className="logout">
                                <Logout />
                            </div>
                        </div>

                    </Container>
                )

            }
        </>
    )
}

const Container = styled.div`

display : grid;
grid-template-rows:10% 10% 68% 12%;
overflow:hidden;
background-color: #d7dada;
.brand{
    display:flex;
    align-items:center;
    justify-content:center;
    color:#181818;
}
.brand h3{
    text-transform:uppercase;
}
.add{
    display:flex;
    flex-direction:column;
    align-items:center;
    form{
        width:94%;
        height:60%;
        background-color:pink;
        display:flex;
        flex-direction:row;
        input{
            height:94%;
            width:75%;
            padding-left:0.4rem;
            outline:none;
            border:none;
            &::placeholder {
                color: #a7a9a9;
                opacity:0.8;
              }
        }
        button{
            width:25%;
            height:100%;
            border:none;
            background-color:#935652;
            color:white;
            &:hover{
                cursor:pointer;
            }
        }
    }
    .errbox{
        font-size:0.9rem;
        display:flex;
        padding:0.1rem;
        color:red;
    }
}

.contacts{
    display:flex;
    flex-direction:column;
    align-items:center;
    overflow:auto;
    gap:0.6rem;
    &::-webkit-scrollbar{
        width:0.2rem;
        &-thumb{
            background-color:#d7dada;
            width:0.1rem;
            border-radius:1rem;
        }
    }
    overflow-x:hidden;
    .contact{
        background-color:#eff2f2;
        height:5rem;
        width:90%;
        cursor:pointer;
        padding:0.4rem;
        border-radius:0.3rem;
        gap: 1rem;
        align-items:center;
        display:flex;
        // transition:0.2s ease-in-out;
        box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.19);
         
        &:hover{
            background: rgba(0, 0, 0, 0.04);
        }
        
        .username h3{
            color:#303030;
        }
        
    }

    .selected{
        background: #232327;
        &:hover{
            background: #232327;
        }
        .username h3{
            color:#eff2f2;
        }
    }
}
.currentuser{
    background-color:#935652;
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:1rem;
    gap:1rem;

    .username h2{
        color:white;
    }
    .logout{

    }
}
@media screen and (max-width: 768px) {
      grid-template-rows:15% 20% 50% 20%;
      .contacts .contact{
        height:1.2rem;
      }
     
  }
`;
