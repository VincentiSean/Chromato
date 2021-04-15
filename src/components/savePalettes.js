import React, { useEffect } from 'react';
import IndividualSavedPal from './individualSavedPal';

function SavedPalettes({ changeDisplay, deletePal, close, palettes }) {

    useEffect(() => {
        
    }, [palettes])

    function closePrompt() {
        close(true);
    }

    
    return (
        palettes.length > 0
            ?   (<div className="saved-palette-wrapper">
                    <button 
                            className="palette-close-btn" 
                            onClick={closePrompt}>
                                X
                        </button>
                    <div className="saved-palette-div">
                        
                        {palettes.length > 0
                            ?   (palettes.map((palette, index) => {
                                    return (<IndividualSavedPal 
                                                changeDisplay={changeDisplay}
                                                key={index} 
                                                palette={palette}
                                                deletePal={deletePal}
                                            />)
                                }))
                            :   <></>
                        }
                    </div>    
                </div>)
            :   <></>
    )
}

export default SavedPalettes;