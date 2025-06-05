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
  playlists.forEach((playlist) => {
    let playlistContainer = document.getElementById("playlist-container");
    let playlistToDisplay = document.createElement("article");
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
      openModal(playlist.playlistID);
    });

    playlistContainer.appendChild(playlistToDisplay);
  });
}

function openModal(playlistID) {
   console.log(playlistID);
  // const foundPlaylist = ... use id
  //   document.getElementById("festivalName").innerText = festival.name;
  //   document.getElementById("festivalImage").src = festival.imageUrl;
  //   document.getElementById(
  //     "festivalDates"
  //   ).innerText = `Dates: ${festival.dates}`;
  //   document.getElementById(
  //     "festivalLocation"
  //   ).innerText = `Location: ${festival.location}`;
  //   document.getElementById(
  //     "artistLineup"
  //   ).innerHTML = `<strong>Lineup:</strong> ${festival.lineup.join(", ")}`;
  modal.style.display = "block";
}
