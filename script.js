
/* ================== УПРОЩЁННЫЙ АВТОРИЗАТОР ==================
   - Убраны готовые логины/пароли
   - Убрана работа с паролем (остается только поле логина, если в HTML есть)
   - Валидация логина: ровно 10 цифр, первые 3 цифры >= 138
   - Сохранил механизм сессии (TTL, версия)
   - Опциональный список BLOCKED оставлен для блокировок по имени
*/

const BLOCKED       = [];             // список заблокированных логинов (оставил пустым)
const AUTH_VERSION  = "1";
const AUTH_TTL_MS   = 10 * 60 * 1000; // 10 минут
const SESSION_KEY   = "cr2_auth";

function setAuthed(v, user){
  try {
    if (v) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        u: user, t: Date.now(), v: AUTH_VERSION
      }));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  } catch(e){}
}
function readSession(){
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch(e){ return null; }
}
function isAuthedFresh(){
  const s = readSession();
  if (!s) return false;
  if (BLOCKED.includes(s.u)) return false;
  if (s.v !== AUTH_VERSION) return false;
  if (Date.now() - s.t > AUTH_TTL_MS) return false;
  return true;
}

function showGate() {
  const g = document.getElementById("gate");
  const a = document.getElementById("app");
  if (g) g.classList.add("active");
  if (a) a.classList.remove("active");
}

function showApp() {
  const g = document.getElementById("gate");
  const a = document.getElementById("app");
  if (a) a.classList.add("active");
  if (g) g.classList.remove("active");
}

window.addEventListener("DOMContentLoaded", () => {
  if (isAuthedFresh()) showApp(); else showGate();
});

// ====== GATE ======
const form       = document.getElementById("gate-form");
const loginInput = document.getElementById("login");
const errBox     = document.getElementById("gate-error");

// Валидация логина: ровно 10 цифр и первые 3 цифры (как число) >= 138
function validateLogin(login){
  if (!login) return false;
  // только цифры
  if (!/^\d{10}$/.test(login)) return false;
  const prefix = parseInt(login.slice(0,3), 10);
  if (Number.isNaN(prefix)) return false;
  if (prefix < 138) return false; // "начинаются на 138 и выше"
  return true;
}

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const login = (loginInput.value || "").trim();

    const ok = validateLogin(login);

    if (!ok) {
      if (errBox) {
        errBox.textContent = "Invalid login — must be 10 digits, starting with 138 or higher";
        errBox.hidden = false;
        setTimeout(() => { if (errBox) errBox.hidden = true; }, 2000);
      }
      return;
    }

    if (BLOCKED.includes(login)) {
      if (errBox) {
        errBox.textContent = "Access denied";
        errBox.hidden = false;
        setTimeout(() => { if (errBox) { errBox.hidden = true; errBox.textContent = ""; } }, 2000);
      }
      return;
    }

    setAuthed(true, login);
    showApp();
  });
}

// Утилита: выход из сессии
function logout(){
  setAuthed(false);
  showGate();
}

// Экспортим для использования в консоли/HTML (опционально)
window.authUtils = { validateLogin, logout, isAuthedFresh };

  
  if (getDataBtn) {
    getDataBtn.addEventListener("click", (e) => {
      
    });
  }

  // ====== ИГРА ======
  const modes = {
    easy: [
     "6-4.jpg",
     "6-6.jpg",
     "6-7.jpg",
     "6-8.jpg",
     "6-9.jpg"
    ],
    medium: [
     "9.png"
    ],
  hard: [
     "6.png",
     "9.png",
     "6-5.jpg",
     "6-3.jpg"
    ],
  hardcore: [
     "280.png",
     "163.png",
     "245.png",
     "222.png",
     "306.png"
  ]
  };

  let currentMode = 'easy';
  document.querySelectorAll('.mode').forEach(b=>{
    b.addEventListener('click', ()=>{
      document.querySelectorAll('.mode').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      currentMode = b.dataset.mode;
    });
  });

  const chicken = document.getElementById('chicken');
  const btnJump = document.getElementById('btn-jump');
  const modal   = document.getElementById('modal');
  const xVal    = document.getElementById('xval');
  const btnNext = document.getElementById('btn-next');

  btnJump?.addEventListener('click', () => {
  
  chicken.style.transform = 'translate(-50%,-44px) scale(0.5)';

  setTimeout(() => {
    
    chicken.style.transform = 'translate(-50%,0) scale(0.5)';

    
    const arr = modes[currentMode] || modes.easy;
    const x = arr[Math.floor(Math.random() * arr.length)];
    xVal.innerHTML = `<img src="${x}" alt="result" class="result-img">`;

    
    modal.classList.remove('hidden');
  }, 600);
});

btnNext?.addEventListener('click', () => {
  modal.classList.add('hidden');
});
  

const btnPlay = document.getElementById("btn-play");
const modesMenu = document.getElementById("modes-menu");

btnPlay.addEventListener("click", () => {
  modesMenu.classList.toggle("hidden"); 
});
