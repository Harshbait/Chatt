const socket = io(); // Automatically connects to the current domain

const form = document.getElementById('send-con')
const mess = document.getElementById('messwInp')
const messCon = document.querySelector('.contaioner')
let audio = new Audio('bubble.mp3');

//Images
const formImg = document.querySelector(".formImg")
// const Img = document.querySelector('#imgInp')

form.addEventListener('submit', (e) => {
  e.preventDefault();  //This help to donot restart the paege
  const message = mess.value;
  append(`You: ${message}`, 'right')
  socket.emit('send', message)
  mess.value = '' 
  
})

formImg.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent form refresh
  const img = document.getElementById("imgInp");
  const file = img.files[0];

  if (file) {
    const reader = new FileReader(); // Create FileReader object
    reader.onload = function(event) {
      console.log("Image is selected");
      const Image = event.target.result; // Convert image to Base64
      appendImage(Image, 'right');
      socket.emit("sendImage", Image); // Send image to server
    };
    reader.readAsDataURL(file); // Start reading file
  } else {
    console.log("⚠️ No file selected!"); // If file is null
  }
});

socket.on("receiveImage", (data) => {
    appendImage(data.Image, 'left', data.name); // Now passing sender's name
});


const appendImage = (imageSrc, position, senderName = 'You') => {
    const imgElem = document.createElement("img");
    imgElem.src = imageSrc;
    imgElem.style.height = "200px";

    const messElem = document.createElement("div");
    messElem.classList.add("messw", position);
    
    // Add sender name
    const nameElem = document.createElement("p");
    nameElem.innerText = `${senderName}:`;
    nameElem.style.fontWeight = "bold";
    nameElem.style.marginBottom = "5px";

    messElem.appendChild(nameElem); // Add sender's name before the image
    messElem.appendChild(imgElem);
  
    messCon.appendChild(messElem);
    if(position === 'left') {
        audio.play();
    }
};

const append = (Message, position) => {
    const messElem = document.createElement('div')
    messElem.innerText = Message
    messElem.classList.add('messw')
    messElem.classList.add(position)
    messCon.append(messElem);
    if(position === 'left') {
        audio.play()
    }
}

const name = prompt('Enter joiner name')
socket.emit('new-user-joined', name)


socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
});

socket.on('recive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

socket.on('leave', name=>{
    append(`${name} left the chat`,'left')
})