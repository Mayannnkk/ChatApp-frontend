import React,{useEffect, useState} from 'react';
import styled from 'styled-components';
import Picker from 'emoji-picker-react';
import {IoMdSend} from 'react-icons/io';
import {BsEmojiSmileFill} from 'react-icons/bs';

export default function Chatinput({handlesendmsg}) {

    const[msg,setmsg]=useState([]);
    const [showEmoji, setshowEmoji] = useState();


    const sendchat=(e)=>{
        e.preventDefault();
        if(msg.length>0){
            handlesendmsg(msg);
            setmsg('')
        }
    }

    const handleemojiclick=(event,emoji)=>{
    
        let message=msg;
        message += event.emoji;
        setmsg(message)
        
    }

  return (
    <Container>
        <div className="button-container">
            <div className="emoji">
                <BsEmojiSmileFill />
                <Picker  onEmojiClick={(emojiObject)=> setmsg((prevMsg)=> prevMsg + emojiObject.emoji)} className='picker'/>
            </div>
        </div>
        <form className='input-container' onSubmit={(e)=>sendchat(e)}>
            <input type="text" placeholder='type your message here' value={msg} onChange={(e)=>setmsg(e.target.value)}/>
            <button className='submit'>
                <IoMdSend/>
            </button>
        </form>
    </Container>
  )
}

const Container=styled.div`
display:grid;
grid-template-columns:5% 95%;
background-color:#ffffff;
align-items:center;
padding:0.3rem;
padding-bottom:0.2rem;

.button-container{
    display:flex;
    align-items:center;
    color:white;
    justify-content:center;
    .emoji{
        position:relative;
        svg{
            color:#42cdaf;
            cursor:pointer;
            font-size:1.3rem;
        }
        .picker{
            display:none;
            position:absolute;
            top:-450px;
        }
        &:hover .picker{
            display:block;
        }
    }
}
.input-container{
    background-color:#fafbfb;
    width:100%;
    display:flex;
    
    gap:1rem;
    align-items:center;
    border-radius:5rem;
    box-shadow: 0 0px 100px 0 rgba(0, 0, 0, 0.15);
    input{
        width:90%;
        height:60%;
        background-color:transparent;
        color:#181818;
        padding:0.9rem;
        font-size:1rem;
        border:none;
        border-radius:2rem;
        &::placeholder {
            color: #a7a9a9;
            opacity:0.8;
          }
        &::selection{
            
        }
        &:focus{
            outline:none;
        }
    }
    .submit{
        display:flex;
        margin:0.3rem;
        align-items:center;
        justify-content:center;
        background-color:#42cdaf;
        border:none;
        border-radius:52rem;
        padding:0.5rem 1rem;
        padding-left:1.2rem;
        color:white;
        font-size:1.6rem;

        &:hover{
            cursor:pointer;
        }
    }
}
`;