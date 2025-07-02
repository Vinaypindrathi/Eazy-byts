// demo events
const demoEvents = [
  { id: 1, title: "Music Concert", date: "2025-07-20", price: 50 },
  { id: 2, title: "Tech Conference", date: "2025-08-15", price: 100 },
  { id: 3, title: "Art Workshop", date: "2025-09-05", price: 30 }
];

// protect pages
if (window.location.pathname.includes("events.html") || window.location.pathname.includes("dashboard.html")) {
  if (localStorage.getItem("loggedIn") !== "true") {
    alert("Please login to continue.");
    window.location.href = "login.html";
  }
}

// render events on events.html
if (document.getElementById("events")) {
  const eventsDiv = document.getElementById("events");
  demoEvents.forEach(event => {
    const div = document.createElement("div");
    div.className = "event-card";
    div.innerHTML = `
      <h3>${event.title}</h3>
      <p>Date: ${event.date}</p>
      <p>Price: $${event.price}</p>
      <button onclick="openBookingForm(${event.id})">Book</button>
    `;
    eventsDiv.appendChild(div);
  });
}

// open booking with attendee details
function openBookingForm(eventId) {
  const event = demoEvents.find(e => e.id === eventId);
  const user = JSON.parse(localStorage.getItem("user"));
  const name = user?.name || "";

  document.body.innerHTML = `
    <div class="form" style="background:#fff; padding:20px; border-radius:6px; max-width:600px; margin:auto;">
      <h2>Booking: ${event.title}</h2>
      <form id="bookingForm" onsubmit="confirmBooking(event, ${eventId})">
        <input type="text" id="bookingName" value="${name}" placeholder="Your Name" required/>
        <input type="number" id="ticketQty" placeholder="Number of tickets" required min="1" onchange="generateAttendeeFields(this.value)"/>
        <div id="attendeeFields"></div>
        <button type="submit">Confirm Booking</button>
      </form>
      <button onclick="window.location.href='events.html'" style="margin-top:10px;">Cancel</button>
    </div>
  `;
}

// generate dynamic attendee fields
function generateAttendeeFields(quantity) {
  const container = document.getElementById("attendeeFields");
  container.innerHTML = "";
  for (let i = 1; i <= quantity; i++) {
    container.innerHTML += `
      <h4>Attendee ${i}</h4>
      <input type="text" name="attendeeName${i}" placeholder="Attendee Name" required />
      <input type="email" name="attendeeEmail${i}" placeholder="Attendee Email" required />
      <input type="tel" name="attendeePhone${i}" placeholder="Attendee Phone" required />
    `;
  }
}

// confirm booking
function confirmBooking(e, eventId) {
  e.preventDefault();
  const name = document.getElementById("bookingName").value;
  const qty = document.getElementById("ticketQty").value;
  const event = demoEvents.find(e => e.id === eventId);

  const attendees = [];
  for (let i = 1; i <= qty; i++) {
    const attendeeName = document.querySelector(`[name="attendeeName${i}"]`).value;
    const attendeeEmail = document.querySelector(`[name="attendeeEmail${i}"]`).value;
    const attendeePhone = document.querySelector(`[name="attendeePhone${i}"]`).value;
    attendees.push({ attendeeName, attendeeEmail, attendeePhone });
  }

  const booking = {
    eventId,
    eventTitle: event.title,
    name,
    qty,
    total: event.price * qty,
    attendees
  };

  let bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
  bookings.push(booking);
  localStorage.setItem("bookings", JSON.stringify(bookings));

  alert(`Booking confirmed for ${qty} ticket(s) to ${event.title}!`);
  window.location.href = "dashboard.html";
}

// show success message on dashboard
if (document.getElementById("bookingList")) {
  const list = document.getElementById("bookingList");
  list.innerHTML = `
    <li>
      <strong>Booking successful!</strong> Thank you for booking. You can now
      <a href="#" onclick="logout()">Logout</a>.
    </li>
  `;
}

// register
function registerUser(e) {
  e.preventDefault();
  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  localStorage.setItem("user", JSON.stringify({ name, email, password }));
  alert("Registration successful!");
  window.location.href = "login.html";
}

// login
function loginUser(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (storedUser && storedUser.email === email && storedUser.password === password) {
    localStorage.setItem("loggedIn", "true");
    alert(`Welcome, ${storedUser.name}!`);
    window.location.href = "events.html";
  } else {
    alert("Invalid credentials.");
  }
}

// logout
function logout() {
  localStorage.removeItem("loggedIn");
  alert("You have been logged out.");
  window.location.href = "login.html";
}
