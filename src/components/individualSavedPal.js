import React, { useState } from 'react';

function IndividualSavedPal({ changeDisplay, deletePal, palette }) {

    let [delBtn, setDelBtn] = useState(false);

    // Sets props to trigger display change to selected palette
    function changePalDisplay() {
        changeDisplay(palette);
        setDelBtn(true);
    }

    function trueShowDel() {
        setDelBtn(true);
    }

    // Triggers the x button to show on hover
    function showDelete() {
        setDelBtn(!delBtn);
    }

    // Sets props to delete the current palette when x is clicked
    function deletePalette() {
        deletePal(palette);
    }
    
    return (
            <div 
                className="saved-palette" 
                onClick={changePalDisplay}
                onMouseEnter={trueShowDel}
                onMouseOver={trueShowDel}
                onMouseOut={showDelete}
                onTouchStart={changePalDisplay}
            >
                <div 
                    className="saved-indiv-color"
                    style={{
                        backgroundColor: `rgb(${palette.colorOne})`
                    }}></div>
                <div 
                    className="saved-indiv-color"
                    style={{
                        backgroundColor: `rgb(${palette.colorTwo})`
                    }}></div>
                <div 
                    className="saved-indiv-color"
                    style={{
                        backgroundColor: `rgb(${palette.colorThree})`
                }}></div>
                <div 
                    className="saved-indiv-color"
                    style={{
                        backgroundColor: `rgb(${palette.colorFour})`
                    }}></div>
                <div 
                    className="saved-indiv-color"
                    style={{
                        backgroundColor: `rgb(${palette.colorFive})`
                }}></div>

                {delBtn
                    ?   (<button 
                            className="palette-del-btn" 
                            onMouseDown={deletePalette}
                            onTouchEnd={deletePalette}
                        >
                            X
                        </button>)
                    : <></>
                }
            </div>
    )
}

export default IndividualSavedPal;