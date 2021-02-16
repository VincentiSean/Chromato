import { useState, useEffect, useCallback } from 'react';
import { useTransition, animated } from 'react-spring';


const icons = [
    ({ style, hex }) => <animated.div style={{ ...style, left: 'calc(50% - 33px)' }}>#{hex}</animated.div>,
    ({ style }) => <animated.div style={{ ...style, left: 'calc(50% - 15px)' }}>
        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-clipboard-check" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="2" />
            <path d="M9 14l2 2l4 -4" />
        </svg>
    </animated.div>
]

function SingleColor({ color, changeColor }) {

    let [displayBool, setDisplayBool] = useState(false);
    let [index, set] = useState(0);
    const [hex, setHex] = useState([]);    
    const heightVal = '100%';
    const widthVal = '20%';

    const transitions = useTransition(index, p => p, {
        from: { 
            backgroundColor: '#343434', 
                position: 'absolute', 
                opacity: 0,
                borderRadius: '10px',
                color: '#f3f3f3',
                fontSize: '14px',
                fontWeight: 600,
                padding: '5px 5px',
                bottom: '30px',
            },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
    })

    useEffect(() => {
        getHex(color);
    }, [color])

    function displayColorCode() {
        setDisplayBool(!displayBool);
    }


    //  This function takes an array of colors and changes each one
    //      to its HEX value from RGB
    function getHex(colorArr) {
        let hexArr = [];

        colorArr.map((val, index) => {
            let newVal = parseInt(val);
            let firstVal = Math.floor(newVal / 16);
            let secondVal = (Math.abs(newVal / 16) - Math.floor(newVal / 16)) * 16;

            if (firstVal > 9) {
               let letter = convertToLetter(firstVal)
               hexArr.push(letter);
            } else {
                hexArr.push(firstVal);
            }

            if (secondVal > 9) {
                let letter = convertToLetter(secondVal)
                hexArr.push(letter);
             } else {
                 hexArr.push(secondVal);
             }

        })

        setHex(hexArr);
    }


    // Based on the val, the number is changed to the appropriate HEX letter
    function convertToLetter(val) {
        switch(val) {
            case 10:
                return 'a';
            case 11:
                return 'b';
            case 12:
                return 'c';
            case 13:
                return 'd';
            case 14:
                return 'e';
            case 15:
                return 'f';
        }
    }

    // const copyToClipboard = useCallback(() => {
    //     set(state => (state + 1) % 2);
    //     navigator.clipboard.writeText(`#${hex.join('')}`);

    //     setTimeout(function() {
    //         set(state => (state + 1) % 2);
    //     }, 1000);
    // });

    const editColor = () => {
        changeColor(true);
    }

    return (
        <div 
            onMouseOut={displayColorCode}
            onMouseOver={displayColorCode}
            onClick={editColor}
            style={{
                backgroundColor: `rgb(${color})`,
                color: '#f3f3f3',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: heightVal,
                position: 'relative',
                width: widthVal
        }}>
            {displayBool
                ?   (<div className="color-code-div">
                        {transitions.map(({ item, props, key }) => {
                            const Icon = icons[item]
                            return <Icon hex={hex} key={key} style={props} />
                        })
                    }
                    </div>)
                :   <></>
            }
        </div>
    )
}

export default SingleColor;