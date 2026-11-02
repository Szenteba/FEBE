import { response } from "express";
import { log } from "node:console";

window.onload = function() { console.log("Az oldal betöltődött"); };

// Megvárja az oldal betöltődését
window.onload = function() { console.log("Az oldal betöltődött"); };

//Betöltéskori figyelés
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('http://localhost:3000/api/check-session', {
      method: 'GET',
      credentials: 'include' // Elküldi a mentett HttpOnly cookie-t a kéréssel
    });

    if (!response.ok) {
      throw new Error('Nincs bejelentkezve');
    }

    const data = await response.json();

    if (data.loggedIn) {
      // Be van jelentkezve: UI frissítése
      document.getElementById('user_id').innerText = `Bejelentkezve: ${data.userId}`;
      button3.style.display = 'none';
      document.getElementById('login_teszt_input').style.display = 'none';
      logoutBtn.style.display = 'inline-block';
    }
  } catch (error) {
    // Nincs érvényes session: bejelentkezési elemek megjelenítése
    button3.style.display = 'inline-block';
  }
});

const button = document.getElementById('get_user_id'); // Referencia a lekérdező gombra
const button2 = document.getElementById('senduser'); // Referencia a küldő gombra
const button3 = document.getElementById('login_teszt');
const logoutBtn = document.getElementById('logout_btn');
const userStatus = document.getElementById('user_id');
const loginInput = document.getElementById('login_teszt_input');
const select = document.getElementById('selects');

// Első gomb eseménykezelője (Felhasználó lekérés)
button.addEventListener('click', () => { 
    const selectedValue = document.getElementById("selects").value; // Érték a dropdownból
    const textValue = document.getElementById("teszttext").value; // Érték az inputból

    // POST kérés küldése a backendnek
    fetch('http://localhost:3000/api/getuser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedValue, szoveg: textValue }) // Adatok JSON-ná alakítása
    })
    .then(response => response.json()) // JSON válasz konvertálása
    .then(data => {
        // Megjelenítés az oldalon
        document.getElementById('user_id').innerText = `ID: ${data.id} | Név: ${data.name} | Email: ${data.email}`;
    })
    .catch(error => { document.getElementById('error').innerText = "Hiba: " + error.message; });
});

// Második gomb eseménykezelője (Adatmentés)
button2.addEventListener('click', () => { 
    const textValue = document.getElementById("teszttext").value;

    fetch('http://localhost:3000/api/senduser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ szoveg: textValue })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("user_id").innerText = data.message; // Visszaigazolás kiírása
    })  
    .catch(error => { document.getElementById('error').innerText = "Hiba: " + error.message; });
});

button3.addEventListener('click', () => {
  const idvalue = document.getElementById('login_teszt_input').value;

  fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // <--- EZ HIÁNYZIK A LOGIN KÉRÉSBŐL!
    body: JSON.stringify({ nev: 'Teszt Elek', email: 'teszt@testmail.com', id: select.value })
  })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP hiba: ${response.status}`);
      return response.json();
    })
    .then(data => {
      document.getElementById('user_id').innerText = data.message;
      if (data.success) {
        button3.style.display = 'none';
      }
    })
    .catch(error => {
      document.getElementById('error').innerText = 'Hiba: ' + error.message;
    });
});

// Kijelentkezés gomb eseménykezelője
logoutBtn.addEventListener('click', async () => {
  try {
    const response = await fetch('http://localhost:3000/api/logout', {
      method: 'POST',
      credentials: 'include'
    });

    const data = await response.json();

    if (data.success) {
      updateAuthUI(false);
    }
  } catch (error) {
    document.getElementById('error').innerText = 'Hiba a kijelentkezéskor: ' + error.message;
  }
});
// Felület frissítése a bejelentkezési állapot alapján
const updateAuthUI = (isLoggedIn, userId = null) => {
  if (isLoggedIn) {
    userStatus.innerText = `Bejelentkezve: ${userId}`;
    button3.style.display = 'none';
    loginInput.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
  } else {
    userStatus.innerText = '';
    button3.style.display = 'inline-block';
    loginInput.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
  }
};


/*


const lekérGomb = document.getElementById('get_All_User');
const tabla = document.getElementById('tablazat');



lekérGomb.addEventListener('click', async () => {
  console.log("Raszista");
  
  tabla.innerHTML += '<ul>Elek"</ul>';
  /*try {
    
    const response = await fetch('http://localhost:3000/api/getalluser', {
      method: 'GET',
      credentials: 'include'
    })
    .then(response => {
      const user = response.stringify(json());
      tabla.innerHTML += '<ul>'+user+'</ul>';
    })
  } catch (error) {
    
  }*/
//});