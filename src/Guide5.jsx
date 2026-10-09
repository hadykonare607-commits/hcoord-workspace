import { useState, useEffect, useRef } from "react"



const etapes = [
  {
    titre: "Liste ce qui est indispensable",
    analogie:
      "Comme pour partir en voyage : tu prends d’abord l’essentiel, pas toute la maison.",
    exemple: "Exemple : le produit, un moyen de paiement, un contact WhatsApp.",
    champ: "indispensable"
  },
  {
    titre: "Liste ce qui peut attendre",
    analogie:
      "Comme une décoration : c’est utile, mais ça peut venir après la première vente.",
    exemple: "Exemple : un local, des emballages personnalisés, une enseigne.",
    champ: "utile"
  },
  {
    titre: "Liste ce qui est superflu",
    analogie:
      "Comme acheter une grosse valise avant de savoir où tu vas : ce n’est pas prioritaire.",
    exemple: "Exemple : un gros stock, du matériel neuf, un site web avant la première vente.",
    champ: "superflu"
  },
  {
    titre: "Trouve tes leviers gratuits",
    analogie:
      "Comme un élève qui emprunte un livre à la bibliothèque au lieu de l’acheter.",
    exemple: "Exemple : outils gratuits, troc, partenariat ou pré-vente.",
    champ: "leviers"
  },
  {
    titre: "Fixe ta règle de réinvestissement",
    analogie:
      "Comme un jardinier : il replante une partie de sa récolte pour avoir plus plus tard.",
    exemple: "Exemple : rembourser, améliorer un point, puis investir.",
    champ: "reinvestissement"
  }
]



const questions = [
  "As-tu identifié la version la plus simple de ton offre ?",
  "As-tu écarté les dépenses qui peuvent attendre ?",
  "Utilises-tu des outils gratuits pour démarrer ?",
  "As-tu déjà réalisé une vente avec un investissement minimal ?",
  "As-tu obtenu au moins une ressource sans argent ?",
  "Réinvestis-tu tes premiers revenus ?",
  "As-tu résisté à l’envie d’acheter « au cas où » ?",
  "Sais-tu combien coûterait ta prochaine étape ?"
]



const taches = [
  "Remplis ta grille de tri des dépenses.",
  "Identifie un troc ou un partenariat possible.",
  "Fixe ta règle de réinvestissement."
]



function Guide5({ selectedBook, onOpenBook, books, numero }) {
  const [reponses, setReponses] = useState({
    indispensable: "",
    utile: "",
    superflu: "",
    leviers: "",
    reinvestissement: ""
  })



  const [diagnostic, setDiagnostic] = useState(Array(8).fill(null))
  const [tachesFaites, setTachesFaites] = useState(Array(3).fill(false))
  const [etape, setEtape] = useState(0)
  const [scoreFinal, setScoreFinal] = useState(null)
  const [scoreAffiche, setScoreAffiche] = useState(0)
  const [erreur, setErreur] = useState("")



  const resultatRef = useRef(null)



  useEffect(() => {
    const t = localStorage.getItem(`guide5-tri-${numero}`)
    const d = localStorage.getItem(`guide5-diagnostic-${numero}`)
    const ta = localStorage.getItem("guide5-taches")
    const s = localStorage.getItem(`guide5-score-${numero}`)



    if (t) setReponses(JSON.parse(t))
    if (d) setDiagnostic(JSON.parse(d))
    if (ta) setTachesFaites(JSON.parse(ta))
    if (s) setScoreFinal(Number(s))
  }, [numero])



  useEffect(() => {
    if (scoreFinal === null) return



    let valeur = 0
    const intervalle = setInterval(() => {
      valeur = valeur + 1
      setScoreAffiche(valeur)



      if (valeur >= scoreFinal) {
        clearInterval(intervalle)
      }
    }, 40)



    return () => clearInterval(intervalle)
  }, [scoreFinal])



  const changerReponse = (champ, valeur) => {
    const nouveau = { ...reponses, [champ]: valeur }
    setReponses(nouveau)
    localStorage.setItem(
      `guide5-tri-${numero}`,
      JSON.stringify(nouveau)
    )
  }



  const changerDiagnostic = (index, valeur) => {
    const nouveau = [...diagnostic]
    nouveau[index] = valeur
    setDiagnostic(nouveau)
    localStorage.setItem(
      `guide5-diagnostic-${numero}`,
      JSON.stringify(nouveau)
    )
  }



  const changerTache = (index) => {
    const nouveau = [...tachesFaites]
    nouveau[index] = !nouveau[index]
    setTachesFaites(nouveau)
    localStorage.setItem("guide5-taches", JSON.stringify(nouveau))
  }



  const etapeSuivante = () => {
    if (etape < etapes.length) {
      setEtape(etape + 1)
    }
  }



  const etapePrecedente = () => {
    if (etape > 0) {
      setEtape(etape - 1)
    }
  }



  const calculerScore = () => {
    if (diagnostic.includes(null)) {
      setErreur(
        "Réponds aux 8 questions avant de calculer ton score."
      )
      return
    }



    setErreur("")



    const total = diagnostic.reduce(
      (somme, valeur) => somme + valeur,
      0
    )



    setScoreFinal(total)
    localStorage.setItem(`guide5-score-${numero}`, String(total))
    window.dispatchEvent(new Event("guide5-score-change"))



    setTimeout(() => {
      resultatRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      })
    }, 100)
  }



  const profil =
    scoreFinal === null
      ? null
      : scoreFinal <= 5
        ? {
            niveau: "Reprends le test",
            peutContinuer: false,
            texte:
              "Ton lancement n’est pas encore assez préparé. Trie tes dépenses et trouve un levier gratuit."
          }
        : scoreFinal <= 10
          ? {
              niveau: "Continue avec prudence",
              peutContinuer: true,
              texte:
                "Tu avances. Commence petit, vends une première fois, puis réinvestis."
            }
          : {
              niveau: "Prêt pour la suite",
              peutContinuer: true,
              texte:
                "Tu as une approche saine : démarrer avec le minimum, tester, puis réinvestir."
            }



  const guidePrecedent = books.find(
    (book) => book.id === selectedBook.id - 1
  )



  const suivantBloque = scoreFinal !== null && scoreFinal <= 5



  const progression = Math.round(
    ((etape + 1) / (etapes.length + 1)) * 100
  )



  return (
    <article className="guide1 guide5">
      <header className="guide1-header">
        <div className="barre-guide">
          <div className="barre-guide-texte">
            <span>
              Étape {etape + 1} sur {etapes.length + 1}
            </span>


            <span>{progression}%</span>
          </div>


          <div className="barre-guide-fond">
            <div
              className="barre-guide-remplie"
              style={{ width: `${progression}%` }}
            ></div>
          </div>
        </div>


        <p className="guide1-surtitle">
          Guide {selectedBook.id} / 5 — Bibliothèque Entrepreneurs
        </p>


        <h1>
          Comment lancer ton activité avec un petit budget ?
        </h1>


        <p className="guide1-accroche">
          Commence avec ce que tu as, pas avec ce qu’il te manque.
        </p>
      </header>



      <details className="explication-repliable">
        <summary>Voir l’introduction et ce que tu vas repartir avec</summary>


        <div className="carte intro">
          <p>
            « Je n’ai pas encore assez d’argent pour commencer » retarde
            souvent les projets. La plupart des activités peuvent démarrer en
            version réduite, puis grandir avec les premières ventes.
          </p>


          <ul>
            <li>Une grille pour trier tes dépenses.</li>
            <li>3 leviers gratuits pour démarrer.</li>
            <li>La règle du réinvestissement.</li>
            <li>Un autodiagnostic noté à la fin.</li>
          </ul>
        </div>
      </details>



      {etape < etapes.length && (
        <section className="carte etape">
          <span className="numero-section">
            Étape {etape + 1}
          </span>


          <h2>{etapes[etape].titre}</h2>


          <p className="analogie">
            <strong>Comme dans la vie :</strong>{" "}
            {etapes[etape].analogie}
          </p>


          <p className="exemple">
            {etapes[etape].exemple}
          </p>


          <div className="champ">
            <textarea
              value={reponses[etapes[etape].champ]}
              onChange={(e) =>
                changerReponse(
                  etapes[etape].champ,
                  e.target.value
                )
              }
              placeholder="Écris ta réponse ici"
            ></textarea>
          </div>



          {etape === 2 && (
            <details className="explication-repliable">
              <summary>Voir l’exemple de tri</summary>


              <div className="histoire">
                <strong>Exemple de tri</strong>


                <p>
                  Indispensable : le produit, Mobile Money, WhatsApp Business.
                </p>


                <p>
                  Peut attendre : local, emballages personnalisés, enseigne.
                </p>


                <p>
                  Superflu : gros stock, matériel neuf, site web avant la
                  première vente.
                </p>
              </div>
            </details>
          )}



          {etape === 3 && (
            <details className="explication-repliable">
              <summary>Voir les 3 leviers gratuits et l’histoire d’Assane</summary>


              <div className="histoire">
                <p>
                  1. Les outils gratuits : WhatsApp Business, Canva, Instagram.
                </p>


                <p>
                  2. Le troc et les partenariats : local prêté, matériel
                  emprunté.
                </p>


                <p>
                  3. La pré-vente : vends avant de produire, prends un acompte.
                </p>
              </div>


              <div className="histoire">
                <strong>Assane l’a vécu</strong>


                <p>
                  Assane a démarré avec son vélo personnel et un statut
                  WhatsApp. Ses premières courses ont payé la réparation de sa
                  chaîne et un panier d’occasion, sans emprunt.
                </p>
              </div>
            </details>
          )}



          {etape === 4 && (
            <details className="explication-repliable">
              <summary>Voir la règle de réinvestissement et les tâches</summary>


              <div className="todo">
                <p>1ère vague : rembourse ce que tu as avancé.</p>


                <p>2ème vague : améliore un point précis.</p>


                <p>3ème vague : investis dans la croissance.</p>


                <h3>À toi de jouer</h3>


                {taches.map((tache, index) => (
                  <label key={index} className="tache">
                    <input
                      type="checkbox"
                      checked={tachesFaites[index]}
                      onChange={() => changerTache(index)}
                    />


                    <span>{tache}</span>
                  </label>
                ))}
              </div>
            </details>
          )}



          <div className="navigation-etapes">
            <button
              type="button"
              onClick={etapePrecedente}
              disabled={etape === 0}
            >
              Retour
            </button>


            <button
              type="button"
              className="bouton-continuer"
              onClick={etapeSuivante}
            >
              Continuer
            </button>
          </div>
        </section>
      )}



      {etape === etapes.length && (
        <section className="carte quiz">
          <h2>Ton autodiagnostic</h2>


          <p>
            Réponds honnêtement aux 8 questions. Tu peux revenir en arrière
            pour relire tes réponses.
          </p>


          {questions.map((question, index) => (
            <div key={index} className="question">
              <p>
                {index + 1}. {question}
              </p>


              <div className="choix">
                {[0, 1, 2].map((valeur) => (
                  <button
                    key={valeur}
                    type="button"
                    className={
                      diagnostic[index] === valeur ? "actif" : ""
                    }
                    onClick={() =>
                      changerDiagnostic(index, valeur)
                    }
                  >
                    {valeur}
                  </button>
                ))}
              </div>
            </div>
          ))}



          {erreur && <p className="erreur">{erreur}</p>}



          <button
            type="button"
            className="bouton-calculer"
            onClick={calculerScore}
          >
            Calculer mon score
          </button>



          {scoreFinal !== null && (
            <div className="resultat" ref={resultatRef}>
              <p className="resultat-score">
                {scoreAffiche} / 16
              </p>


              <h3>{profil.niveau}</h3>


              <p>{profil.texte}</p>
            </div>
          )}
        </section>
      )}



      <button
        type="button"
        className="bouton-retour"
        onClick={() => onOpenBook(null)}
      >
        Retour à l’accueil
      </button>



      <nav className="navigation-guides">
        <button
          type="button"
          disabled={!guidePrecedent}
          onClick={() => onOpenBook(guidePrecedent)}
        >
          Guide précédent
        </button>


        <button
          type="button"
          disabled={suivantBloque}
        >
          Guide suivant
        </button>
      </nav>
    </article>
  )
}



export default Guide5