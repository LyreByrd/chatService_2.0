import react from 'react';

//fake simple username input 
//will replace with auth
const Username = ({user, users, usernameInput, submitUsername, handleUsernameChange}) => {

  const onlineUsers = (users) => {
    console.log('users in map', users)
    if (users.length > 1) {
      return users.map((user, i) => {
        console.log('user in map', user);
        if (user !== []) {
          return <div key={i}>{user[0][0]}</div>;
        }
      });
    }
  }

  return (
    <div>
      <div>
        {user === '' ? 
        <div>
          <div>Please Select Your Username:</div>
          <form className='usernameSelect' onSubmit={ (e) => submitUsername(e) } >
            <input type='text' placeholder='Username' value={usernameInput} onChange={ () => handleUsernameChange(event.target.value) }/>
            <input type='submit' onClick={ (e) => submitUsername(e) }/>
          </form>
        </div> :
        `Hello ${user}`}
        <div>Online Users:</div>
        {onlineUsers(users)}
       </div>
    </div>
  )
}

export default Username;


