import { useState } from 'react';
import { TextField } from '@material-ui/core';

function SearchBar({ search }) {
    const [typingTimer, setTypingTimer] = useState();

    const updateSeachTerm = (event) => {
        // This sets a timer to wait to send what was typed. Prevents constant searches to the image api 
        const val = event.target.value;
        clearTimeout(typingTimer);
        setTypingTimer(setTimeout(() => {
            if (val) {
              search(val);
            }
        }, 200));
    }

  return (
    <>
      <TextField 
        className="search-bar"
        id="standard-basic search-bar" 
        placeholder="Enter a keyword"
        autoFocus={true}
        onChange={updateSeachTerm}
        InputProps={{
          style: {
            color: '#f3f3f3',
            padding: '0 10px',
          }         
        }}
      />
    </>
  );
}


export default SearchBar;