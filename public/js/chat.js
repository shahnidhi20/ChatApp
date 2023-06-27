//Client was able to connect to the socket server
const socket = io();

// socket.on("countUpdated", (count) => {
//   console.log("Count has been updated", count);
// }); // handle countUpdated event raised from server

// document.querySelector("#increment").addEventListener("click", () => {
//   console.log("Increment has been clicked");
//   socket.emit("countincrement"); //raise event to the server
// });

// server (emit) --> client (receive) --> ack --> server
// client (emit) --> server (receive) --> ack --> client

//#region Elements

const $messageForm = document.querySelector("#message-form");
const $messageFromInput = $messageForm.querySelector("input");
const $messageFormSubmit = $messageForm.querySelector("button");
const $sendGeoLocationbtn = document.querySelector("#btnSendLocation");

//#endregion

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //disable submitt button
  $messageFormSubmit.setAttribute("disabled", "disabled");

  //e.form.controls.name
  var textMessage = e.target.elements.message.value;
  socket.emit("sendMessage", textMessage, (error) => {
    $messageFormSubmit.removeAttribute("disabled");
    $messageFromInput.value = "";
    $messageFromInput.focus();

    if (error) {
      return console.log(error);
    }

    console.log("Message delivered");
  });
});

//client recieved a message from message event and prints it in the console
socket.on("message", (msg) => {
  console.log("Message received from server: ", msg);
});

$sendGeoLocationbtn.addEventListener("click", () => {
  //get the location from geolocation api
  if (!navigator.geolocation) {
    return alert("Geolocation not available");
  }

  $sendGeoLocationbtn.setAttribute("disabled", "disabled");
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        //enable geo location button
        $sendGeoLocationbtn.removeAttribute("disabled");
        console.log("Location shared");
      }
    );
  });
});
