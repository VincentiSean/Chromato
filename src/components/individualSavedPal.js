import React, { useState } from 'react';

function IndividualSavedPal({ changeDisplay, deletePal, palette }) {

    let [delBtn, setDelBtn] = useState(false);

    // Sets props to trigger display change to selected palette
    function changePalDisplay() {
        changeDisplay(palette);
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
                onMouseOver={showDelete}
                onMouseOut={showDelete}
            >
                {delBtn
                    ?   (<button 
                            className="palette-del-btn" 
                            onClick={deletePalette}
                        >
                            X
                        </button>)
                    : <></>
                }
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
            </div>
    )
}

export default IndividualSavedPal;