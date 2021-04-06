import React from 'react';
import { StreamChat } from 'stream-chat';
import { Chat, Channel, ChannelHeader, MessageInput, MessageList, Thread, Window } from 'stream-chat-react';

import 'stream-chat-react/dist/css/index.css';

const chatClient = StreamChat.getInstance('jykek7nkntfh');
const userToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYmlsbG93aW5nLXRyZWUtMiJ9.N4QUiais7pEc2gN5uPXZxl7q1f1-4KAIZL10mrUxktk';

chatClient.connectUser(
  {
    id: 'billowing-tree-2',
    name: 'billowing-tree-2',
    image: 'https://companionsforseniors.com/wp-content/uploads/2019/04/2019-4-17-Are-Mood-Swings-in-the-Elderly-a-Sign-of-Something-More.jpg',
  },
  userToken,
);

const channel = chatClient.channel('messaging', 'billowing-tree-2', {
  // add as many custom fields as you'd like
  image: 'https://www.drupal.org/files/project-images/react.png',
  name: 'Talk about React',
  members: ['billowing-tree-2'],
});

const App = () => (
  <Chat client={chatClient} theme='messaging light'>
    <Channel channel={channel}>
      <Window>
        <ChannelHeader />
        <MessageList />
        <MessageInput />
      </Window>
      <Thread />
    </Channel>
  </Chat>
);

export default App;
