import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import Clearchat from './Clearchat';
import Chatinput from './Chatinput';
import { RiChatDeleteFill } from "react-icons/ri";
import Messages from './Messages';
import axios from 'axios';
import { getallmessageroute, sendmsgroute, clearallchats } from '../utils/APIRoutes';
import { v4 as uuidv4 } from 'uuid';

export default function Chatcontainer({ currentchat, currentuser, socket }) {

    const [messages, setmessages] = useState([]);
    const [arrivalmsg, setarrivalmsg] = useState([]);
    const [msgs, setmsg] = useState();
    

    const scrollRef = useRef(null);

    let newdata;
    let msgdata;
    useEffect(() => {
        async function fetchdata() {
            if (currentchat) {
                await axios.post(getallmessageroute, {
                    from: currentuser._id,
                    to: currentchat._id
                }).then(res => msgdata = res.data).catch(err => console.log(err));
                setmessages(msgdata)
            }
        }
        fetchdata();
    }, [currentchat])



    const handlesendmsg = async (msg) => {
        await axios.post(sendmsgroute, {
            from: currentuser._id,
            to: currentchat._id,
            message: msg
        })
        socket.current.emit('send-msg', {
            to: currentchat._id,
            from: currentuser._id,
            message: msg
        })

        const msgs = [...messages];
        msgs.push({ fromself: true, message: msg });
        setmessages(msgs);
    }

    useEffect(() => {
        if (socket.current) {
            socket.current.on('msg-recieve', (msg) => {
                setarrivalmsg({ fromself: false, message: msg })
            })
        }
    })



    const handleClearchat = async () => {
        await axios.post(clearallchats, {
            from: currentuser._id,
            to: currentchat._id
        }).then(res => setmsg(res.data)).catch(err => console.log(err))

        // const msg = [...messages];
        // msg.push({ fromself: true, message: "deleted!" });
        setmessages([{ fromself: true, message: "All chats deleted!" }]);

        socket.current.emit('send-msg', {
            to: currentchat._id,
            from: currentuser._id,
            message: "deleted!"
        })
        
    }
    useEffect(() => {
        let arrivalmsgs = arrivalmsg;
        if (arrivalmsgs.message == "deleted!") {
            setmessages([{ fromself: false, message: `All chat deleted by ${currentuser.username}` }])
        }
        else setmessages((prev) => [...prev, arrivalmsgs])
    }, [arrivalmsg]);



    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages]);
    return (
        <>
            {
                currentchat && (
                    <Container>
                        <div className="chatheader">
                            <div className="userdetail">
                                <div className="username">
                                    <h3>{currentchat.username}</h3>
                                </div>
                            </div>
                    
                                    <button onClick={handleClearchat} >
                                        <RiChatDeleteFill />
                                    </button>
                              
                        </div>
                        <div className="chat-messages">
                            {
                                messages.map((message) => {

                                    return (
                                        
                                            <div ref={scrollRef} key={uuidv4()} className={`message ${message.fromself ? "sended" : "recieved"}`}>
                                                <div className="content">
                                                    <p>
                                                        {message.message}

                                                    </p>
                                                </div>
                                        
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <Chatinput handlesendmsg={handlesendmsg} />
                    </Container>
                )
            }
        </>
    )
}

const Container = styled.div`

display:grid;
grid-template-rows:10% 78% 12%;
flex-direction:column;
overflow:hidden;

.chatheader{
    
    display:flex;
    background-color:#232327;
    justify-content:space-between;
    align-items:center;
    padding:0 1.1rem;
    .userdetail{
        display:flex;
        align-items:center;
        justify-content: space-between; 
        gap:1rem;
         .username h3{
                color:white;
            }
        }
    button{
        display:flex;
        background:transparent;
        border:none;
        font-size:1.35rem;
        border-radius:5rem;
        padding:0.3rem 0.4rem;
        padding-bottom:0.5rem;
        color:white;
        &:hover{
          cursor:pointer;
        }
    }
}
.chat-messages{
    padding:1rem 2rem;
    display:flex;
    flex-direction:column;
    overflow:auto;
    
    gap:1rem;
    &::-webkit-scrollbar{
        display:none;
    }
    
    .message {
        display:flex;
        align-items:center;
        .content {
            box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1), 0 0 1px 0 rgba(0, 0, 0, 0.1);
            border-radius:23rem;
            font-size:1.2rem;
            padding:0 1.3rem;
            overflow-wrap:break-word;
        }
        
    }
    .sended{
        justify-content:flex-end;
        .content{
            background-color:#42cdaf;
            color:white;
        }
    }
    recieved{
        justify-content:flex-start;
        background-color:#eff2f2;
        display:flex;
            color:#232327;
            width:40%;
            border-radius:1rem;
            font-size:1rem;
            overflow-wrap:break-word;
        
    }
}
@media screen and (max-width: 768px) {
    grid-template-rows:10%
}
`;
