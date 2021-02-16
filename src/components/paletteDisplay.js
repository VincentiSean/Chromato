import { useState, useEffect, useRef } from "react";
import SingleColor from "./singleColor";

function PaletteDisplay(props) {

    let [colors, setColors] = useState([]);
    let [colorBool, setColorBool] = useState(false);    

    
    useEffect(() => {
        if (!colorBool) {
            if (props.colors.length === 5) {
                setColors(props.colors);
            } else {
                setColors(props.colors[0]);
            }
        }
    }, [props, colors, colorBool])
    
    
    return (
        <>
            {colors !== undefined
                ?   (<div className="palette-display" style={{ display: 'flex' }}>
                        {colors.map((color, index) => {
                            return (
                                <SingleColor key={index} color={color} changeColor={() => props.changeColor(color, index)} />
                            )
                        })}
                    </div>)
                :   <></>
            }
        </>
    );
}

export default PaletteDisplay;