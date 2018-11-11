import react from 'react';
import io from 'socket.io-client';
import Username from './Username';
import CreateMessage from './CreateMessage';
import Messages from './Messages'

const messageWindowStyle = {
  border: 'solid 1px black',
  display: 'flex',
  'flexFlow': 'column',
  flex: '1 1 auto',
  height: '500px',
  width: '400px'
}
class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: '',
      messages: [],
      usernameInput: ''
    }
    this.submitUsername = this.submitUsername.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);

  }

  componentDidMount() {
    const socket = io();
    socket.on('connection', data => {
      console.log('chat connection', data);
    })
    socket.on('chat message', message => {
      // console.log('chat message', message);
      this.setState((prevState, props) => ({
        messages: [...prevState.messages, message]
      }))
    })
  }

  //username methods
  submitUsername = (e) => {
    e.preventDefault();
    this.setState({
      user: this.state.usernameInput
    })
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
          submitUsername={this.submitUsername}
          usernameInput={this.state.usernameInput}
          handleUsernameChange={this.handleUsernameChange}
        />
        <div style={messageWindowStyle}>
          <Messages 
            messages={this.state.messages}
          />
        </div>
        <CreateMessage 
          user={this.state.user}
        />
      </div>
    )
  }
}

export default Chat;