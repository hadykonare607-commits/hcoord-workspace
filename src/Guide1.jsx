import { useState, useEffect, useRef } from "react"



const etapes = [
  {
    titre: "Quel problème veux-tu résoudre ?",
    analogie:
      "Comme un taxi : les clients ne cherchent pas une voiture, ils cherchent à arriver à l’heure.",
    exemple:
      "Exemple : les femmes actives n’ont pas le temps d’aller chez le tailleur.",
    champ: "probleme"
  },
  {
    titre: "Pour qui est-ce un problème ?",
    analogie:
      "Comme au marché : tu ne vends pas du poisson à tout le monde, tu cherches ceux qui cherchent du poisson.",
    exemple:
      "Exemple : les femmes actives de Dakar, entre 25 et 45 ans.",
    champ: "pourQui"
  },
  {
    titre: "Quelle est ta solution ?",
    analogie:
      "Comme une boutique : dis simplement ce que tu vends et ce que la personne reçoit.",
    exemple: "Exemple : une livraison de tenues ajustées en 48 heures.",
    champ: "solution"
  },
  {
    titre: "Pourquoi toi ?",
    analogie:
      "Comme un bon mécanicien : les clients reviennent parce qu’ils te font confiance, pas seulement à cause du prix.",
    exemple: "Exemple : je connais les couturières du quartier et je peux vérifier la qualité.",
    champ: "pourquoiToi"
  },
  {
    titre: "Va parler à 10 personnes",
    analogie:
      "Comme pour vendre des mangues : va là où les gens qui aiment les mangues passent déjà.",
    exemple: "Pose les 4 questions et note chaque réponse.",
    champ: "conversations"
  },
  {
    titre: "Quels signaux as-tu reçus ?",
    analogie:
      "Comme un parapluie : personne n’en veut sous le soleil, mais dès qu’il pleut, tout le monde en cherche un.",
    exemple: "Note les acomptes, les partages et les « non » argumentés.",
    champ: "signaux"
  }
]



const questions = [
  "As-tu parlé à au moins 10 personnes qui correspondent à ta cible ?",
  "Combien ont décrit le problème avec leurs propres mots ?",
  "As-tu proposé un prix précis à quelqu’un ?",
  "Quelqu’un a-t-il sorti son argent pour ton idée ?",
  "As-tu identifié au moins 3 concurrents ou alternatives ?",
  "Sais-tu dire ce qui te différencie en une phrase ?",
  "As-tu testé une version minimale de ton offre ?",
  "As-tu un chiffre concret qui te rassure ?"
]



const taches = [
  "Choisis 10 personnes à contacter cette semaine.",
  "Pose les 4 questions et note chaque réponse.",
  "Compte tes signaux fiables, pas juste les compliments."
]



function Guide1({ selectedBook, onOpenBook, books, numero }) {
  const [reponses, setReponses] = useState({
    probleme: "",
    pourQui: "",
    solution: "",
    pourquoiToi: "",
    conversations: "",
    signaux: ""
  })



  const [diagnostic, setDiagnostic] = useState(Array(8).fill(null))
  const [tachesFaites, setTachesFaites] = useState(Array(3).fill(false))
  const [etape, setEtape] = useState(0)
  const [scoreFinal, setScoreFinal] = useState(null)
  const [scoreAffiche, setScoreAffiche] = useState(0)
  const [erreur, setErreur] = useState("")



  const resultatRef = useRef(null)



  useEffect(() => {
    const r = localStorage.getItem(`guide1-reponses-${numero}`)
    const d = localStorage.getItem(`guide1-diagnostic-${numero}`)
    const t = localStorage.getItem("guide1-taches")
    const s = localStorage.getItem(`guide1-score-${numero}`)



    if (r) setReponses(JSON.parse(r))
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
      `guide1-reponses-${numero}`,
      JSON.stringify(nouveau)
    )
  }



  const changerDiagnostic = (index, valeur) => {
    const nouveau = [...diagnostic]
    nouveau[index] = valeur
    setDiagnostic(nouveau)
    localStorage.setItem(
      `guide1-diagnostic-${numero}`,
      JSON.stringify(nouveau)
    )
  }



  const changerTache = (index) => {
    const nouveau = [...tachesFaites]
    nouveau[index] = !nouveau[index]
    setTachesFaites(nouveau)
    localStorage.setItem("guide1-taches", JSON.stringify(nouveau))
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
    localStorage.setItem(`guide1-score-${numero}`, String(total))
    window.dispatchEvent(new Event("guide1-score-change"))



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
              "Ton idée n’est pas encore suffisamment testée. Refais les 10 conversations, cherche des signaux fiables, puis repasse l’autodiagnostic."
          }
        : scoreFinal <= 10
          ? {
              niveau: "Continue avec prudence",
              peutContinuer: true,
              texte:
                "Tu as commencé à valider ton idée. Cherche un acompte, une pré-commande ou plusieurs retours précis avant d’investir."
            }
          : {
              niveau: "Prêt pour le guide suivant",
              peutContinuer: true,
              texte:
                "Tu as obtenu de bons signaux. Ta cible est claire et ton idée commence à être validée."
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
    <article className="guide1">
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


        <h1>Comment tester ton idée avant d’investir ?</h1>


        <p className="guide1-accroche">
          Avance étape par étape. Tu peux revenir en arrière à tout moment.
        </p>
      </header>



      <details className="explication-repliable">
        <summary>Voir l’introduction et ce que tu vas repartir avec</summary>


        <div className="carte intro">
          <p>
            Chaque année, des porteurs de projet sénégalais dépensent leurs
            économies sur une idée qu’ils n’ont jamais vraiment testée. Ce
            guide te donne une méthode pour savoir, en quelques jours et sans
            budget, si ton idée mérite vraiment ton argent.
          </p>


          <ul>
            <li>Une grille pour clarifier ton idée en une page.</li>
            <li>La méthode des 10 conversations.</li>
            <li>Une checklist pour distinguer un signal fiable d’un faux espoir.</li>
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



          {etape === 4 && (
            <details className="explication-repliable">
              <summary>Voir les 4 questions à poser</summary>


              <ol className="questions-conversations">
                <li>Comment fais-tu aujourd’hui pour ce problème ?</li>
                <li>Qu’est-ce qui te frustre le plus ?</li>
                <li>Combien serais-tu prêt à payer pour une solution ?</li>
                <li>Achèterais-tu aujourd’hui si je te le proposais ?</li>
              </ol>


              <div className="histoire">
                <strong>Assane l’a vécu</strong>


                <p>
                  Avant de proposer une livraison de repas, Assane a posé ces
                  4 questions à 10 habitués du quartier. Neuf sur dix se
                  plaignaient des plats froids. Ce point est devenu l’argument
                  numéro 1 de son offre.
                </p>
              </div>
            </details>
          )}



          {etape === 5 && (
            <details className="explication-repliable">
              <summary>Voir ce qui compte vraiment</summary>


              <div className="signaux">
                <div className="signal bon">
                  <h3>Ce qui compte vraiment</h3>


                  <ul>
                    <li>Un acompte payé, même symbolique.</li>
                    <li>Une personne qui partage spontanément ton idée.</li>
                    <li>Un « non » argumenté et précis.</li>
                  </ul>
                </div>


                <div className="signal mauvais">
                  <h3>Ce qui ne veut rien dire</h3>


                  <ul>
                    <li>« C’est une super idée ! » sans action.</li>
                    <li>Des likes ou commentaires.</li>
                    <li>L’enthousiasme de tes proches.</li>
                  </ul>
                </div>
              </div>


              <div className="todo">
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



export default Guide1