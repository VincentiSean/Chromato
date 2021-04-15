import './App.css';
import { useEffect, useState } from 'react';
import fire, { db } from './config/Fire';
import ColorThief from 'colorthief/dist/color-thief.mjs';
import axios from 'axios';

import SearchBar from './components/searchBar';
import PaletteDisplay from './components/paletteDisplay';
import LoginPrompt from './components/loginPrompt';
import MenuComp from './components/menu';
import SavedPalettes from './components/savePalettes';
import Arrows from './components/arrows';
import PaletteEditor from './components/paletteEditor';


function App() {

  const defaultColorArr = [      
    [249,76,65],
    [252,147,90],
    [191,193,107],
    [33,161,148],
    [19,83,80]
  ];

  let [currColors, setCurrColors] = useState(0);
  let [currPal, setCurrPal] = useState([defaultColorArr]);

  let [imageURLs, setImageURLs] = useState([]);
  let [colorPalettes, setColorPalettes] = useState([defaultColorArr]);

  let [loginToggle, setLoginToggle] = useState(false);
  let [paletteToggle, setPaletteToggle] = useState(false);

  let [user, setUser] = useState();
  let [paletteArray, setPaletteArray] = useState([]);
  let [needSavedPals, setNeedSavedPals] = useState(true);
  let [loadBool, setLoadBool] = useState(false);

  let [edit, setEdit] = useState(false);
  let [colorToChange, setColorToChange] = useState([]);
  let [indexToChange, setIndexToChange] = useState();

  const colorThief = new ColorThief();
  const RAPID_API_KEY = process.env.REACT_APP_RAPID_API_KEY;
  

  useEffect(() => {
    authListener();
    if (needSavedPals) {
      if (user) {
        getPalettes();
      }
    }

  }, [imageURLs, 
      currColors, 
      currPal,
      loginToggle, 
      user, 
      paletteArray, 
      needSavedPals,  
      paletteToggle,
      edit 
    ])

  // Sends the term from the search bar into the Bing API function
  const handleSearch = newSearchTerm => {
    searchAPI(newSearchTerm);
  }

  const toggleLogin = (val) => {
    setLoginToggle(true);
  }

  // Log the user out and reset the palette display to the default colors
  const logout = () => {
    setCurrColors(defaultColorArr);
    
    fire.auth().signOut().then(function() {}, function(error) {
      console.error('Sign Out Error', error);
    });
    setUser(null);
    setNeedSavedPals(true);   // Necessary to update the saved palette popup to display none
  }

  const togglePalettes = (bool) => {
    setPaletteToggle(bool);
    setIndexToChange(undefined);
  }

  const toggleEdit = (bool) => {
    setEdit(bool);
  }

  // Takes a search term as a parameter and plugs it into the Bing Image API
  //    It receives the first image result from Bing and sets the state var as the image url
  //    It then passes the  image url into ColorThief getImageColor function
  const searchAPI = searchTerm => {

    const options = {
      method: 'GET',
      url: 'https://bing-image-search1.p.rapidapi.com/images/search',
      params: {q: searchTerm},
      headers: {
        'x-rapidapi-key': RAPID_API_KEY,
        'x-rapidapi-host': 'bing-image-search1.p.rapidapi.com'
      }
    };
    
    let newImageArr = [];
    let newColorArr = [];
    axios.request(options).then(function (response) {
      for (let i = 0; i < response.data.value.length; i++) {
          newImageArr.push(response.data.value[i].thumbnailUrl);
          newColorArr.push(getImageColors(response.data.value[i].thumbnailUrl));
          if (i === 0) {
            setCurrPal(newColorArr[0]);
            console.log(newColorArr[0]);
          }
      }
      setColorPalettes(newColorArr);
    }).catch(function (error) {
      console.error(error);
    });

    setImageURLs(newImageArr);
  }


  // Receives an image url and uses ColorThief to average 5 main colors
  //    from the image and set the state colors var as an array of 5 rgb values
  function getImageColors(image) {
    setLoadBool(true);

    const img = new Image();
    const colors = [];
    img.addEventListener('load', () => {
      colors.push(colorThief.getPalette(img, 5));
    });

    // Google proxy stops CORS from triggering
    let imageURL = image;
    let googleProxyURL = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=';

    img.crossOrigin = 'Anonymous';
    img.src = googleProxyURL + encodeURIComponent(imageURL);

    setTimeout(function() {
      setLoadBool(false);
    }, 2000);

    return colors;
  }


  // Toggles Closing or Opening the login/signup prompt
  function handlePrompt(boolVal) {
    setLoginToggle(!boolVal)
  }


  // Closes the Saved Palette popup 
  function handlePalettePrompt(boolVal) {
    setPaletteToggle(false);
  }


  // Sets the user on login to the state variable 'user'
  function handleUser(user) {
    setUser(user);
  }

  function handleColorChange(index){
    setCurrColors(index);
    console.log(colorPalettes);
    console.log(index);
    setCurrPal(colorPalettes[index]);
  }


  // Queries the saved palettes associated with the user and 
  //  saves them to the state
  function getPalettes() {
    let paletteArr = [];
    
    db.ref(`users/${user.uid}`).on("value", snapshot => {
        snapshot.forEach(snap => {
            paletteArr.push(snap.val());
        })
    })
    setPaletteArray(paletteArr);
    setNeedSavedPals(false);
  }


  // Saves the current array of colors in currColors to the Firebase db
  function savePalette(boolVal) {

    let stringPalette = currPal.join("").replaceAll(",", "");
    if (boolVal) {
      if (currPal[0][4]) {
        db.ref(`users/${user.uid}/${stringPalette}`)
        .set({
          "colorOne": currPal[0][0],
          "colorTwo": currPal[0][1],
          "colorThree": currPal[0][2],
          "colorFour": currPal[0][3],
          "colorFive": currPal[0][4]
        })
      } else {
        db.ref(`users/${user.uid}/${stringPalette}`)
        .set({
          "colorOne": currPal[0],
          "colorTwo": currPal[1],
          "colorThree": currPal[2],
          "colorFour": currPal[3],
          "colorFive": currPal[4]
        })
      }
    }
      

    setNeedSavedPals(true);
  }


  // Waits for user to be signed in
  function authListener() {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setLoginToggle(false);

      } else {
        setUser(undefined);
      }
    })
  }


  // Handles deleting a palette from the user's saved palettes when the user click the x
  function deletePal(palette) {

    // Turn the color palette object into an array
    let arrayifiedPalette = Object.entries(palette);
    
    // Make a new array to reorder and hold the color palette
    let arrayHolder = [];
    arrayHolder.push(arrayifiedPalette[2].join(","));
    arrayHolder.push(arrayifiedPalette[4].join(","));
    arrayHolder.push(arrayifiedPalette[3].join(","));
    arrayHolder.push(arrayifiedPalette[1].join(","));
    arrayHolder.push(arrayifiedPalette[0].join(","));

    // Split up each array item and get rid of unnecessary words from object
    for (let i = 0; i < 5; i++) {
      let tempArray = arrayHolder[i].split(",");
      arrayHolder[i] = tempArray.splice(1, 3);
    }

    // Rejoin the array into a string and replace all commas with nothing
    arrayHolder = arrayHolder.join("");
    arrayHolder = arrayHolder.replaceAll(",","");
    
    // Search db for corresponding moniker and remove
    db.ref(`users/${user.uid}`).child(arrayHolder).remove();

    // Update saved palettes
    getPalettes();
  }


  // Handles changing the currColors when the user clicks on a saved palette
  function changeDisplay(palette) {
    // Change object to array for mapping in PaletteDisplay component
    let palArr = Object.values(palette); 

    // Reorder the array to fix bug where the same palette is 
    //    displayed in a different order --> could save the 
    //    same palette in multiple different orders
    let newPalArr = [];
    newPalArr.push(palArr[2]);
    newPalArr.push(palArr[4]);
    newPalArr.push(palArr[3]);
    newPalArr.push(palArr[1]);
    newPalArr.push(palArr[0]);
    setCurrPal(newPalArr);
  }

  function editColor(color, index) {
    setIndexToChange(index);
    setColorToChange(color);
    setPaletteToggle(false)
  }

  function changeColor(newColor) {
    let newPal = [[]];
    let oldPal = [[]];
    if (!Array.isArray(currPal[0][0])) {
      for (let i = 0; i < 5; i++) {
        oldPal[0].push(currPal[i]);
      }
    } else {
      oldPal = currPal;
    }

    for (let i = 0; i < 5; i++) {
      if (i === indexToChange) {
        newPal[0].push(newColor);
      } else {
        newPal[0].push(oldPal[0][i]);
      }
    }

    setCurrPal(newPal);
  }

  function closeEditor(bool) {
    setIndexToChange(undefined);
  }


  return (
    <div className="App">
      <div className="header">
        <SearchBar className="search-wrapper" search={handleSearch} />        
        <MenuComp 
          saveCurrPalette={savePalette} 
          user={user} 
          login={toggleLogin} 
          logout={logout}
          palettes={togglePalettes}
          edit={toggleEdit}
        />
      </div>

      {colorPalettes.length > 1
        ? <Arrows 
          len={colorPalettes.length - 1} 
          currIndex={currColors} 
          newIndex={handleColorChange}
        />
        : <></>
      }

      {loadBool
        ?   (colorPalettes !== null
              ? (<div className="loader">
                  <div className="large-box"></div>
                  <div className="small-box" style={{ backgroundColor: `rgb(${currColors[2]})` }}></div>
                </div>)
              : <></>)
        :   <></>
      }

      {indexToChange !== undefined 
        ? (<PaletteEditor color={colorToChange} changedColor={changeColor} close={closeEditor} />)
        : <></>
      }

      {/* Displays currColors if not undefined */}
      {currPal !== undefined
        ?   (currPal !== null
              ? (<>
                  <PaletteDisplay colors={currPal} changeColor={editColor} />
                </>)
              : <></>)
        : <></>
      }

      {/* Display login/signup if true */}
      {loginToggle
        ? <LoginPrompt user={handleUser} close={handlePrompt} />
        : <></>
      }

      {/* Display saved palette popup if true */}
      {paletteToggle
        ? (<SavedPalettes 
            palettes={paletteArray} 
            close={handlePalettePrompt}
            deletePal={deletePal}
            changeDisplay={changeDisplay}
          />)
        : <></>
      }

    </div>
  );
}

export default App;
