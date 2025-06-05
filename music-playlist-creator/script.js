// JavaScript for Opening and Closing the Modal
const selectedPlaylist = document.getElementsByClassName("playlist-cards")[0];
const modal = document.getElementById("playlist-modal");
const closeBtn = document.getElementById("close-btn");


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
  let playlistContainer = document.getElementById("playlist-container");

  playlists.forEach((playlist) => {
    const playlistToDisplay = document.createElement("article");
    playlistToDisplay.className = "playlist-cards";
    playlistToDisplay.id = playlist.playlistID;

    playlistToDisplay.innerHTML = `
      <img src="${playlist.playlist_art}" alt="${playlist.playlist_name}" class="playlist-img" />
      <h2 class="playlist-title">${playlist.playlist_name}</h2>
      <p class="playlist-author">${playlist.playlist_author}</p>
      <div class="playlist-like">
         <span class="material-symbols-outlined">favorite</span> 
         ${playlist.like_count}
      </div>
      `;

    playlistToDisplay.addEventListener("click", function () {
      openModal(playlist.playlistID, playlists);
    });

    playlistContainer.appendChild(playlistToDisplay);
  });

  if (playlists.length == 0) {
    let noPlaylistsMessage = document.createElement("h3");
    noPlaylistsMessage.className = "no-playlists";
    noPlaylistsMessage.textContent = "No playlists added";
    playlistContainer.appendChild(noPlaylistsMessage);
  }
}


function openModal(selectedPlaylistID, playlists) {
  const selectedPlaylist = playlists.find(
    (playlist) => playlist.playlistID === selectedPlaylistID
  );

  const modalPlaylistInfo = document.createElement("section");
  modalPlaylistInfo.className = "modal-img-title-author";

  modalPlaylistInfo.innerHTML = `
   <img class="modal-playlist-image" src="${selectedPlaylist.playlist_art}" alt="${selectedPlaylist.playlist_name}"/>
   <div class="modal-title-author">
      <h2>${selectedPlaylist.playlist_name} </h2>
      <h3>${selectedPlaylist.playlist_author}</h3>
   </div>
  `;

  const modalSongInfo = document.createElement("section");
  modalSongInfo.className = "modal-songs";

  selectedPlaylist.songs.forEach((song) => {
   modalSongInfo.innerHTML += 
   `
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
   `
  })

  const modalContent = document.getElementById('modal-content');
  modalContent.replaceChildren(closeBtn);
  modalContent.appendChild(modalPlaylistInfo);
  modalContent.appendChild(modalSongInfo);

  modal.style.display = "block";
}
