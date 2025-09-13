/************* НАСТРОЙКИ *************/
const ALLOWED = [
  { login: "admin", pass: "Polkopejkin05!" },
  { login: "vip", pass: "7777" },
  { login: "guest101", pass: "x4P9tL" },
  { login: "guest102", pass: "s8K2rM" },
  { login: "guest103", pass: "q3B7fV" },
  { login: "guest104", pass: "a6M9zQ" },
  { login: "guest105", pass: "h2T5pW" },
  { login: "guest106", pass: "j7U4mE" },
  { login: "guest107", pass: "v9X1sA" },
  { login: "guest108", pass: "p4N8cY" },
  { login: "guest109", pass: "t3L6kH" },
  { login: "guest110", pass: "m8Z5gR" },
  { login: "guest111", pass: "y1D7qL" },
  { login: "guest112", pass: "n2H9wB" },
  { login: "guest113", pass: "u6S4vJ" },
  { login: "guest114", pass: "k5P8xF" },
  { login: "guest116", pass: "e4Q9tM" },
  { login: "guest116", pass: "r7B3yZ" },
  { login: "guest117", pass: "o9C2gV" },
  { login: "guest118", pass: "z6M8pT" },
  { login: "guest119", pass: "l1K7jC" },
  { login: "guest120", pass: "f3W5nH" },
]
const BLOCKED = ["baduser"]
const AUTH_VERSION = "1"
const AUTH_TTL_MS = 10 * 60 * 1000
const SESSION_KEY = "cr2_auth"
/*************************************/

function setAuthed(v, user) {
  try {
    if (v) {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          u: user,
          t: Date.now(),
          v: AUTH_VERSION,
        }),
      )
    } else {
      localStorage.removeItem(SESSION_KEY)
    }
  } catch (e) {}
}
function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (e) {
    return null
  }
}
function isAuthedFresh() {
  const s = readSession()
  if (!s) return false
  if (BLOCKED.includes(s.u)) return false
  if (s.v !== AUTH_VERSION) return false
  if (Date.now() - s.t > AUTH_TTL_MS) return false
  return true
}

function showGate() {
  document.getElementById("gate").classList.add("active")
  document.getElementById("app").classList.remove("active")
}

function showApp() {
  document.getElementById("app").classList.add("active")
  document.getElementById("gate").classList.remove("active")
}

function showLoading() {
  document.getElementById("loading-screen").classList.remove("hidden")
}

function hideLoading() {
  document.getElementById("loading-screen").classList.add("hidden")
}

window.addEventListener("DOMContentLoaded", () => {
  if (isAuthedFresh()) showApp()
  else showGate()
})

// ====== GATE (EN) ======
const form = document.getElementById("gate-form")
const loginInput = document.getElementById("login")
const passInput = document.getElementById("password")
const errBox = document.getElementById("gate-error")
const getDataBtn = document.getElementById("get-data")

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault()
    const login = (loginInput.value || "").trim()
    const pass = passInput.value || ""
    const ok = ALLOWED.some((u) => u.login === login && u.pass === pass)

    if (!ok) {
      errBox.hidden = false
      setTimeout(() => (errBox.hidden = true), 2000)
      return
    }
    if (BLOCKED.includes(login)) {
      errBox.textContent = "Access denied"
      errBox.hidden = false
      setTimeout(() => {
        errBox.hidden = true
        errBox.textContent = "Invalid login or password"
      }, 2000)
      return
    }

    setAuthed(true, login)
    showApp()
  })
}

if (getDataBtn) {
  getDataBtn.addEventListener("click", (e) => {})
}

// ====== ИГРА ======
const modes = {
  easy: ["280.png", "163.png", "245.png", "222.png", "306.png"],
  medium: ["280.png", "163.png", "245.png", "222.png", "306.png"],
  hard: ["280.png", "163.png", "245.png", "222.png", "306.png"],
  hardcore: ["280.png", "163.png", "245.png", "222.png", "306.png"],
}

let currentMode = "easy"
document.querySelectorAll(".mode").forEach((b) => {
  b.addEventListener("click", () => {
    document.querySelectorAll(".mode").forEach((x) => x.classList.remove("active"))
    b.classList.add("active")
    currentMode = b.dataset.mode
  })
})

const chicken = document.getElementById("chicken")
const btnJump = document.getElementById("btn-jump")
const modal = document.getElementById("modal")
const xVal = document.getElementById("xval")
const btnNext = document.getElementById("btn-next")

btnJump?.addEventListener("click", () => {
  // Show loading screen
  showLoading()

  // Hide loading after 2 seconds and start game
  setTimeout(() => {
    hideLoading()

    // Original game logic
    chicken.style.transform = "translate(-50%,-44px) scale(0.5)"

    setTimeout(() => {
      chicken.style.transform = "translate(-50%,0) scale(0.5)"

      const arr = modes[currentMode] || modes.easy
      const x = arr[Math.floor(Math.random() * arr.length)]
      xVal.innerHTML = `<img src="${x}" alt="result" class="result-img">`

      modal.classList.remove("hidden")
    }, 600)
  }, 2000)
})

btnNext?.addEventListener("click", () => {
  modal.classList.add("hidden")
})

const btnPlay = document.getElementById("btn-play")
const modesMenu = document.getElementById("modes-menu")

if (btnPlay) {
  btnPlay.addEventListener("click", () => {
    modesMenu.classList.toggle("hidden")
  })
}
