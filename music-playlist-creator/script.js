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
      displayPlaylists(data);
    })
    .catch((error) => {
      console.error("There was a problem: ", error);
    });
});

closeBtn.addEventListener("click", function () {
  modal.style.display = "none";
});

window.addEventListener("click", function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});

function displayPlaylists(playlists) {
  allPlaylists = playlists;
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
      <button class="shuffle-btn">Shuffle</button>
   </div>
  `;

  const modalSongInfo = document.createElement("section");
  modalSongInfo.className = "modal-songs";

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
