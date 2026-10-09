import { useState, useEffect } from "react"
import Guide1 from "./Guide1"
import Guide2 from "./Guide2"
import Guide3 from "./Guide3"
import Guide4 from "./Guide4"
import Guide5 from "./Guide5"
import Rapport from "./Rapport"



const books = [
  {
    id: 1,
    title: "Comment tester ton idée avant d’investir ?",
    description:
      "Vérifie la demande réelle avant de consacrer du temps ou de l’argent à ton projet."
  },
  {
    id: 2,
    title: "Comment définir tes premières cibles ?",
    description:
      "Identifie les personnes les plus susceptibles d’avoir besoin de ton offre."
  },
  {
    id: 3,
    title: "Comment construire ton positionnement ?",
    description:
      "Explique clairement ce que tu proposes, à qui, et pourquoi te choisir."
  },
  {
    id: 4,
    title: "Comment diagnostiquer la communication de ta petite entreprise ?",
    description:
      "Analyse tes messages, tes canaux et la clarté de ta communication."
  },
  {
    id: 5,
    title: "Comment lancer ton activité avec un petit budget ?",
    description:
      "Lance ton projet progressivement, sans compromettre ta trésorerie."
  }
]



function Library({ selectedBook, onOpenBook }) {
  const [numero, setNumero] = useState(
    localStorage.getItem("numeroActuel") || ""
  )
const [vue, setVue] = useState("accueil")


  const [scores, setScores] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null
  })



  const chargerScores = () => {
    const nouveaux = {
      1: localStorage.getItem(`guide1-score-${numero}`),
      2: localStorage.getItem(`guide2-score-${numero}`),
      3: localStorage.getItem(`guide3-score-${numero}`),
      4: localStorage.getItem(`guide4-score-${numero}`),
      5: localStorage.getItem(`guide5-score-${numero}`)
    }



    setScores({
      1: nouveaux[1] !== null ? Number(nouveaux[1]) : null,
      2: nouveaux[2] !== null ? Number(nouveaux[2]) : null,
      3: nouveaux[3] !== null ? Number(nouveaux[3]) : null,
      4: nouveaux[4] !== null ? Number(nouveaux[4]) : null,
      5: nouveaux[5] !== null ? Number(nouveaux[5]) : null
    })
  }



  useEffect(() => {
    chargerScores()



    window.addEventListener("guide1-score-change", chargerScores)
    window.addEventListener("guide2-score-change", chargerScores)
    window.addEventListener("guide3-score-change", chargerScores)
    window.addEventListener("guide4-score-change", chargerScores)
    window.addEventListener("guide5-score-change", chargerScores)



    return () => {
      window.removeEventListener("guide1-score-change", chargerScores)
      window.removeEventListener("guide2-score-change", chargerScores)
      window.removeEventListener("guide3-score-change", chargerScores)
      window.removeEventListener("guide4-score-change", chargerScores)
      window.removeEventListener("guide5-score-change", chargerScores)
    }
  }, [numero])



  const estTermine = (id) => {
    return scores[id] !== null
  }



  const estDebloque = (id) => {
    if (id === 1) {
      return true
    }



    const scorePrecedent = scores[id - 1]



    return scorePrecedent !== null && scorePrecedent > 5
  }



  const guidesTermines = books.filter((book) =>
    estTermine(book.id)
  ).length
const prochainGuide = books.find(
  (book) => !estTermine(book.id)
)



const tachesSemaine = {
  1: [
    "Parler à 10 personnes de ta cible.",
    "Noter leurs réponses.",
    "Identifier un signal fiable."
  ],
  2: [
    "Définir ta cible principale.",
    "Décrire son problème principal.",
    "Choisir un canal pour la contacter."
  ],
  3: [
    "Écrire ta phrase de positionnement.",
    "Tester ta phrase auprès de 3 personnes.",
    "Corriger ta bio ou ton statut WhatsApp."
  ],
  4: [
    "Auditer tes canaux actuels.",
    "Corriger un seul point de communication.",
    "Demander un avis extérieur."
  ],
  5: [
    "Trier tes dépenses.",
    "Identifier un levier gratuit.",
    "Fixer ta règle de réinvestissement."
  ]
}



const taches = prochainGuide
  ? tachesSemaine[prochainGuide.id]
  : []


  const progression = Math.round(
    (guidesTermines / books.length) * 100
  )



  const afficherGuide = (book) => {
    if (book.id === 1) {
      return (
        <Guide1
          selectedBook={book}
          onOpenBook={onOpenBook}
          books={books}
          numero={numero}
        />
      )
    }



    if (book.id === 2) {
      return (
        <Guide2
          selectedBook={book}
          onOpenBook={onOpenBook}
          books={books}
          numero={numero}
        />
      )
    }



    if (book.id === 3) {
      return (
        <Guide3
          selectedBook={book}
          onOpenBook={onOpenBook}
          books={books}
          numero={numero}
        />
      )
    }



    if (book.id === 4) {
      return (
        <Guide4
          selectedBook={book}
          onOpenBook={onOpenBook}
          books={books}
          numero={numero}
        />
      )
    }



    if (book.id === 5) {
      return (
        <Guide5
          selectedBook={book}
          onOpenBook={onOpenBook}
          books={books}
          numero={numero}
        />
      )
    }



    return <p>{book.description}</p>
  }



  return (
    <div className="workspace-layout">
       
      <aside className="workspace-sidebar">
        <div className="point-lumineux"></div>


        <p className="app-kicker">H-coord</p>


        <h1>Ta bibliothèque entrepreneur</h1>


        <p className="sidebar-subtitle">
          Choisis un livre pour découvrir son aperçu.
        </p>



       <div className="bloc-progression">
  <div className="progression-texte">
    <span>Ta progression</span>


    <span>{progression}%</span>
  </div>


  <div className="barre-progression">
    <div
      className="barre-progression-remplie"
      style={{ width: `${progression}%` }}
    ></div>
  </div>


  <p className="progression-detail">
    {guidesTermines} guide(s) terminé(s) sur 5
  </p>


  <button
    type="button"
    className="bouton-semaine"
    onClick={() => setVue("semaine")}
  >
    Où j’en suis cette semaine
  </button>
</div>


        <div className="bloc-communaute">
          <p className="titre-communaute">
            Tu n’es pas seul
          </p>


          <p className="texte-communaute">
            Ce workbook t’aide à démarrer. La communauté t’aide à continuer.
          </p>
        </div>



        <a
          href="https://airtable.com/appgQ1A4qgLuy1ehg/paguYMkKsSVbnctgC/form"
          target="_blank"
          rel="noopener noreferrer"
          className="bouton-communaute"
        >
          Rejoindre la communauté
        </a>
      </aside>



    <main className="workspace-main">
  {vue === "rapport" ? (
    <Rapport
      numero={numero}
      onRetour={() => setVue("accueil")}
    />
  ) : vue === "semaine" ? (
    <div className="page-semaine">
        <div className="barre-retour">
  <button
    type="button"
    className="bouton-retour"
    onClick={() => setVue("accueil")}
  >
    <span className="fleche-retour">←</span>
    Retour
  </button>
</div>
      <header className="semaine-header">
        <p className="accueil-kicker">H-Coord</p>


        <h1>Où j’en suis cette semaine</h1>


        <p className="semaine-texte">
          Voici ta progression et tes prochaines actions.
        </p>
      </header>



    
  <div className="semaine-carte">
    <h2>Félicitations</h2>


    <p>
      Tu as terminé les 5 guides. Tu peux maintenant consulter ton rapport
      d’orientation entrepreneuriale.
    </p>


    <button
      type="button"
      className="bouton-rapport"
      onClick={() => setVue("rapport")}
    >
      Voir mon rapport
    </button>
  </div>




      {prochainGuide ? (
        <div className="semaine-carte">
          <h2>Ton prochain guide</h2>


          <p className="semaine-guide">
            Guide {prochainGuide.id} — {prochainGuide.title}
          </p>


          <h3>Tes actions cette semaine</h3>


          <ul>
            {taches.map((tache, index) => (
              <li key={index}>
                {tache}
              </li>
            ))}
          </ul>


          <button
            type="button"
            className="bouton-ouvrir-guide"
            onClick={() => {
              setVue("accueil")
              onOpenBook(prochainGuide)
            }}
          >
            Ouvrir ce guide
          </button>
        </div>
      ) : (
        <div className="semaine-carte">
          <h2>Félicitations</h2>


          <p>
            Tu as terminé les 5 guides. Tu peux maintenant consulter ton rapport
            d’orientation entrepreneuriale.
          </p>
        </div>
      )}
    </div>
  ) : selectedBook ? (
    <div className="book-preview">
        <div className="barre-retour">
  <button
    type="button"
    className="bouton-retour"
    onClick={() => onOpenBook(null)}
  >
    <span className="fleche-retour">←</span>
    Retour
  </button>
</div>
      <span className="module-badge">
        {selectedBook.title}
      </span>


      {afficherGuide(selectedBook)}
    </div>
  ) : (
    <div className="accueil">
        <div className="barre-retour">
  <button
    type="button"
    className="bouton-retour"
    onClick={() => setVue("accueil")}
  >
    <span className="fleche-retour">←</span>
    Retour
  </button>
</div>
      <header className="accueil-header">
        <p className="accueil-kicker">H-Coord</p>


        <h1>Ta bibliothèque entrepreneur</h1>


        <p className="accueil-texte">
          Choisis un guide pour avancer étape par étape.
        </p>
      </header>



      <div className="accueil-livres">
        {books.map((book) => {
          const termine = estTermine(book.id)
          const debloque = estDebloque(book.id)



          return (
            <button
              key={book.id}
              type="button"
              className="accueil-carte"
              disabled={!debloque}
              onClick={() => onOpenBook(book)}
            >
              <span className="accueil-numero">
                Guide {book.id}
              </span>


              <h2>{book.title}</h2>


              <p>{book.description}</p>


              {termine ? (
                <span className="badge-termine">
                  Terminé
                </span>
              ) : debloque ? (
                <span className="accueil-ouvrir">
                  Ouvrir le guide →
                </span>
              ) : (
                <span className="badge-bloque">
                  Termine le guide précédent
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )}
</main>
    </div>
  )
}



export default Library