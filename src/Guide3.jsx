import { useState, useEffect, useRef } from "react"



const etapes = [
  {
    titre: "Pour qui est-ce que tu parles ?",
    analogie:
      "Comme au marché : tu ne vends pas du poisson à tout le monde, tu sais déjà qui cherche du poisson.",
    exemple: "Exemple : les petites restauratrices de Saint-Louis.",
    champ: "pourQui"
  },
  {
    titre: "Quel problème cette personne vit-elle ?",
    analogie:
      "Comme un taxi : les clients ne cherchent pas une voiture, ils cherchent à arriver à l’heure.",
    exemple: "Exemple : elle perd des clients à cause de plats froids.",
    champ: "probleme"
  },
  {
    titre: "Que proposes-tu concrètement ?",
    analogie:
      "Comme une boutique : dis simplement ce que tu vends et ce que la personne reçoit.",
    exemple: "Exemple : une livraison avec un box isotherme.",
    champ: "solution"
  },
  {
    titre: "Contrairement à quoi te distingues-tu ?",
    analogie:
      "Comme un bon mécanicien : les clients reviennent parce qu’ils te font confiance, pas seulement à cause du prix.",
    exemple: "Exemple : contrairement aux livreurs classiques, les plats restent chauds.",
    champ: "alternative"
  },
  {
    titre: "Teste ta phrase sur 5 personnes",
    analogie:
      "Comme pour vendre des mangues : va là où les gens qui aiment les mangues passent déjà.",
    exemple: "Lis ta phrase, puis demande : « Qu’est-ce que tu as compris ? »",
    champ: "test"
  },
  {
    titre: "Évite les 3 erreurs qui rendent invisible",
    analogie:
      "Comme un parapluie : personne n’en veut sous le soleil, mais dès qu’il pleut, tout le monde en cherche un.",
    exemple: "Parle du client, pas de toi. Évite les mots que tout le monde utilise.",
    champ: "erreurs"
  }
]



const questions = [
  "As-tu une phrase de positionnement écrite, et pas juste “dans ta tête” ?",
  "Ta phrase nomme-t-elle une cible précise ?",
  "Ta phrase dit-elle ce que le client y gagne ?",
  "As-tu testé cette phrase à voix haute sur au moins 5 personnes ?",
  "Les personnes testées ont-elles répété à peu près la même chose ?",
  "Ta phrase évite-t-elle les mots que tous tes concurrents utilisent ?",
  "Peux-tu nommer une alternative précise à laquelle tu te compares ?",
  "Utilises-tu cette phrase partout de façon cohérente ?"
]



const taches = [
  "Relis ta phrase de positionnement.",
  "Vérifie qu’elle ne tombe dans aucune des 3 erreurs.",
  "Fais le test sur 5 personnes cette semaine."
]



function Guide3({ selectedBook, onOpenBook, books, numero }) {
  const [reponses, setReponses] = useState({
    pourQui: "",
    probleme: "",
    solution: "",
    alternative: "",
    test: "",
    erreurs: ""
  })



  const [diagnostic, setDiagnostic] = useState(Array(8).fill(null))
  const [tachesFaites, setTachesFaites] = useState(Array(3).fill(false))
  const [etape, setEtape] = useState(0)
  const [scoreFinal, setScoreFinal] = useState(null)
  const [scoreAffiche, setScoreAffiche] = useState(0)
  const [erreur, setErreur] = useState("")



  const resultatRef = useRef(null)



  useEffect(() => {
    const p = localStorage.getItem(`guide3-positionnement-${numero}`)
    const d = localStorage.getItem(`guide3-diagnostic-${numero}`)
    const t = localStorage.getItem("guide3-taches")
    const s = localStorage.getItem(`guide3-score-${numero}`)



    if (p) setReponses(JSON.parse(p))
    if (d) setDiagnostic(JSON.parse(d))
    if (t) setTachesFaites(JSON.parse(t))
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
      `guide3-positionnement-${numero}`,
      JSON.stringify(nouveau)
    )
  }



  const changerDiagnostic = (index, valeur) => {
    const nouveau = [...diagnostic]
    nouveau[index] = valeur
    setDiagnostic(nouveau)
    localStorage.setItem(
      `guide3-diagnostic-${numero}`,
      JSON.stringify(nouveau)
    )
  }



  const changerTache = (index) => {
    const nouveau = [...tachesFaites]
    nouveau[index] = !nouveau[index]
    setTachesFaites(nouveau)
    localStorage.setItem("guide3-taches", JSON.stringify(nouveau))
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
    localStorage.setItem(`guide3-score-${numero}`, String(total))
    window.dispatchEvent(new Event("guide3-score-change"))



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
              "Ton positionnement est encore trop flou. Clarifie ta cible, le problème et ce qui te différencie, puis teste ta phrase sur 5 personnes."
          }
        : scoreFinal <= 10
          ? {
              niveau: "Continue avec prudence",
              peutContinuer: true,
              texte:
                "Ton positionnement commence à être clair. Teste-le sur 5 personnes avant de le diffuser partout."
            }
          : {
              niveau: "Prêt pour le guide suivant",
              peutContinuer: true,
              texte:
                "Ton positionnement est clair et différenciant. Tu peux passer au guide suivant."
            }



  const guidePrecedent = books.find(
    (book) => book.id === selectedBook.id - 1
  )



  const guideSuivant = books.find(
    (book) => book.id === selectedBook.id + 1
  )



  const suivantBloque = scoreFinal !== null && scoreFinal <= 5



  const progression = Math.round(
    ((etape + 1) / (etapes.length + 1)) * 100
  )



  return (
    <article className="guide1 guide3">
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


        <h1>Comment construire ton positionnement ?</h1>


        <p className="guide1-accroche">
          Dire clairement pourquoi on te choisit, toi, et pas un autre.
        </p>
      </header>



      <details className="explication-repliable">
        <summary>Voir l’introduction et ce que tu vas repartir avec</summary>


        <div className="carte intro">
          <p>
            Tu as une cible claire. Mais quand cette personne te compare à 3
            autres options, sait-elle en une seconde pourquoi te choisir toi ?
          </p>


          <ul>
            <li>Une formule de positionnement en 4 éléments.</li>
            <li>Une méthode pour tester ta phrase sur 5 personnes.</li>
            <li>Les 3 erreurs qui rendent un positionnement invisible.</li>
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



          {etape === 3 && (
            <details className="explication-repliable">
              <summary>Voir la phrase assemblée</summary>


              <div className="tip">
                <strong>La phrase assemblée</strong>


                <p>
                  « Pour [cible], qui [problème], [ta marque] propose
                  [solution], contrairement à [alternative], qui [limite]. »
                  Lis-la à voix haute. Si elle sonne vrai et précis, tu tiens
                  ton positionnement.
                </p>
              </div>
            </details>
          )}



          {etape === 4 && (
            <details className="explication-repliable">
              <summary>Voir l’histoire d’Assane</summary>


              <div className="histoire">
                <strong>Assane l’a vécu</strong>


                <p>
                  Assane expliquait son service ainsi : « je fais de la
                  livraison rapide et fiable à Saint-Louis. » En le testant sur
                  5 personnes, il a réalisé que personne ne se souvenait de sa
                  phrase. Il a reformulé : « Pour les petits restaurants de
                  Saint-Louis qui perdent des clients à cause de plats froids,
                  je livre avec un box isotherme. » Les 5 personnes suivantes
                  ont toutes répété « le livreur qui garde les plats chauds ».
                </p>
              </div>
            </details>
          )}



          {etape === 5 && (
            <details className="explication-repliable">
              <summary>Voir les 3 erreurs à éviter</summary>


              <div className="todo">
                <p>
                  1. Parler de toi plutôt que du client.
                </p>


                <p>
                  2. Copier le vocabulaire de la concurrence.
                </p>


                <p>
                  3. Rester vague pour plaire à tout le monde.
                </p>


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
          disabled={!guideSuivant || suivantBloque}
          onClick={() => onOpenBook(guideSuivant)}
        >
          Guide suivant
        </button>
      </nav>
    </article>
  )
}



export default Guide3