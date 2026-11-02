// DOM Elemek referenciái
const button = document.getElementById('get_user_id');
const button2 = document.getElementById('senduser');
const button3 = document.getElementById('login_teszt');
const logoutBtn = document.getElementById('logout_btn');
const userStatus = document.getElementById('user_id');
const loginInput = document.getElementById('login_teszt_input');
const select = document.getElementById('selects');
const errorDisplay = document.getElementById('error');

// Felület frissítése az autentikációs állapot alapján
const updateAuthUI = (isLoggedIn, userId = null) => {
  if (isLoggedIn) {
    if (userStatus) userStatus.innerText = `Bejelentkezve: ${userId}`;
    if (button3) button3.style.display = 'none';
    if (loginInput) loginInput.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
  } else {
    if (userStatus) userStatus.innerText = '';
    if (button3) button3.style.display = 'inline-block';
    if (loginInput) loginInput.style.display = 'inline-block';
    if (logoutBtn) logoutBtn.style.display = 'none';
  }
};

// Munkamenet ellenőrzése oldalbetöltéskor
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('http://localhost:3000/api/check-session', {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Nincs aktív munkamenet');
    }

    const data = await response.json();

    if (data.loggedIn) {
      updateAuthUI(true, data.userId);
    } else {
      updateAuthUI(false);
    }
  } catch {
    updateAuthUI(false);
  }
});

// Felhasználó lekérése (első gomb)
if (button) {
  button.addEventListener('click', async () => {
    const selectedValue = select ? select.value : '';
    const textElement = document.getElementById('teszttext');
    const textValue = textElement ? textElement.value : '';

    try {
      const response = await fetch('http://localhost:3000/api/getuser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedValue, szoveg: textValue })
      });

      const data = await response.json();
      if (userStatus) {
        userStatus.innerText = `ID: ${data.id} | Név: ${data.name} | Email: ${data.email}`;
      }
    } catch (error) {
      if (errorDisplay) errorDisplay.innerText = 'Hiba: ' + error.message;
    }
  });
}

// Adatmentés (második gomb)
if (button2) {
  button2.addEventListener('click', async () => {
    const textElement = document.getElementById('teszttext');
    const textValue = textElement ? textElement.value : '';

    try {
      const response = await fetch('http://localhost:3000/api/senduser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ szoveg: textValue })
      });

      const data = await response.json();
      if (userStatus) {
        userStatus.innerText = data.message;
      }
    } catch (error) {
      if (errorDisplay) errorDisplay.innerText = 'Hiba: ' + error.message;
    }
  });
}

// Bejelentkezés (harmadik gomb)
if (button3) {
  button3.addEventListener('click', async () => {
    // Ha az inputba írt azonosítóval lépsz be, vagy a legördülőből választottal:
    const selectedId = (loginInput && loginInput.value.trim()) || (select ? select.value : '');

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: selectedId })
      });

      if (!response.ok) {
        throw new Error(`HTTP hiba: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        updateAuthUI(true, data.userId || selectedId);
      }
    } catch (error) {
      if (errorDisplay) errorDisplay.innerText = 'Hiba: ' + error.message;
    }
  });
}

// Kijelentkezés
if (logoutBtn) {
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
      if (errorDisplay) errorDisplay.innerText = 'Hiba a kijelentkezéskor: ' + error.message;
    }
  });
}