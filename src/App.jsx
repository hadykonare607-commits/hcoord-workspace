import { useState } from "react"
import Workbook from "./Workbook"
import Library from "./Library"


function App() {
  const [whatsappNumber, setWhatsappNumber] = useState("")
  const [accessGranted, setAccessGranted] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)


  function cleanNumber(value) {
    return String(value || "").replace(/\D/g, "")
  }


  async function handleAccess(event) {
    event.preventDefault()


    const cleanedNumber = cleanNumber(whatsappNumber)


    if (cleanedNumber.length < 8) {
      setErrorMessage("Entre un numéro WhatsApp valide.")
      return
    }


    setIsLoading(true)
    setErrorMessage("")


    try {
      const response = await fetch("/api/verify-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          whatsappNumber: cleanedNumber
        })
      })


      const data = await response.json()


      if (data.authorized === true) {
        setAccessGranted(true)
        setErrorMessage("")
      } else {
        setAccessGranted(false)
        setErrorMessage(
          data.message ||
          "Accès non autorisé. Vérifie ton numéro ou contacte l’administrateur."
        )
      }
    } catch (error) {
      setAccessGranted(false)
      setErrorMessage(
        "Impossible de vérifier ton accès pour le moment. Réessaie dans quelques instants."
      )
    } finally {
      setIsLoading(false)
    }
  }


  if (accessGranted) {
 return (
  <Library
    selectedBook={selectedBook}
    onOpenBook={(book) => setSelectedBook(book)}
  />
)
}


  return (
    <div className="app">
      <div className="gribouillis-fond" aria-hidden="true">
  <svg className="gribouillis gribouillis-1" viewBox="0 0 24 24">
    <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.6 1 1.4 1 2.5h6c0-1.1.3-1.9 1-2.5A6 6 0 0 0 12 3z" />
  </svg>


  <svg className="gribouillis gribouillis-2" viewBox="0 0 24 24">
    <path d="M12 2l2.5 6.5L21 11l-6.5 2.5L12 20l-2.5-6.5L3 11l6.5-2.5z" />
  </svg>


  <svg className="gribouillis gribouillis-3" viewBox="0 0 24 24">
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </svg>


  <svg className="gribouillis gribouillis-4" viewBox="0 0 24 24">
    <path d="M12 2c3 4 5 7 5 10a5 5 0 0 1-10 0c0-3 2-6 5-10zM12 22v-4" />
  </svg>


  <svg className="gribouillis gribouillis-5" viewBox="0 0 24 24">
    <path d="M4 5h16v14H4zM8 9h8M8 13h5" />
  </svg>


  <svg className="gribouillis gribouillis-6" viewBox="0 0 24 24">
    <path d="M12 3v18M5 8l7-5 7 5M5 16l7 5 7-5" />
  </svg>


  <svg className="gribouillis gribouillis-7" viewBox="0 0 24 24">
    <path d="M12 21a9 9 0 1 1 9-9M12 12l5-5M21 12h-4" />
  </svg>


  <svg className="gribouillis gribouillis-8" viewBox="0 0 24 24">
    <path d="M3 12h4l3-7 4 14 3-7h4" />
  </svg>
</div>
      <header className="app-header">
        <p className="app-kicker">H-Coord</p>
        <h1>Bienvenue dans ton workspace</h1>
        <p className="app-subtitle">
          Accède à tes workbooks, avance étape par étape et identifie ton prochain pas.
        </p>


        <form className="access-card" onSubmit={handleAccess}>
          <h2>Accès au workspace</h2>
          <p>Entre ton numéro WhatsApp pour vérifier ton accès.</p>


          <label htmlFor="whatsapp">Numéro WhatsApp</label>
          <input
            id="whatsapp"
            type="tel"
            placeholder="+221 77 000 00 00"
            value={whatsappNumber}
            onChange={(event) => setWhatsappNumber(event.target.value)}
          />


          <button type="submit" disabled={isLoading}>
            {isLoading ? "Vérification..." : "Vérifier mon accès"}
          </button>


          {errorMessage && (
            <p className="error-message">{errorMessage}</p>
          )}


          <p className="access-note">
            L’accès est réservé aux membres autorisés.
          </p>
        </form>
      </header>
    </div>
  )
}


export default App