// JavaScript for Opening and Closing the Modal
const modal = document.getElementById("playlist-modal");
const closeBtn = document.getElementById("close-btn");
let allPlaylists;

document.addEventListener("DOMContentLoaded", function () {
  fetch("data/data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      allPlaylists = data;
      if (window.location.pathname.includes("index.html")) {
        displayPlaylists();
      } else {
        const randomPlaylist =
          allPlaylists[Math.floor(Math.random() * allPlaylists.length)];
        const featuredPlaylist = document.getElementById("featured-playlist");
        featuredPlaylist.innerHTML = `
        <img class="featured-img" src="${randomPlaylist.playlist_art}" alt="${randomPlaylist.playlist_name}">
        <h2>${randomPlaylist.playlist_name}</h2>
        `;

        const featuredSongs = document.getElementById("featured-songs");
        randomPlaylist.songs.forEach((song) => {
          featuredSongs.innerHTML += `
         <article class="song"> 
            <img
               class="modal-song-image"
               src="${song.song_art}"
               alt="${song.name}"
            />
            <div>
               <h4>${song.name}</h4>
               <h5>${song.artist}</h5>
            </div>
            <h4 class="duration">${song.duration}</h4>
         </article>
         `;
        });
      }
    })
    .catch((error) => {
      console.error("There was a problem: ", error);
    });

  const allTabItem = document.getElementById("all-tab-item");
  const featuredTabItem = document.getElementById("featured-tab-item");

  if (window.location.pathname.includes("index.html")) {
    allTabItem.style.color = "rgb(238, 228, 215)";

    featuredTabItem.addEventListener("click", function () {
      const newURL = window.location.href.replace(
        "index.html",
        "featured.html"
      );
      window.location.href = newURL;
    });

    closeBtn.addEventListener("click", function () {
      modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    });
  } else {
    featuredTabItem.style.color = "rgb(238, 228, 215)";

    allTabItem.addEventListener("click", function () {
      const newURL = window.location.href.replace(
        "featured.html",
        "index.html"
      );
      window.location.href = newURL;
    });
  }
});

function displayPlaylists() {
  const playlistContainer = document.getElementById("playlist-container");

  allPlaylists.forEach((playlist) => {
    const playlistToDisplay = document.createElement("article");
    playlistToDisplay.className = "playlist-cards";
    playlistToDisplay.id = playlist.playlistID;

    playlistToDisplay.innerHTML = `
      <img src="${playlist.playlist_art}" alt="${playlist.playlist_name}" class="playlist-img" />
      <h2 class="playlist-title">${playlist.playlist_name}</h2>
      <p class="playlist-author">${playlist.playlist_author}</p>
      <div class="playlist-like">
         <span id="heart-${playlist.playlistID}" class="material-symbols-outlined" onclick="adjustLikeCount('${playlist.playlistID}')">favorite</span> 
         <span id="like-${playlist.playlistID}">${playlist.like_count}</span>
      </div>
      `;

    playlistToDisplay.addEventListener("click", function (event) {
      if (!event.target.className.includes("material-symbols-outlined")) {
        openModal(playlist.playlistID);
      }
    });

    playlistContainer.appendChild(playlistToDisplay);
  });

  if (allPlaylists.length == 0) {
    let noPlaylistsMessage = document.createElement("h3");
    noPlaylistsMessage.className = "no-playlists";
    noPlaylistsMessage.textContent = "No playlists added";
    playlistContainer.appendChild(noPlaylistsMessage);
  }
}

function openModal(selectedPlaylistID) {
  const selectedPlaylist = allPlaylists.find(
    (playlist) => playlist.playlistID === selectedPlaylistID
  );

  const modalPlaylistInfo = document.createElement("section");
  modalPlaylistInfo.className = "modal-img-title-author";

  modalPlaylistInfo.innerHTML = `
   <img class="modal-playlist-image" src="${selectedPlaylist.playlist_art}" alt="${selectedPlaylist.playlist_name}"/>
   <div class="modal-title-author">
      <h2>${selectedPlaylist.playlist_name} </h2>
      <h3>${selectedPlaylist.playlist_author}</h3>
      <button id="shuffle-btn" class="shuffle-btn">Shuffle</button>
   </div>
  `;

  const modalSongInfo = document.createElement("section");
  modalSongInfo.className = "modal-songs";
  modalSongInfo.id = "modal-songs";

  selectedPlaylist.songs.forEach((song) => {
    modalSongInfo.innerHTML += `
   <article class="song">
      <img
         class="modal-song-image"
         src="${song.song_art}"
         alt="${song.name}"
      />
      <div>
         <h4>${song.name}</h4>
         <h5>${song.artist}</h5>
      </div>
      <h4 class="duration">${song.duration}</h4>
   </article>
   `;
  });

  const modalContent = document.getElementById("modal-content");
  modalContent.replaceChildren(closeBtn);
  modalContent.appendChild(modalPlaylistInfo);
  modalContent.appendChild(modalSongInfo);

  const shuffleBtn = document.getElementById("shuffle-btn");
  shuffleBtn.addEventListener("click", function () {
    shuffleBtn.blur();
    fisherYatesShuffle(selectedPlaylist.songs);
  });

  modal.style.display = "block";
}

function adjustLikeCount(selectedPlaylistID) {
  const selectedPlaylist = allPlaylists.find(
    (playlist) => playlist.playlistID === selectedPlaylistID
  );

  const playlistLikeButton = document.getElementById(
    `heart-${selectedPlaylistID}`
  );
  if (playlistLikeButton.classList.contains("highlight-like")) {
    selectedPlaylist.like_count--;
  } else {
    selectedPlaylist.like_count++;
  }
  playlistLikeButton.classList.toggle("highlight-like");

  const playlistLikeCount = document.getElementById(
    `like-${selectedPlaylistID}`
  );
  playlistLikeCount.textContent = selectedPlaylist.like_count;
}

function fisherYatesShuffle(songs) {
  let currentIndex = songs.length;

  while (currentIndex != 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [songs[currentIndex], songs[randomIndex]] = [
      songs[randomIndex],
      songs[currentIndex],
    ];
  }

  const modalContent = document.getElementById("modal-content");
  const modalSongInfo = document.getElementById("modal-songs");
  modalContent.removeChild(modalSongInfo);

  const newModalSongInfo = document.createElement("section");
  newModalSongInfo.className = "modal-songs";
  newModalSongInfo.id = "modal-songs";

  songs.forEach((song) => {
    newModalSongInfo.innerHTML += `
   <article class="song">
      <img
         class="modal-song-image"
         src="${song.song_art}"
         alt="${song.name}"
      />
      <div>
         <h4>${song.name}</h4>
         <h5>${song.artist}</h5>
      </div>
      <h4 class="duration">${song.duration}</h4>
   </article>
   `;
  });

  modalContent.appendChild(newModalSongInfo);
}

// Math.random() % allPlaylists.length
