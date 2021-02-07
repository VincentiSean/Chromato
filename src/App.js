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

function App() {

  const defaultColorArr = [      
    [249,76,65],
    [252,147,90],
    [191,193,107],
    [33,161,148],
    [19,83,80]
  ];

  let [currColors, setCurrColors] = useState(defaultColorArr);
  let [imageURL, setImageURL] = useState();
  let [loginToggle, setLoginToggle] = useState(false);
  let [paletteToggle, setPaletteToggle] = useState(false);
  let [user, setUser] = useState();
  let [paletteArray, setPaletteArray] = useState([]);
  let [needSavedPals, setNeedSavedPals] = useState(true);
  let [loadBool, setLoadBool] = useState(false);

  const colorThief = new ColorThief();
  const RAPID_API_KEY = process.env.REACT_APP_RAPID_API_KEY;
  

  useEffect(() => {
    authListener();
    if (needSavedPals) {
      if (user) {
        getPalettes();
      }
    }
  }, [imageURL, 
      currColors, 
      loginToggle, 
      user, 
      paletteArray, 
      needSavedPals,
      // getPalettes       
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
    
    axios.request(options).then(function (response) {
      setImageURL(response.data.value[0].contentUrl);
      getImageColors(response.data.value[0].contentUrl)
    }).catch(function (error) {
      console.error(error);
    });
  }


  // Receives an image url and uses ColorThief to average 5 main colors
  //    from the image and set the state colors var as an array of 5 rgb values
  const getImageColors = image => {
 
    setLoadBool(true);

    const img = new Image();
    img.addEventListener('load', () => {
      setCurrColors(colorThief.getPalette(img, 5));
    });

    // Google proxy stops CORS from triggering
    let imageURL = image;
    let googleProxyURL = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=';

    img.crossOrigin = 'Anonymous';
    img.src = googleProxyURL + encodeURIComponent(imageURL);

    setTimeout(function() {
      setLoadBool(false);
    }, 2000);
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
    if (boolVal) {
      db.ref(`users/${user.uid}/${currColors[0]}`)
      .set({
        "colorOne": currColors[0],
        "colorTwo": currColors[1],
        "colorThree": currColors[2],
        "colorFour": currColors[3],
        "colorFive": currColors[4]
      })

      setNeedSavedPals(true);
    }
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
    db.ref(`users/${user.uid}`).child((palette.colorOne).join()).remove();
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
    setCurrColors(newPalArr);
  }

  
  return (
    <div className="App">
      <div className="header">
        <SearchBar search={handleSearch} />        
        <MenuComp 
          saveCurrPalette={savePalette} 
          user={user} 
          login={toggleLogin} 
          logout={logout}
          palettes={togglePalettes}
        />
      </div>
      {loadBool
        ?   (<div className="loader">
              <div className="large-box"></div>
              <div className="small-box" style={{ backgroundColor: `rgb(${currColors[2]})` }}></div>
            </div>)
        :   <></>
      }
      {/* Displays currColors if not undefined */}
      {currColors !== undefined
        ?   (<>
              <PaletteDisplay colors={currColors} />
            </>)
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
