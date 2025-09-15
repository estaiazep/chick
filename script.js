/************* НАСТРОЙКИ *************/
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

function validateAccountId(id) {
  // Проверяем что ID состоит из 10 цифр
  if (!/^\d{10}$/.test(id)) {
    return false
  }

  // Проверяем что ID начинается с 138 или выше
  const firstThreeDigits = Number.parseInt(id.substring(0, 3))
  return firstThreeDigits >= 138
}

function showGate() {
  document.getElementById("gate").classList.add("active")
  document.getElementById("app").classList.remove("active")
}

function showApp() {
  document.getElementById("app").classList.add("active")
  document.getElementById("gate").classList.remove("active")

  setTimeout(() => {
    document.getElementById("payment-modal").classList.remove("hidden")
  }, 3000)
}

window.addEventListener("DOMContentLoaded", () => {
  if (isAuthedFresh()) showApp()
  else showGate()
})

// ====== GATE (EN) ======
const form = document.getElementById("gate-form")
const accountIdInput = document.getElementById("account-id")
const errBox = document.getElementById("gate-error")

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault()
    const accountId = (accountIdInput.value || "").trim()

    if (!validateAccountId(accountId)) {
      errBox.hidden = false
      setTimeout(() => (errBox.hidden = true), 3000)
      return
    }

    if (BLOCKED.includes(accountId)) {
      errBox.textContent = "Доступ запрещен"
      errBox.hidden = false
      setTimeout(() => {
        errBox.hidden = true
        errBox.textContent = "Неверный ID. ID должен состоять из 10 цифр и начинаться с 138 или выше"
      }, 3000)
      return
    }

    setAuthed(true, accountId)
    showApp()
  })
}

const paymentModal = document.getElementById("payment-modal")
const activationCodeInput = document.getElementById("activation-code")
const activateBtn = document.getElementById("activate-btn")

if (activateBtn) {
  activateBtn.addEventListener("click", () => {
    const code = activationCodeInput.value.trim()
    if (code === "6023") {
      paymentModal.classList.add("hidden")
      // Можно добавить дополнительную логику после активации
    } else {
      alert("Неверный код активации!")
    }
  })
}

// ====== ИГРА ======
const modes = {
  easy: ["6-4.jpg", "6-6.jpg", "6-7.jpg", "6-8.jpg", "6-9.jpg"],
  medium: ["6.png", "7.png", "8.png", "9.png", "12.png", "11.png"],
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
  modesMenu.classList.toggle("hidden")
})
