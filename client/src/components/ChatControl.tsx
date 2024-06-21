import { useState } from "react";
import { ChatCard, ChatMessage } from "./ChatCard"


export interface ChatControlProps{
    chatMessages: ChatMessage[];
    onSend: (messages: ChatMessage[]) => void;
    showinternalCalls: boolean;
}

export const ChatControl = (props: ChatControlProps) => {
    const {chatMessages, onSend, showinternalCalls} = props;
    const [message, setMessage] = useState('');

    const onClick = () =>{
        const latestChatMessage: ChatMessage = {
            isLoading: false,
            content: message,
            role: 'user'
        };

        onSend([...chatMessages, latestChatMessage]);
        setMessage('');
    }

    const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) =>{
        if(e.key === 'Enter'){
            onClick();
        }
    }

    const messages = chatMessages
    .filter(m =>{
        if(!showinternalCalls){
            return m.role === 'user' || m.role === 'assistant' || m.role === 'localAssistant';
        }

        return true;
    })
    .map((m, i) => {
        return <ChatCard
            isLoading={m.isLoading}
            messageType={m.role}
            content={m.content} 
            isEnvVarError={m.isEnvVarError}
            key={i}/>;
    })

    return <div className='container chat-container'>
        <div className='chat-inner-container'>
            {messages}
        </div>
        <div className='container input-row'>
            <div className='row'>
                <div className='col-sm-1'></div>
                <div className='col-sm-9'>
                    <input
                        type="text"
                        className="form-control"
                        value={message}
                        onChange={m => setMessage(m.target.value)}
                        onKeyDown={onKeyPress}
                        placeholder="e.g. Please suggest some activities based on my location and the weather."></input>
                </div>
                <div className='col-sm-1'>
                    <button className="btn btn-primary" onClick={onClick}>Send</button>
                </div>
            </div>
        </div>
    </div>
}