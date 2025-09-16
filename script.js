/************* НАСТРОЙКИ *************/
const PASS = "7777" // общий пароль
const BLOCKED = ["baduser"]
const AUTH_VERSION = "1"
const AUTH_TTL_MS = 10 * 60 * 1000
const SESSION_KEY = "cr2_auth"
const UNLOCK_CODE = "6923" // код разблокировки
const UNLOCK_KEY = "cr2_unlocked" // ключ для localStorage
/*************************************/

function setAuthed(v, user) {
  try {
    if (v) {
      localStorage.setItem(SESSION_KEY, user + "|" + Date.now() + "|" + AUTH_VERSION)
    } else {
      localStorage.removeItem(SESSION_KEY)
    }
  } catch (e) {}
}

function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parts = raw.split("|")
    if (parts.length !== 3) return null
    return { u: parts[0], t: Number.parseInt(parts[1]), v: parts[2] }
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

function isUnlocked() {
  try {
    return localStorage.getItem(UNLOCK_KEY) === "true"
  } catch (e) {
    return false
  }
}

function setUnlocked() {
  try {
    localStorage.setItem(UNLOCK_KEY, "true")
  } catch (e) {}
}

function showUnlockModal() {
  document.getElementById("unlock-modal").classList.remove("hidden")
  document.getElementById("btn-jump").disabled = true
  document.querySelectorAll(".mode").forEach((btn) => (btn.disabled = true))
}

function hideUnlockModal() {
  document.getElementById("unlock-modal").classList.add("hidden")
  document.getElementById("btn-jump").disabled = false
  document.querySelectorAll(".mode").forEach((btn) => (btn.disabled = false))
}

function showGate() {
  document.getElementById("gate").classList.add("active")
  document.getElementById("app").classList.remove("active")
}

function showApp() {
  document.getElementById("app").classList.add("active")
  document.getElementById("gate").classList.remove("active")

  if (!isUnlocked()) {
    setTimeout(() => {
      showUnlockModal()
    }, 3000)
  }
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

function isValidLogin(login) {
  if (!/^\d{10}$/.test(login)) return false
  return Number(login) >= 1380000000
}

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault()
    const login = (loginInput.value || "").trim()
    const pass = passInput.value || ""

    const ok = isValidLogin(login) && pass === PASS
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

const unlockCodeInput = document.getElementById("unlock-code")
const unlockBtn = document.getElementById("btn-unlock")
const unlockError = document.getElementById("unlock-error")

if (unlockBtn) {
  unlockBtn.addEventListener("click", () => {
    const code = (unlockCodeInput.value || "").trim()

    if (code === UNLOCK_CODE) {
      setUnlocked()
      hideUnlockModal()
    } else {
      unlockError.hidden = false
      setTimeout(() => (unlockError.hidden = true), 2000)
    }
  })
}

if (unlockCodeInput) {
  unlockCodeInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      unlockBtn.click()
    }
  })
}

// ====== ИГРА ======
const modes = {
  easy: ["6-4.jpg", "6-6.jpg", "6-7.jpg", "6-8.jpg", "6-9.jpg"],
  medium: ["9.png"],
  hard: ["6.png", "9.png", "6-5.jpg", "6-3.jpg"],
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
  chicken.style.transform = "translate(-50%,-44px) scale(0.5)"

  setTimeout(() => {
    chicken.style.transform = "translate(-50%,0) scale(0.5)"

    const arr = modes[currentMode] || modes.easy
    const x = arr[Math.floor(Math.random() * arr.length)]
    xVal.innerHTML = `<img src="${x}" alt="result" class="result-img">`

    modal.classList.remove("hidden")
  }, 600)
})

btnNext?.addEventListener("click", () => {
  modal.classList.add("hidden")
})

const btnPlay = document.getElementById("btn-play")
const modesMenu = document.getElementById("modes-menu")

btnPlay?.addEventListener("click", () => {
  modesMenu?.classList.toggle("hidden")
})
