import react from 'react';

//fake simple username input 
//will replace with auth
const Username = ({user, usernameInput, submitUsername, handleUsernameChange}) => {
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
       </div>
    </div>
  )
}

export default Username;