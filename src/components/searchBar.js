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
        }, 250));
    }

  return (
    <>
      <TextField id="standard-basic search-bar" label="Search by keyword" onChange={updateSeachTerm}/>
    </>
  );
}

export default SearchBar;