import { useState } from "react"


function Workbook({ whatsappNumber }) {
  const [activeModule, setActiveModule] = useState("depart")
  const [pointDeDepart, setPointDeDepart] = useState("")
  const [prochainPas, setProchainPas] = useState("")
  const [actionsSemaine, setActionsSemaine] = useState("")
  const [workbookCompleted, setWorkbookCompleted] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [isSaving, setIsSaving] = useState(false)


  async function saveWorkbook() {
    setIsSaving(true)
    setSaveMessage("")


    try {
      const response = await fetch("/api/save-workbook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          whatsappNumber,
          pointDeDepart,
          prochainPas,
          actionsSemaine
        })
      })


      const data = await response.json()


      if (data.saved === true) {
        setWorkbookCompleted(true)
      } else {
        setSaveMessage(
          data.message ||
          "Impossible d’enregistrer tes réponses pour le moment."
        )
      }
    } catch (error) {
      setSaveMessage(
        "Impossible d’enregistrer tes réponses pour le moment."
      )
    } finally {
      setIsSaving(false)
    }
  }


  if (workbookCompleted) {
    return (
      <div className="app">
        <div className="workspace-card">
          <div className="module-header">
            <span className="module-badge">Workbook enregistré</span>
            <h1>Ton point de départ est posé</h1>
            <p>
              Tes réponses ont été enregistrées. Tu pourras revenir compléter
              ton workbook quand tu le souhaites.
            </p>
          </div>


          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              setWorkbookCompleted(false)
              setActiveModule("depart")
            }}
          >
            Revenir à mon workbook
          </button>
        </div>
      </div>
    )
  }


  return (
    <div className="app">
      <div className="workspace-card">
        <p className="app-kicker">H-coord</p>
        <h1>Mon Workbook</h1>
        <p className="app-subtitle">
          Avance étape par étape, à ton rythme. Toutes les étapes sont
          facultatives.
        </p>


        <div className="workbook-navigation">
          <button
            type="button"
            className={
              activeModule === "depart"
                ? "workbook-button active"
                : "workbook-button"
            }
            onClick={() => setActiveModule("depart")}
          >
            Mon point de départ
          </button>


          <button
            type="button"
            className={
              activeModule === "prochain-pas"
                ? "workbook-button active"
                : "workbook-button"
            }
            onClick={() => setActiveModule("prochain-pas")}
          >
            Mon prochain pas
          </button>


          <button
            type="button"
            className={
              activeModule === "actions"
                ? "workbook-button active"
                : "workbook-button"
            }
            onClick={() => setActiveModule("actions")}
          >
            Mes actions de la semaine
          </button>
        </div>


        {activeModule === "depart" && (
          <div className="workbook-module">
            <div className="module-header">
              <span className="module-badge">Étape facultative</span>
              <h2>Mon point de départ</h2>
              <p>
                Prends un instant pour noter où tu en es aujourd’hui. Tu peux
                aussi passer directement à l’étape suivante.
              </p>
            </div>


            <label htmlFor="situation">Ma situation actuelle</label>
            <textarea
              id="situation"
              value={pointDeDepart}
              onChange={(event) => setPointDeDepart(event.target.value)}
              placeholder="Exemple : je veux lancer mon activité, mais je ne sais pas par où commencer."
            />


            <div className="workbook-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setActiveModule("prochain-pas")}
              >
                Enregistrer et continuer
              </button>


              <button
                type="button"
                className="workbook-skip-button"
                onClick={() => setActiveModule("prochain-pas")}
              >
                Passer cette étape
              </button>
            </div>
          </div>
        )}


        {activeModule === "prochain-pas" && (
          <div className="workbook-module">
            <div className="module-header">
              <span className="module-badge">Une action à la fois</span>
              <h2>Mon prochain pas</h2>
              <p>
                Choisis une action simple et réaliste à réaliser avant ta
                prochaine séance.
              </p>
            </div>


            <label htmlFor="next-step">Mon prochain pas</label>
            <input
              id="next-step"
              type="text"
              value={prochainPas}
              onChange={(event) => setProchainPas(event.target.value)}
              placeholder="Exemple : écrire la description de mon offre."
            />


            <div className="workbook-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setActiveModule("actions")}
              >
                Enregistrer et continuer
              </button>


              <button
                type="button"
                className="workbook-skip-button"
                onClick={() => setActiveModule("actions")}
              >
                Passer cette étape
              </button>
            </div>
          </div>
        )}


        {activeModule === "actions" && (
          <div className="workbook-module">
            <div className="module-header">
              <span className="module-badge">Facultatif</span>
              <h2>Mes actions de la semaine</h2>
              <p>
                Si tu le souhaites, note quelques actions concrètes à réaliser
                cette semaine. Tu peux aussi terminer sans rien ajouter.
              </p>
            </div>


            <label htmlFor="weekly-actions">Mes actions</label>
            <textarea
              id="weekly-actions"
              value={actionsSemaine}
              onChange={(event) => setActionsSemaine(event.target.value)}
              placeholder="Exemple : contacter trois prospects, préparer mon offre, publier un post."
            />


            <div className="workbook-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={saveWorkbook}
                disabled={isSaving}
              >
                {isSaving
                  ? "Enregistrement..."
                  : "Enregistrer mon workbook"}
              </button>


              <button
                type="button"
                className="workbook-skip-button"
                onClick={saveWorkbook}
                disabled={isSaving}
              >
                Terminer sans ajouter d’action
              </button>
            </div>


            {saveMessage && (
              <p className="error-message">{saveMessage}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}


export default Workbook