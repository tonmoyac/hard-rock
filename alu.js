const search = document.getElementById('search-btn')
const input = document.getElementById('input')
const result = document.getElementById('result')
const lyricsSection =document.getElementById('lyricsSection')


/// api URL ///
const apiURL = 'https://api.lyrics.ovh';


/// adding event listener in form

search.addEventListener('click', e=> {
    e.preventDefault();
    searchValue = input.value.trim();

    if(!searchValue){
        alert("There is nothing to search");
    }
    else{ 
        searchSong(searchValue);
    }
})

//search song 
async function searchSong(searchValue){
    const searchResult = await fetch(`${apiURL}/suggest/${searchValue}`)
    const results = await searchResult.json();


    showResult(results);
}

function showResult(results){
    result.innerHTML='';
    results.data.forEach(r=>{

        let card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML =`
         
        <div class="single-result row align-items-center my-3 p-3">
        <img class="col-md-3 album-img" src="${r.album.cover_small}" alt="album-image">
        <div class="col-md-6">
            <h3 class="lyrics-name">${r.title}</h3>
            <p class="author lead">Album by <span class="authorName">${r.artist.name.substring(0,20)}</span></p>
            <a class="song-link" href="${r.link}" target="_blank">Song</a>
        </div>
        <div class="col-md-3 text-md-right text-center">
            <button class="btn btn-success get-lyrics-btn"><span data-artist="${r.artist.name}" data-songtitle="${r.title}"> Get Lyrics</span>
            </button>
        </div>
    </div>
    <div id="lyricsSection"></div>
 
        `
        result.appendChild(card);
        
        const clearBtn = document.getElementById("clear");
        clearBtn.style.display='block';
                clearBtn.addEventListener("click", function(){
                    result.innerHTML ='';
                    clearBtn.style.display='none';
                })
    })
        

}


//event listener in get lyrics button
result.addEventListener('click', e=>{
    const clickedElement = e.target;

    //checking clicked elemet is button or not
    if (clickedElement.tagName === 'SPAN'){
        const artist = clickedElement.getAttribute('data-artist');
        const songTitle = clickedElement.getAttribute('data-songtitle');
        
        getLyrics(artist, songTitle)
    }
})

// Get lyrics for song
async function getLyrics(artist, songTitle) {
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    const data = await res.json();
  
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
  
    result.innerHTML = `
    
    
    
    
    
    <div class="single-lyrics text-center">
                <button class="btn go-back" id="goBack">&#8249; Go Back</button>
                <h2 class="text-success mb-4"><strong>${artist}</strong> -${songTitle}</h2>
                <pre class="lyric text-white">${lyrics}</pre>
                </div>`;

                const goBack = document.getElementById("goBack");
                goBack.addEventListener("click", function(){
                    searchSong(searchValue)
                })
  }