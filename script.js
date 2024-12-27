console.log("Hello js script")

let currentSong = new Audio();
let songs;
let currFolder;
let fol="";
let Apisong = ""

// async function getsongs() {
//     let a =await fetch("http://192.168.56.1:3000/Bhajan")
//     let b = await a.text()
//     console.log(b)
// }
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}




async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(Apisong+folder)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            // songs.push(element.href.split(`http://192.168.56.1:3000/songs`)[1])
            songs.push(element.href.split(folder)[1].replace("/",""));
        }
    }
    
    return songs
}


function palylist(songs){
    const songlist = document.querySelector(".songlist");
    songlist.innerHTML = "";
    // let index = songs.length-1;
    // while(0<=index)  
    for (let index = songs.length-1; 0<=index; index--)
        {
      // Show all the songs in the playlist
      
      if (songlist) {
          songlist.insertAdjacentHTML("afterbegin", `
              <div class="songcard border">
                  <div>
                      <img src="img/music.svg" alt="">
                      <div>
                          <h5>${songs[index].replaceAll("%20", " ").slice(0, 17)}...</h5>
                          <p>yashpal</p>
                      </div>
                  </div>
                  <div>
                      <button><img src="img/play.svg" alt=""></button>
                  </div>
              </div>
          `);
      } else {
          console.error("Element with class 'songlist' not found.");
      }
      
    //   index--;
}


// Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
//     e.addEventListener("click", element => {
//         playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

//     })
// })

// Attach an event listener to each song card in the song list
Array.from(document.querySelector(".songlist").getElementsByClassName("songcard")).forEach((card,index) => {
    card.addEventListener("click", () => {
        // Retrieve the song name from the <h5> element inside the clicked song card
            // const songName = card.querySelector("h5").innerHTML.trim();
            songName =songs[index];
            console.log(songName)
        // Call the function to play the selected music
        playMusic(songName);
    });
});


}


playMusic= (track, paused=false)=>{
    // Play the selected music
//    let audio = new Audio("/songs/"+track)
currentSong.src = "/songs/"+fol+track ;
console.log("currentsong",currentSong)
    if(!paused){
        
   currentSong.play();
   document.getElementById("play").getElementsByTagName("img")[0].src = "img/pause.svg";
    }
   

   document.querySelector('.songinfo').innerHTML=decodeURI(track).slice(0, 8)+"...";
   document.querySelector('.songtime').innerHTML="00:00/"+ secondsToMinutesSeconds(currentSong.duration);

}




async function displayAlbums() {
    let albums = await fetch(Apisong+"songs/")
    let response = await albums.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    
    let cardContainer = document.querySelector(".playliststore")
    let array = Array.from(anchors)
    

    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            // Get the metadata of the folder
            let a = await fetch(Apisong+`/songs/${folder}/info.json`)
            let response = await a.json(); 
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder=${folder} class="playlistContainer">
                    <div class="cardInfo ">
                        <div class="cardImage"><img src="/songs/${folder}/cover.jpg" alt=""></div>
                        <div class="play">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5" stroke-linejoin="round"></path>
                            </svg>
                        </div>
                        <h3>${response.title}</h3>
                        <p>${response.description}</p>
                    </div>
                    
                </div> `
        }
    }
    
    
     // Load the playlist whenever card is clicked
 Array.from(document.getElementsByClassName("playlistContainer")).forEach(e => { 
    e.addEventListener("click", async item => {
        console.log("Fetching Songs")
        // console.log("item",item.currentTarget.dataset.folder)
        fol = item.currentTarget.dataset.folder+"/";
        
        songs = await getSongs(`/songs/`+item.currentTarget.dataset.folder)  
        console.log("songs",songs[0])
        palylist(songs)
        playMusic(songs[0]);
        

    })
})

    
    
    
}

async function defaul(){
    songss = await getSongs("/songs/zlike/");
    console.log(songss);
     palylist(songss); 
     fol="zlike/";
    //play song first
     // var audio = new Audio(songs[0]); 
     // audio.play();
     playMusic(songss[0],true); 
}


async function main(){

    
    await defaul();
    //by default song is paused

     // Display all the albums on the page
     await displayAlbums()

    // Attach an event listener to play, next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            // play.src = "img/pause.svg"
            document.getElementById("play").getElementsByTagName("img")[0].src = "img/pause.svg";
        }
        else {
            currentSong.pause()
            document.getElementById("play").getElementsByTagName("img")[0].src = "img/play.svg";
            // play.src = "img/play.svg"
        }
    })




    //like shongs

    document.querySelector(".linb").addEventListener("click",async()=>{
        
        await defaul();
   
    
    })

    //duration
    // audio.addEventListener("loadeddata",()=>{
    //     // let duration = audio.duration;
    //     console.log(audio.duration, audio.currentSrc, audio.currentTime);
    // });


    //time update
  // Listen for timeupdate event
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `
    ${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
    document.querySelector(".seekbarTrack").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    if (currentSong.currentTime == currentSong.duration) {
        // play next song
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }else{
            index = 0;
            playMusic(songs[index])
        }
    }
});

// Add an event listener to seekbar
document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".seekbarTrack").style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration) * percent) / 100
})

// responsive event lisener on hamburger
 
document.querySelector(".hamburger").addEventListener("click", () => {
    console.log("click me")
    document.querySelector(".left").style.left="0"

})
// responsive event lisener on close

document.querySelector(".cross").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-150%"
})

  // Add an event listener to previous
  previous.addEventListener("click", () => {
    currentSong.pause()
    document.getElementById("play").getElementsByTagName("img")[0].src = "img/pause.svg";
    console.log("Previous clicked")
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index - 1) >= 0) {
        playMusic(songs[index - 1])
    }else{
        index = songs.length-1;
        playMusic(songs[index])
    }
})

// Add an event listener to next
next.addEventListener("click", () => {
    currentSong.pause()
    document.getElementById("play").getElementsByTagName("img")[0].src = "img/play.svg";
    console.log("Next clicked")

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index + 1) < songs.length) {
        playMusic(songs[index + 1])
    }else{
        index = 0;
        playMusic(songs[index])
    }
})


    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume >x0){
            document.querySelector(".range>img").src = document.querySelector(".range>img").src.replace("img/mute.svg", "img/volume.svg")
        }
    })

    // Add event listener to mute the track
    document.querySelector(".range>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("img/volume.svg")){
            e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })





}

main()
