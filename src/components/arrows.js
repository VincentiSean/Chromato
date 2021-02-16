import React, { useEffect } from 'react';

function Arrows({ len, currIndex, newIndex }) {

    useEffect(() => {
        
    }, [len, currIndex])

    const clickDecrease = () => {
        let index = currIndex - 1;
        if (index >= 0) {
            newIndex(index);
        } else {
            newIndex(len);
        }
    }

    const clickIncrease = () => {
        let index = currIndex + 1;
        if (index <= len) {
            newIndex(index);
        } else {
            newIndex(0);
        }
    }

    return (
            (<>
                  <button className="left-arr arrow-btn" onClick={clickDecrease}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chevron-left" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <polyline points="15 6 9 12 15 18" />
                    </svg>
                  </button>
                  <button className="right-arr arrow-btn"  onClick={clickIncrease}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chevron-right" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <polyline points="9 6 15 12 9 18" />
                    </svg>
                  </button>
            </>)
    )
}

export default Arrows;