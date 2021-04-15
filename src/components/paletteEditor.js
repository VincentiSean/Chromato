import React, { useState, useEffect, useRef } from 'react';
import Slider from '@material-ui/core/Slider';
import { createMuiTheme, ThemeProvider, withStyles } from '@material-ui/core';

function usePrevious(value) {
    const ref = useRef();

    useEffect(() => {
        ref.current = value;
    });

    return ref.current;
}

function PaletteEditor({ color, changedColor, close }) {

    let [red, setRed] = useState(0);
    let [green, setGreen] = useState(0);
    let [blue, setBlue] = useState(0);

    let [initial, setInitial] = useState(true);
    let [redRange, setRedRange] = useState();
    let [greenRange, setGreenRange] = useState();
    let [blueRange, setBlueRange] = useState();

    let [newColorArr, setNewColorArr] = useState([]);

    let prevColor = usePrevious(color);

    useEffect(() => {
        if (!(color === prevColor)) {
            setInitial(true);
        }

        if (initial) {
            setInitial(false);
            setRed(color[0]);
            setGreen(color[1]);
            setBlue(color[2]);

            setRedRange(color[0]);
            setGreenRange(color[1]);
            setBlueRange(color[2]);
        }
    }, [color, red, redRange, greenRange, blueRange, newColorArr, prevColor])

    const changeRed = (event, val) => {
        setRedRange(val);
        setRed(val);
        editColor(val, "red");
    }

    const changeGreen = (event, val) => {
        setGreenRange(val);
        setGreen(val);
        editColor(val, "green");
    }

    const changeBlue = (event, val) => {
        setBlueRange(val);
        setBlue(val);
        editColor(val, "blue");
    }

    const editColor = (val, color) => {
        let newColor = [];

        switch(color) {
            case "red":
                newColor.push(val);
                newColor.push(green);
                newColor.push(blue);
                break;
            case "green":
                newColor.push(red);
                newColor.push(val);
                newColor.push(blue);
                break;
            case "blue":
                newColor.push(red);
                newColor.push(green);
                newColor.push(val);
                break;
        }
        
        changedColor(newColor);
        setNewColorArr(newColor);
    }

    function closePrompt() {
        close(true);
    }

    // const RedSlider = withStyles({
    //     root: {
    //         color: 'red',
    //         height: 5,
    //         width: '85vw',
    //     },
    //     thumb: {
    //         height: 20,
    //         width: 20,
    //         backgroundColor: `rgb(${red}, 0,0)`,
    //         border: '2px solid currentColor',
    //         marginTop: -8,
    //         marginLeft: -12,
    //         '&:focus, &:hover, &:$active': {
    //             boxShadow: 'inherit',
    //         },
    //     },
    //     active: {},
    //     track: {
    //         backgroundImage: `linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(${red},0,0,1) 100%)`,
    //         height: 5,
    //         borderRadius: 4,
    //     },
    //     rail: {
    //         backgroundImage: `linear-gradient(90deg, rgba(${red},0,0,1) 0%, rgba(255,0,0,1) 100%)`,
    //         height: 5,
    //         borderRadius: 4,
    //         opacity: 1,
    //     },
    // })(Slider);

    const redTheme = createMuiTheme({
        overrides: {
            MuiSlider: {
                root: {
                    color: 'red',
                    height: 5,
                    marginLeft: 0,
                    width: '90%',
                },
                thumb: {
                    height: 20,
                    width: 20,
                    backgroundColor: `rgb(${red}, 0,0)`,
                    border: `2px solid rgb(175,0,0)`,
                    marginTop: -8,
                    marginLeft: -12,
                    '&:focus, &:hover, &:$active': {
                        boxShadow: 'inherit',
                    },
                },
                active: {},
                track: {
                    backgroundImage: `linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(${red},0,0,1) 100%)`,
                    height: 5,
                    borderRadius: 4,
                },
                rail: {
                    backgroundImage: `linear-gradient(90deg, rgba(${red},0,0,1) 0%, rgba(255,0,0,1) 100%)`,
                    height: 5,
                    borderRadius: 4,
                    opacity: 1,
                },
            }
        }
    })

    const greenTheme = createMuiTheme({
        overrides: {
            MuiSlider: {
                root: {
                    color: 'green',
                    height: 5,
                    marginLeft: 0,
                    width: '90%',
                },
                thumb: {
                    height: 20,
                    width: 20,
                    backgroundColor: `rgb(0, ${green}, 0)`,
                    border: `2px solid rgb(0,175,0)`,
                    marginTop: -8,
                    marginLeft: -12,
                    '&:focus, &:hover, &:$active': {
                        boxShadow: 'inherit',
                    },
                },
                active: {},
                track: {
                    backgroundImage: `linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,${green},0,1) 100%)`,
                    height: 5,
                    borderRadius: 4,
                },
                rail: {
                    backgroundImage: `linear-gradient(90deg, rgba(0,${green},0,1) 0%, rgba(0,255,0,1) 100%)`,
                    height: 5,
                    borderRadius: 4,
                    opacity: 1,
                },
            }
        }
    })

    const blueTheme = createMuiTheme({
        overrides: {
            MuiSlider: {
                root: {
                    color: 'blue',
                    height: 5,
                    marginLeft: 0,
                    width: '90%',
                },
                thumb: {
                    height: 20,
                    width: 20,
                    backgroundColor: `rgb(0, 0, ${blue})`,
                    border: `2px solid rgb(0,0,175)`,
                    marginTop: -8,
                    marginLeft: -12,
                    '&:focus, &:hover, &:$active': {
                        boxShadow: 'inherit',
                    },
                },
                active: {},
                track: {
                    backgroundImage: `linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,${blue},1) 100%)`,
                    height: 5,
                    borderRadius: 4,
                },
                rail: {
                    backgroundImage: `linear-gradient(90deg, rgba(0,0,${blue},1) 0%, rgba(0,0,255,1) 100%)`,
                    height: 5,
                    borderRadius: 4,
                    opacity: 1,
                },
            }
        }
    })

    return (
            (<div className="editor-wrapper">
                <button className="editor-close-btn" onClick={closePrompt}>X</button>
                <ThemeProvider theme={redTheme}>
                    <Slider onChange={changeRed} min={0} max={255} value={red} />
                    <ThemeProvider theme={greenTheme}>
                        <Slider onChange={changeGreen} min={0} max={255} value={green} />
                        <ThemeProvider theme={blueTheme}>
                            <Slider onChange={changeBlue} min={0} max={255} value={blue} />
                        </ThemeProvider>
                    </ThemeProvider>
                </ThemeProvider>
            </div>)
    )
}

export default PaletteEditor;