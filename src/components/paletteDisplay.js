import { useState, useEffect } from "react";
import SingleColor from "./singleColor";

function PaletteDisplay(props) {

    let [colors, setColors] = useState([]);
    let [colorBool, setColorBool] = useState(false);

    useEffect(() => {
        if (!colorBool) {
            if (props.colors) {
                setColors(props.colors);
                setColorBool(true);
            }
        }

    }, [props, colorBool])

    return (
        colors.length > 0
            ?   (<div className="palette-display" style={{ display: 'flex' }}>
                    {props.colors.map((color, index) => {
                        return (
                            <SingleColor key={index} color={color} />
                        )
                    })}
                </div>)
            :   <></>
    );
}

export default PaletteDisplay;