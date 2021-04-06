// //import React from 'react';
// import { StreamChat } from 'stream-chat';
// import { Chat, Channel, ChannelHeader, MessageInput, MessageList, Thread, Window } from 'stream-chat-react';



// import 'stream-chat-react/dist/css/index.css';

const chatClient = StreamChat.getInstance('jykek7nkntfh', "zr6krgs7xpg3stsf85xtewfpttba5pz7bb9cm6exwtw6666g8ruf8pky43j8z9ht");

chatClient.upsertUsers({
    users: {
        id: "elderly",
        name: "elderly",
        role: "admin"
    }
});

const token = chatClient.createToken('elderly');
console.log(token);