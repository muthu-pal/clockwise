import React, { useState, useEffect } from "react";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Playlist from "./Playlist.js";
import queryString from "query-string";
import { format } from "util";


const FiltersDrop = (props) => {
  const [loggedInQuery, setLoggedInQuery] = useState("");
  
  const [serverData, setServerData] = useState(
    {
      user: "",
    });

  //states for ids
  //track ids for user's top songs
  const [serverDataTopSongsLT, setServerDataTopSongsLT] = useState([]);
  const [serverDataTopSongsMT, setServerDataTopSongsMT] = useState([]);
  const [serverDataTopSongsST, setServerDataTopSongsST] = useState([]);


  //track info like id, acousticness, tempo, etc
  const [tracksInfoLT, setTracksInfoLT] = useState([]);
  const [tracksInfoMT, setTracksInfoMT] = useState([]);
  const [tracksInfoST, setTracksInfoST] = useState([]);

    //filtered ids based on mood picked
  const [filteredIDArr, setFilteredIDArr] = useState([]);

  //return song name based on filtered array
  const [topSongsArr, setTopSongsArr] = useState([]);

  const [dropdownOpenMood, setOpenMood] = useState(false);
  const [Mood, setMood] = useState("High Energy");

  const [dropdownOpenView, setOpenView] = useState(false);
  const [viewNum, setView] = useState("All Time");




  //LOG IN 

  function logIn(){
    const parsed = queryString.parse(window.location.search);
    let access_token = parsed.access_token;
    setLoggedInQuery(access_token);
    if (!access_token){
      console.log("err")
      return;
    }
  }

//GET TRACK IDS IN ARRAY
  useEffect(() => {
    fetch('https://api.spotify.com/v1/me', 
    {headers: {'Authorization': 'Bearer ' + loggedInQuery}
    }).then((response) => 
      response.json()
     ).then((data) => (setServerData({...serverData, user: data.display_name})))
     .catch(error => console.log(error))
    

    fetch('https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=long_term', 
    {headers: {'Authorization': 'Bearer ' + loggedInQuery}
    }).then((response) => response.json())
      .then((data) => setServerDataTopSongsLT(data.items.map(item => item.id)))
      .catch(error => console.log(error))

      fetch('https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=medium_term', 
    {headers: {'Authorization': 'Bearer ' + loggedInQuery}
    }).then((response) => response.json())
      .then((data) => setServerDataTopSongsMT(data.items.map(item => item.id)))
      .catch(error => console.log(error))

      fetch('https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=short_term', 
    {headers: {'Authorization': 'Bearer ' + loggedInQuery}
    }).then((response) => response.json())
      .then((data) => setServerDataTopSongsST(data.items.map(item => item.id)))
      .catch(error => console.log(error)) 
    
  }, [loggedInQuery]);





//LONGTERM DATA: track info
useEffect(() => {
  
  let arrLink = serverDataTopSongsLT.reduce((total, init) => (total + ","+ init) , "");
  arrLink = arrLink.slice(1,);
  fetch(`https://api.spotify.com/v1/audio-features?ids=${arrLink}`, 
        {headers: {'Authorization': 'Bearer ' + loggedInQuery}
        }).then((response) => response.json())
         .then((data) => 
         setTracksInfoLT( ...tracksInfoLT,
         (data.audio_features.map(item => (
                     {
                    id: item.id,
                    acousticness: item.acousticness,
                    danceability: item.danceability,
                    energy: item.energy,
                    instrumentalness: item.instrumentalness,
                    liveness: item.liveness,
                    loudness: item.loudness,
                    speechiness: item.speechiness,
                    valence: item.valence,
                    tempo: item.tempo
                     })
                     ))
                    ))
        
                    .catch(error => console.log(error))  
  }, [serverDataTopSongsLT]);    
 // console.log(tracksInfoLT); 

//MediumTERM DATA: track info
useEffect(() => {
  let arrLink = serverDataTopSongsMT.reduce((total, init) => (total + ","+ init) , "");
  arrLink = arrLink.slice(1,);
  fetch(`https://api.spotify.com/v1/audio-features?ids=${arrLink}`, 
        {headers: {'Authorization': 'Bearer ' + loggedInQuery}
        }).then((response) => response.json())
         .then((data) => 
         setTracksInfoMT( ...tracksInfoLT,
         (data.audio_features.map(item => (
                     {
                    id: item.id,
                    acousticness: item.acousticness,
                    danceability: item.danceability,
                    energy: item.energy,
                    instrumentalness: item.instrumentalness,
                    liveness: item.liveness,
                    loudness: item.loudness,
                    speechiness: item.speechiness,
                    valence: item.valence,
                    tempo: item.tempo
                     })
                     ))
                    ))
        
                    .catch(error => console.log(error))  
  }, [serverDataTopSongsMT]);    
 // console.log(tracksInfoMT); 


//ShortTERM DATA: track info
useEffect(() => {
  
  let arrLink = serverDataTopSongsST.reduce((total, init) => (total + ","+ init) , "");
  arrLink = arrLink.slice(1,);
  fetch(`https://api.spotify.com/v1/audio-features?ids=${arrLink}`, 
        {headers: {'Authorization': 'Bearer ' + loggedInQuery}
        }).then((response) => response.json())
         .then((data) => 
         setTracksInfoST( ...tracksInfoLT,
         (data.audio_features.map(item => (
                     {
                    id: item.id,
                    acousticness: item.acousticness,
                    danceability: item.danceability,
                    energy: item.energy,
                    instrumentalness: item.instrumentalness,
                    liveness: item.liveness,
                    loudness: item.loudness,
                    speechiness: item.speechiness,
                    valence: item.valence,
                    tempo: item.tempo
                     })
                     ))
                    ))
        
                    .catch(error => console.log(error))  
  }, [serverDataTopSongsST]);    
 // console.log(tracksInfoST); 
  


useEffect(() => {
  //take in an array of filtered IDs and return the image, track name, artist
    if (filteredIDArr.length === 0){
      console.log("empty");
      setTopSongsArr([])
      return;
    }
    let arrLink = filteredIDArr.reduce((total, init) => (total + ","+ init) , "");
    arrLink = arrLink.slice(1,);
    fetch(`https://api.spotify.com/v1/tracks?ids=${arrLink}`, 
        {headers: {'Authorization': 'Bearer ' + loggedInQuery}
        }).then((response) => response.json())
         .then((data) => 
         setTopSongsArr(
         (data.tracks.map(item => (
                     {
                    name: item.name,
                    artist: item.album.artists[0].name,
                    photo: item.album.images[2].url,
                     })
                     ))
                    ))
        
                    .catch(error => console.log(error))
    
    
  
}, [filteredIDArr]);    
//console.log(topSongsArr); 


//FUNCTIONS TO FILTER MOODS
//classify audio features
function returnRange(val) {
  if (val > 0 && val <= 0.33) {
    return "low";
  } else if (val > 0.33 && val <= 0.66) {
    return "medium";
  } else {
    return "high";
  }
}  

function select_tracks(track) {
  let danceability = returnRange(track.danceability);
  let energy = returnRange(track.energy);
  let acousticness = returnRange(track.acousticness);
  let instrumentalness = returnRange(track.instrumentalness);
  let speechiness = returnRange(track.speechiness);
  let valence = returnRange(track.valence);
  let tempo = track.tempo;

  let moodFiltered = "none"
  if (
    danceability !== "high" 
    //&&
    // energy === "low" &&
    // valence === "medium" &&
    // tempo > 66.66 &&
    // tempo <= 133.33 
  ){
    //console.log("chill")
    moodFiltered = "Chill";
   } 
  //else if (valence === "medium" 
  //   && acousticness === "high") {
  //   return "Acoustic";
  // } else if (
  //   danceability === "high" &&
  //   energy === "high" &&
  //   valence === "high" &&
  //   tempo > 66.66 &&
  //   tempo <= 133.33
  // ) {
  //   return "Happy";
  // } else if (
  //   danceability === "low" &&
  //   energy === "low" &&
  //   valence === "low" &&
  //   tempo <= 66.66 &&
  //   acousticness === "medium"
  // ) {
  //   return "Sad";
  // } else if (
  //   danceability === "low" &&
  //   energy === "medium" &&
  //   tempo <= 66.66 &&
  //   acousticness === "high"
  // ) {
  //   return "Studying";
  // } else if (danceability === "high" 
  //     && energy === "high" 
  //     && tempo > 133.33) {
  //     return "Party";
  // }
  // console.log(moodFiltered)
  // console.log(Mood)
  // console.log(moodFiltered === Mood)
  return (moodFiltered === Mood)
}

//set filtered array based on mood chosen
 useEffect(() => {
  if (viewNum === "All Time"){
    setFilteredIDArr(
      tracksInfoLT.filter((e) => select_tracks(e)).map(e => e.id)
    );
  }
  else if (viewNum === "6 Months"){
    setFilteredIDArr(
      tracksInfoMT.filter((e) => select_tracks(e)).map(e => e.id)
    );
  }
  else{
    setFilteredIDArr(
      tracksInfoST.filter((e) => select_tracks(e)).map(e => e.id)
    );
  }
   }, [Mood, viewNum]);

//console.log(filteredIDArr)






  
//toggle dropdown buttons
  const toggleMood = () => {
    setOpenMood(!dropdownOpenMood);
  };
  const toggleV = () => {
    setOpenView(!dropdownOpenView);
  };


  //set mood state based on what is clicked
  function clickedHighEnergy() {
    setMood("High Energy");
    
  }
  function clickedDanceable() {
    setMood("Danceable");
    
  }
  function clickedAcoustic() {
    setMood("Acoustic");
    
  }
  function clickedChill() {
    setMood("Chill");
    
  }
  function clickedHappy() {
    setMood("Happy");
    
  }
  function clickedSad() {
    setMood("Sad");
    
  }
  function clickedStudying() {
    setMood("Studying");
    
  }
  function clickedParty() {
    setMood("Party");
    
  }


  //filter based on time frame
  function clickedST() {
    setView("30 Days");
    
  }
  function clickedMT() {
    setView("6 Months");
    
  }
  function clickedLT() {
    setView("All Time");
    
  }

  return (
    <div>
      {(loggedInQuery !== "") ?
                                <div>
                                      <div>
                                        <ButtonDropdown
                                          isOpen={dropdownOpenMood}
                                          toggle={toggleMood}
                                          className="Mood--Btn"
                                        >
                                          <DropdownToggle
                                            caret
                                            style={{
                                              backgroundColor: "#1DB954",
                                              borderColor: "white",
                                              color: "white",
                                              borderRadius: "20px"
                                            }}
                                          >
                                            Mood: {Mood}
                                          </DropdownToggle>
                                          <DropdownMenu>
                                            <DropdownItem onClick={clickedHighEnergy}>High Energy</DropdownItem>
                                            <DropdownItem onClick={clickedDanceable}>Danceable</DropdownItem>
                                            <DropdownItem onClick={clickedAcoustic}>Acoustic</DropdownItem>
                                            <DropdownItem onClick={clickedChill}>Chill</DropdownItem>
                                            <DropdownItem onClick={clickedHappy}>Happy</DropdownItem>
                                            <DropdownItem onClick={clickedSad}>Sad</DropdownItem>
                                            <DropdownItem onClick={clickedStudying}>Study</DropdownItem>
                                            <DropdownItem onClick={clickedParty}>Party</DropdownItem>
                                          </DropdownMenu>
                                        </ButtonDropdown>

                                        <ButtonDropdown
                                          isOpen={dropdownOpenView}
                                          toggle={toggleV}
                                          className="view--Btn"
                                        >
                                          <DropdownToggle
                                            caret
                                            style={{
                                              backgroundColor: "transparent",
                                              borderColor: "white",
                                              color: "white",
                                              borderRadius: "20px"
                                            }}
                                          >
                                            View: {viewNum}
                                          </DropdownToggle>
                                          <DropdownMenu>
                                            <DropdownItem onClick={clickedLT}>All Time</DropdownItem>
                                            <DropdownItem onClick={clickedMT}>6 Months</DropdownItem>
                                            <DropdownItem onClick={clickedST}>30 Days</DropdownItem>
                                          </DropdownMenu>
                                        </ButtonDropdown>
                                    
                                      <br />
                                      <br />
                                      {(topSongsArr.length !== 0) ? 
                                    <div>
                                      {topSongsArr.map((element) => {
                                        return (
                                          <>
                                            <Playlist
                                              name={element.name}
                                              artist={element.artist}
                                              photo={element.photo}
                                              photoAlt="Album Cover"
                                            />
                                          </>
                                        );
                                      })}
                                      </div>
                                      : <h3>there are no songs that match :(</h3>
                                      }
                                      </div>
                                      </div>
      
      

      : 
      (<div><h1>please sign in <Button onClick={logIn}>here</Button></h1></div>)}
      

    </div>
  );
};

export default FiltersDrop;
