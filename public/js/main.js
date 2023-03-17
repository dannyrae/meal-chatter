const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chatbox')
const close = document.querySelector('.chatbox__container .close')
const icon = document.querySelector('.chat-icon')
const modal = document.querySelector('.chatbox__container')

const deviceId = 'web-' + Math.random().toString(36).substring(2, 15)
const storedMessages = JSON.parse(localStorage.getItem('chat-messages')) || []


// Connect to Socket.io
const socket = io({ withCredentials: true })

// Listening to message from server
socket.on('bot', (message) => {
  setTimeout(() => {
    outputMessage(message, 'Support-Bot')
  }, "1000")
})


chatForm.addEventListener('submit', (e) => {
  e.preventDefault()

  let msg = e.target.elements.msg.value
  msg = msg.trim()

  if (!msg) {
    return false
  }

  outputMessage(msg, 'You')
  socket.emit('customer', msg)

  // chatMessages.scrollTop = chatMessages.scrollHeight

  // Clear input
  e.target.elements.msg.value = ''
  e.target.elements.msg.focus()
})

// Output message to DOM
function outputMessage(message, sender) {
  let currDate = new Date()
  let hr = currDate.getHours()
  let hours = (hr % 12) || 12
  if (hours < 10 && hours > 00) {
    hours = "0"+ hours
  } 
  let AMPM = currDate.getHours() >= 12 ? 'pm' : 'am' 

  const div = document.createElement('div')
  div.classList.add('message')
  const p = document.createElement('p')
  p.classList.add('meta')
  p.innerText = sender
  const span = document.createElement('span')
  span.innerHTML = `${hours}:${currDate.getMinutes()} ${AMPM}`
  p.appendChild(span)
  div.appendChild(p)
  const para = document.createElement('p')
  para.classList.add('text')
  para.innerText = message
  div.appendChild(para)
  chatMessages.appendChild(div)

  chatMessages.scrollTop = chatMessages.scrollHeight
}

close.addEventListener('click', () => {
  modal.style.display = 'none'
})

icon.addEventListener('click', () => {
  modal.style.display = 'initial'
  msg.focus()
})


