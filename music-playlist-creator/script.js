// JavaScript for Opening and Closing the Modal
const selectedPlaylist = document.getElementsByClassName("playlist-cards")[0];
const modal = document.getElementById("playlist-modal");
const closeBtn = document.getElementById("close-btn");

document.addEventListener("DOMContentLoaded", function () {
   // dynamic display logic here
});

closeBtn.addEventListener("click", function () {
  modal.style.display = "none";
});

window.addEventListener("click", function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});

function openModal(playlistTitle) {
  // const foundPlaylist = ...
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
