const { chatbotId, target } = window.ChatbotConfig;

// Create the open button element
const openButton = document.createElement("button");
openButton.className = "open-button";
openButton.id = "openButton";
openButton.innerHTML = `
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.9707 19.3646L20.1483 16.8977C20.1014 16.7569 20.1167 16.6056 20.1846 16.4738C20.8026 15.2731 21.0579 13.8554 20.7905 12.3611C20.3805 10.0704 18.7032 8.167 16.5276 7.43701C17.0889 8.79282 17.2601 10.3003 16.9797 11.7956C16.4099 14.8349 13.9762 17.2447 10.9238 17.7921C10.5287 17.8629 10.1295 17.8974 9.7334 17.9075C10.6604 18.9077 11.8978 19.6186 13.278 19.8662C14.7631 20.1325 16.1742 19.8846 17.3713 19.2758C17.5026 19.209 17.6528 19.1942 17.7927 19.2407L20.2691 20.0662C20.7027 20.2108 21.1153 19.7983 20.9707 19.3646Z" fill="white"/>
    <path d="M8.3044 4.01921C5.73199 4.49719 3.67057 6.58711 3.2096 9.16261C2.94223 10.6569 3.19746 12.0745 3.81546 13.2752C3.88338 13.4071 3.89867 13.5584 3.85184 13.6991L3.02942 16.1661C2.8849 16.5998 3.2974 17.0123 3.73104 16.8677L6.20745 16.0423C6.34732 15.9957 6.4976 16.0105 6.6289 16.0773C7.82595 16.6861 9.23693 16.934 10.7221 16.6677C13.2912 16.2069 15.3759 14.1506 15.8568 11.5851C16.7042 7.06571 12.8224 3.17968 8.3044 4.01921ZM9.94212 12.3412H6.74365C6.42818 12.3412 6.17248 12.0855 6.17248 11.77C6.17248 11.4546 6.42818 11.1989 6.74365 11.1989H9.94212C10.2576 11.1989 10.5133 11.4546 10.5133 11.77C10.5133 12.0855 10.2576 12.3412 9.94212 12.3412ZM12.2268 10.0566H6.7436C6.42813 10.0566 6.17243 9.80091 6.17243 9.48539C6.17243 9.16993 6.42813 8.91422 6.7436 8.91422H12.2267C12.5422 8.91422 12.7979 9.16993 12.7979 9.48539C12.7979 9.80091 12.5423 10.0566 12.2268 10.0566Z" fill="white"/>
  </svg>
`;

// Create the close button element
const closeButton = document.createElement("button");
closeButton.type = "button";
closeButton.onclick = handleClose;
closeButton.id = "closeButton";
closeButton.className = "close-button";
closeButton.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10" stroke-width="0" />
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
`;

// Create the chat popup element
const chatPopup = document.createElement("div");
chatPopup.className = "chat-popup";
chatPopup.id = "chatId";
chatPopup.style.display = "none";
chatPopup.innerHTML = `
  <iframe style="border-width: 0px" src="http://localhost:3000/bot-iframe/${chatbotId}" width="100%" height="100%"></iframe>
`;

var style = document.createElement("style");
style.textContent = `
body {font-family: Arial, Helvetica, sans-serif;}
* {box-sizing: border-box;}

.open-button {
    background-color: #000;
    color: white;
    padding: 16px 9px;
    border: none;
    cursor: pointer;
    position: fixed;
    bottom: 23px;
    right: 20px;
    width: 60px;
    border-radius: 30px;
  }

  .close-button {
    display: none;
    background-color: #000;
    color: white;
    padding: 16px 9px;
    border: none;
    cursor: pointer;
    position: fixed;
    bottom: 23px;
    right: 20px;
    width: 60px;
    border-radius: 30px;
  }

  /* The popup chat - hidden by default */
  .chat-popup {
    display: none;
    position: fixed;
    bottom: 88px;
    right: 20px;
    z-index: 9;
    width: 448px;
    height: 75vh;
  }
`;

document.head.appendChild(style);
// Add event listeners to buttons
openButton.addEventListener("click", handleOpen);
closeButton.addEventListener("click", handleClose);

// Append elements to the document
document.body.appendChild(openButton);
document.body.appendChild(closeButton);
document.body.appendChild(chatPopup);

// Function to handle the open button click
function handleOpen() {
  document.getElementById("chatId").style.display = "block";
  document.getElementById("closeButton").style.display = "block";
  document.getElementById("openButton").style.display = "none";
}

// Function to handle the close button click
function handleClose() {
  document.getElementById("chatId").style.display = "none";
  document.getElementById("closeButton").style.display = "none";
  document.getElementById("openButton").style.display = "block";
}

// Fetch and update button color from API
window.onload = function () {
  fetch(`${target}/api/v1/bot/${chatbotId}/publish-details`)
    .then((response) => response.json())
    .then((data) => {
      const { chatBubbleColor } = data;
      openButton.style.backgroundColor = chatBubbleColor;
      closeButton.style.backgroundColor = chatBubbleColor;
    })
    .catch((error) => {});
};
