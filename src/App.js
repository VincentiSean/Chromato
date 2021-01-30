import './App.css';
import { useEffect, useState } from 'react';
import ColorThief from 'colorthief/dist/color-thief.mjs';
import axios from 'axios';

import SearchBar from './components/searchBar';
import PaletteDisplay from './components/paletteDisplay';

function App() {

  let [currColors, setCurrColors] = useState();
  let [imageURL, setImageURL] = useState();

  const colorThief = new ColorThief();
  const RAPID_API_KEY = process.env.REACT_APP_RAPID_API_KEY;

  useEffect(() => {}, [imageURL, currColors])

  // Sends the term from the search bar into the Bing API function
  const handleSearch = newSearchTerm => {
    searchAPI(newSearchTerm);
  }

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

  const getImageColors = image => {
    
    const img = new Image();
    img.addEventListener('load', () => {
      setCurrColors(colorThief.getPalette(img, 5));
    });

    let imageURL = image;
    let googleProxyURL = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=';

    img.crossOrigin = 'Anonymous';
    img.src = googleProxyURL + encodeURIComponent(imageURL);
  }


  return (
    <div className="App">
      <SearchBar search={handleSearch} />
      {/* <MenuButton /> */}
      
      {imageURL !== undefined
        ?   (<>
              <PaletteDisplay colors={currColors} />
            </>)
        : <></>
      }
    </div>
  );
}

export default App;
