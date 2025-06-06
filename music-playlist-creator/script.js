// JavaScript for Opening and Closing the Modal
const modal = document.getElementById("playlist-modal");
const closeBtn = document.getElementById("close-btn");
let allPlaylists;
let allPlaylistsDateAdded;
let allPlaylistsAlphabetical;
let allPlaylistsLikes;
let textBoxIDCount = 0;
let playlistSortingMethod = "date";

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
      console.log(allPlaylists)
      updatePlaylists(allPlaylists);
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

    const addPlaylistBtn = document.getElementById("add-playlist-btn");
    addPlaylistBtn.addEventListener("click", function () {
      addPlaylistBtn.blur();
      openPlaylistForm("Add", null);
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
   const playlists = playlistSortingMethod === "date"
      ? allPlaylistsDateAdded
      : playlistSortingMethod === "alphabetical"
      ? allPlaylistsAlphabetical
      : allPlaylistsLikes;
  const playlistContainer = document.getElementById("playlist-container");
  playlistContainer.innerHTML = "";

  playlists.forEach((playlist) => {
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
         <span class="edit-playlist material-symbols-outlined" onclick="openPlaylistForm('Edit', '${playlist.playlistID}')">edit</span>
         <span class="delete-playlist material-symbols-outlined" onclick="deletePlaylist('${playlist.playlistID}')">delete</span>
      </div>
      `;

    playlistToDisplay.addEventListener("click", function (event) {
      if (!event.target.className.includes("material-symbols-outlined")) {
        openModal(playlist.playlistID);
      }
    });

    playlistContainer.appendChild(playlistToDisplay);
  });

  if (playlists.length == 0) {
    let noPlaylistsMessage = document.createElement("h3");
    noPlaylistsMessage.className = "no-playlists";
    noPlaylistsMessage.textContent = "No playlists added - add one!";
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
  updatePlaylists(allPlaylists);
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

function openPlaylistForm(addOrEdit, playlistID) {
  const playlist = allPlaylists.find(
    (playlist) => playlist.playlistID === playlistID
  );
  const modalContent = document.getElementById("modal-content");
  modalContent.replaceChildren(closeBtn);
  const form = createForm(playlist, addOrEdit);
  modalContent.appendChild(form);
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    addEditPlaylist(addOrEdit, playlist);
  });

  modal.style.display = "block";
}

function createForm(playlistData, addOrEdit) {
  const playlistName = playlistData ? playlistData.playlist_name : "";
  const playlistImage = playlistData ? playlistData.playlist_art : "";
  const playlistAuthor = playlistData ? playlistData.playlist_author : "";

  const form = document.createElement("form");
  form.id = "addEditForm";
  form.innerHTML = `
   <h2>${addOrEdit} Playlist</h2>
   <section class="form-playlist">
      <label for="playlist-name">Playlist Name:</label>
      <input
         type="text"
         required
         id="playlist-name"
         class="form-text-input"
         name="playlist_name"
         value="${playlistName}"
      />
      <label for="playlist-cover-image">Playlist Cover Image:</label>
      <input
         type="file"
         accept="image/*"
         id="playlist-cover-image"
         class="form-file-input"
         name="playlist_cover_image"
         value="${playlistImage}"
      />
      <label for="playlist-author">Playlist Author:</label>
      <input
         type="text"
         required
         id="playlist-author"
         class="form-text-input"
         name="playlist_author"
         value="${playlistAuthor}"
      />
   </section>
   <div class="divider"></div>
   <section id="form-songs"></section>
   <input type="submit" class="form-submit" value="Submit" />
   `;

  const songsSection = form.querySelector("#form-songs");

  songsSection.innerHTML += `
       <h4><span id="add-song-btn" onclick="addSong()" class="add-song-btn">+ Add Song</span></h4>
      `;

  if (playlistData && playlistData.songs.length > 0 && addOrEdit === "Edit") {
    playlistData.songs.forEach((song) => {
      songsSection.innerHTML += `
      <article id='form-song-${textBoxIDCount}' class="form-song">
         <label for="song-name-${textBoxIDCount}">Song Name:</label>
         <input
            type="text"
            required
            id="song-name-${textBoxIDCount}"
            class="form-song-input"
            name="song_name"
            value="${song.name}"
         />
         <label for="song-artist-${textBoxIDCount}">Song Artist:</label>
         <input
            type="text"
            required
            id="song-artist-${textBoxIDCount}"
            class="form-song-input"
            name="song_artist"
            value="${song.artist}"
         />
         <label for="song-duration-${textBoxIDCount}">Song Duration:</label>
         <input
            type="text"
            required
            id="song-duration-${textBoxIDCount}"
            class="form-song-input"
            name="song_duration"
            value="${song.duration}"
         />
         <span onclick="deleteSong(${textBoxIDCount})" class="form-delete-song">&times;</span>
      </article>
      `;
      textBoxIDCount++;
    });
  }

  return form;
}

function addSong() {
  const songsSection = document.getElementById("form-songs");
  const newSong = document.createElement("article");
  newSong.id = `form-song-${textBoxIDCount}`;
  newSong.className = "form-song";
  newSong.innerHTML = `
      <label for="song-name-${textBoxIDCount}">Song Name:</label>
      <input
         type="text"
         required
         id="song-name-${textBoxIDCount}"
         class="form-song-input"
         name="song_name"
      />
      <label for="song-artist-${textBoxIDCount}">Song Artist:</label>
      <input
         type="text"
         required
         id="song-artist-${textBoxIDCount}"
         class="form-song-input"
         name="song_artist"
      />
      <label for="song-duration-${textBoxIDCount}">Song Duration:</label>
      <input
         type="text"
         required
         id="song-duration-${textBoxIDCount}"
         class="form-song-input"
         name="song_duration"
      />
      <span onclick="deleteSong(${textBoxIDCount})" class="form-delete-song">&times;</span>
   `;
  songsSection.appendChild(newSong);

  textBoxIDCount++;
}

function deleteSong(songID) {
  const songsSection = document.getElementById("form-songs");
  const songToDelete = document.getElementById(`form-song-${songID}`);
  songsSection.removeChild(songToDelete);
}

function addEditPlaylist(addOrEdit, currentPlaylist) {
  const form = document.getElementById("addEditForm");
  const formData = new FormData(form);
  const fallbackCoverImage =
    addOrEdit === "Add"
      ? "assets/img/playlist.png"
      : currentPlaylist.playlist_art;

  const imageInput = document.getElementById("playlist-cover-image");
  const newCoverImage =
    imageInput.files.length === 0
      ? null
      : URL.createObjectURL(formData.get("playlist_cover_image"));

  const newPlaylist = {
    playlistID: formData
      .get("playlist_name")
      .replaceAll(" ", "-")
      .toLowerCase(),
    playlist_name: formData.get("playlist_name"),
    playlist_author: formData.get("playlist_author"),
    playlist_art: newCoverImage ? newCoverImage : fallbackCoverImage,
    like_count: addOrEdit === "Add" ? 0 : currentPlaylist.like_count,
    songs: [],
  };

  const allSongNames = formData.getAll("song_name");
  const allSongAuthors = formData.getAll("song_artist");
  const allSongDurations = formData.getAll("song_duration");

  allSongNames.forEach((song_name, index) => {
    newPlaylist.songs.push({
      name: song_name,
      artist: allSongAuthors[index],
      duration: allSongDurations[index],
      song_art: "assets/img/song.png",
    });
  });

  if (addOrEdit === "Add") {
    allPlaylists.push(newPlaylist);
  } else {
    allPlaylists.forEach((playlist, index) => {
      if (playlist.playlistID === currentPlaylist.playlistID)
        allPlaylists[index] = newPlaylist;
    });
  }

  updatePlaylists(allPlaylists);

  displayPlaylists();
  modal.style.display = "none";
}

function deletePlaylist(playlistID) {
  allPlaylists = allPlaylists.filter(
    (playlist) => playlist.playlistID !== playlistID
  );
  updatePlaylists(allPlaylists);
  displayPlaylists();
}

function updatePlaylists(newPlaylists) {
  allPlaylistsDateAdded = newPlaylists.toReversed();
  allPlaylistsAlphabetical = newPlaylists.toSorted((playlistA, playlistB) => playlistA.playlist_name.localeCompare(playlistB.playlist_name));
  allPlaylistsLikes = newPlaylists.toSorted((playlistA, playlistB) => playlistB.like_count - playlistA.like_count);
  console.log(allPlaylists, allPlaylistsDateAdded, allPlaylistsAlphabetical, allPlaylistsLikes)
}
