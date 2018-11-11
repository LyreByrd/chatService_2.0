import react from 'react';

const Messages = ({messages}) => {
  console.log(messages);

  return (
    <div>
      {messages.map((message, i) => {
        return <div key={i}>{message.user}: {message.message}</div>
      })}
    </div>
  )
}

export default Messages;