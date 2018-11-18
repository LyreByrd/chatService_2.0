import react from 'react';
import io from 'socket.io-client';
import Username from './Username';
import CreateMessage from './CreateMessage';
import Messages from './Messages'

const messagesStyle = {
  border: 'solid 1px black',
  display: 'flex',
  flex: '1 1 auto',
  height: '500px',
  width: '400px',
  overflowY: 'scroll'
}
class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: '',
      users: {},
      messages: [],
      usernameInput: ''
    }
    this.submitUsername = this.submitUsername.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.messageRef = React.createRef();

  }

  componentDidMount() {
    const socket = io();
    // socket.connect();
    
    socket.on('connection', data => {
      console.log('chat connection', data);
    })

    socket.on('online users', usersObj => {
      // console.log('init users', usersObj);
      // console.log('socket username ', socket.username)
      this.setState({
        users: usersObj
      })
    })
    
    socket.on('chat message', message => {
      // console.log('chat message on client from socket.io', message);
      // console.log('chat message on client from socket.io', Array.isArray(message));
      if(typeof message[0] === 'string') {
        message = message.map(string => {
          return JSON.parse(string)
        })
      }
      // console.log('message', message);
      // todo this is bad. im sending all messages to all users on new connection
      // todo need to make socket only send to new connection
      // todo will be easier once rooms are set up
      if (this.state.user !== '' && this.state.messages.length !== message.length) {
        this.setState((prevState) => ({
          messages: [...prevState.messages, ...message]
        }))
      } 
    })
    
    socket.on('user connected', usersObj => {
      // console.log('socket username ', socket.username)
      // console.log('user connected', usersObj);
      this.setState({
        users: usersObj
      })
      // console.log('users ',this.state.users)
    })

    socket.on('user disconnected', (usersObj) => {
      // console.log('user disconnected', usersObj);
      this.setState({
        users: usersObj
      })
    })

    this.messagesScrollDown();
  }

  componentDidUpdate() {
    this.messagesScrollDown();
  }

  messagesScrollDown = () => {
    const scrollHeight = this.messageRef.scrollHeight;
    const height = this.messageRef.clientHeight;
    const maxScrollTop = scrollHeight - height;
    this.messageRef.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }

  //username methods
  submitUsername = (e) => {
    const socket = io();
    e.preventDefault();
    this.setState({
      user: this.state.usernameInput
    })
    socket.emit('user connected', this.state.usernameInput);
  }

  handleUsernameChange = (input) => {
    this.setState({
      usernameInput: input
    })

  }


  render() {
    return (
      <div>
        
        <Username 
          user={this.state.user}
          users={this.state.users}
          submitUsername={this.submitUsername}
          usernameInput={this.state.usernameInput}
          handleUsernameChange={this.handleUsernameChange}
        />
        <div 
          style={messagesStyle}
          ref={(el) => this.messageRef = el}>
          <Messages 
            messages={this.state.messages}
          />
          <div style={{ float:"left", clear: "both" }}
               ref={(el) => { this.messageRef = el; }}>
          </div>
        </div>
        <CreateMessage 
          user={this.state.user}
        />
      </div>
    )
  }
}

export default Chat;