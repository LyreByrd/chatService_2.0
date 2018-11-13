import react from 'react';

//oauth 

//fake simple username input 
//will replace with auth
const Username = ({user, users, usernameInput, submitUsername, handleUsernameChange}) => {

  const onlineUsers = (users) => {
    if (Object.keys(users).length > 0) {
      return Object.values(users).map((user, i) => {
        return <div key={i}>{user}</div>
      })
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


