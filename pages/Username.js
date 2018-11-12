import react from 'react';

//fake simple username input 
//will replace with auth
const Username = ({user, users, usernameInput, submitUsername, handleUsernameChange}) => {
  return (
    <div>
      <div>
        {user === '' ? 
        <div>
          <div>Please Select Your Name:</div>
          <form className='usernameSelect' onSubmit={ (e) => submitUsername(e) } >
            <input type='text' placeholder='Username' value={usernameInput} onChange={ () => handleUsernameChange(event.target.value) }/>
            <input type='submit' onClick={ (e) => submitUsername(e) }/>
          </form>
        </div> :
        `Hello ${user}`}
        <div>Online Users:</div>
        {users.map((usr, i) => {
          return <div key={i}>{usr}</div>
        })}
       </div>
    </div>
  )
}

export default Username;