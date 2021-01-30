import { useState, useEffect } from "react";

function PaletteDisplay(props) {

    let [colors, setColors] = useState([]);
    let [colorBool, setColorBool] = useState(false);
    const heightVal = 'calc(100vh - 100px)';
    const widthVal = '20%';

    useEffect(() => {
        if (!colorBool) {
            if (props.colors) {
                setColors(props.colors);
                setColorBool(true);
            }
        }

    }, [props, colorBool])

    console.log(colors[0]);
    return (
        colors.length > 0
            ?   (<div style={{display: 'flex'}}>
                    {props.colors.map((color, index) => {
                        return (<div style={{
                                    backgroundColor: `rgb(${color})`,
                                    height: heightVal,
                                    width: widthVal
                                }}></div>
                        )
                    })}
                </div>)
            :   <></>
    );
}

export default PaletteDisplay;