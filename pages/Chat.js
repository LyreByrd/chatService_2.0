import react from 'react';
import io from 'socket.io-client';
import Username from './Username';

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
      console.log('chat message', message);
      this.setState((prevState, props) => ({
        messages: [...messages, message]
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
        <div className={messageWindowStyle}>
          chat window
        </div>
      </div>
    )
  }
}

export default Chat;