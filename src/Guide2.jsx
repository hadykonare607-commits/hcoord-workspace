import { useState, useEffect, useRef } from "react"



const etapes = [
  {
    titre: "Qui veux-tu aider en premier ?",
    analogie:
      "Comme au marché : tu ne vends pas à tout le monde. Tu choisis d’abord les personnes qui ont déjà besoin de ce que tu proposes.",
    exemple:
      "Exemple : les femmes actives de Dakar qui n’ont pas le temps d’aller chez le tailleur.",
    champ: "cible"
  },
  {
    titre: "Où vit-elle ou où peut-on la trouver ?",
    analogie:
      "Comme un taxi : le chauffeur sait dans quel quartier trouver les clients qu’il cherche.",
    exemple: "Exemple : Dakar-Plateau, Ouakam, Thiès centre…",
    champ: "quartier"
  },
  {
    titre: "Quelle est sa situation aujourd’hui ?",
    analogie:
      "Comme à l’école : on ne parle pas de la même façon à un élève, à un parent ou à un enseignant.",
    exemple: "Exemple : salariée, étudiante, commerçante, maman au foyer…",
    champ: "situation"
  },
  {
    titre: "Combien peut-elle dépenser pour résoudre ce problème ?",
    analogie:
      "Comme au marché : avant de proposer un prix, regarde ce que la personne peut réellement payer.",
    exemple: "Exemple : entre 5 000 et 15 000 FCFA par mois.",
    champ: "budget"
  },
  {
    titre: "Où passe-t-elle son temps ?",
    analogie:
      "Comme pour vendre des mangues : va là où les gens qui aiment les mangues passent déjà.",
    exemple: "Exemple : WhatsApp, Instagram, marché, groupe de quartier…",
    champ: "lieux"
  },
  {
    titre: "Qu’est-ce qui la pousse à acheter ?",
    analogie:
      "Comme un parapluie : personne n’en veut sous le soleil, mais dès qu’il pleut, tout le monde en cherche un.",
    exemple: "Exemple : un mariage, un entretien, un problème récurrent…",
    champ: "declencheur"
  },
  {
    titre: "As-tu d’autres cibles possibles ?",
    analogie:
      "Comme un commerçant : il peut vendre à plusieurs types de clients, mais il commence par celui qui achète le plus facilement.",
    exemple: "Exemple : les salariées, les étudiantes, les mamans…",
    champ: "autresCibles"
  }
]



const questions = [
  "Peux-tu décrire ta cible en une phrase précise, sans jamais dire “tout le monde” ?",
  "Connais-tu le quartier ou la zone où vit ta cible principale ?",
  "Sais-tu sur quel canal précis elle passe le plus de temps ?",
  "As-tu une idée réaliste du budget qu’elle peut consacrer à ton produit ou service ?",
  "As-tu déjà approché au moins 5 personnes qui correspondent à ce profil ?",
  "Sais-tu ce qui déclenche l’achat chez elle ?",
  "As-tu volontairement écarté d’autres cibles pour te concentrer sur celle-ci ?",
  "Cette cible a-t-elle à la fois le besoin et les moyens de payer ?"
]



function Guide2({ selectedBook, onOpenBook, books, numero }) {
  const [reponses, setReponses] = useState({
    cible: "",
    quartier: "",
    situation: "",
    budget: "",
    lieux: "",
    declencheur: "",
    autresCibles: ""
  })



  const [diagnostic, setDiagnostic] = useState(Array(8).fill(null))
  const [etape, setEtape] = useState(0)
  const [scoreFinal, setScoreFinal] = useState(null)
  const [scoreAffiche, setScoreAffiche] = useState(0)
  const [erreur, setErreur] = useState("")



  const resultatRef = useRef(null)



  useEffect(() => {
    const r = localStorage.getItem(`guide2-portrait-${numero}`)
    const d = localStorage.getItem(`guide2-diagnostic-${numero}`)
    const s = localStorage.getItem(`guide2-score-${numero}`)



    if (r) setReponses(JSON.parse(r))
    if (d) setDiagnostic(JSON.parse(d))
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
      `guide2-portrait-${numero}`,
      JSON.stringify(nouveau)
    )
  }



  const changerDiagnostic = (index, valeur) => {
    const nouveau = [...diagnostic]
    nouveau[index] = valeur
    setDiagnostic(nouveau)
    localStorage.setItem(
      `guide2-diagnostic-${numero}`,
      JSON.stringify(nouveau)
    )
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
    localStorage.setItem(`guide2-score-${numero}`, String(total))
    window.dispatchEvent(new Event("guide2-score-change"))



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
            niveau: "Ta cible est encore à préciser",
            peutContinuer: false,
            texte:
              "Décris une personne réelle, son quartier, son canal principal et son budget. Ensuite, repasse l’autodiagnostic."
          }
        : scoreFinal <= 10
          ? {
              niveau: "Tu avances bien",
              peutContinuer: true,
              texte:
                "Tu as une direction. Parle maintenant à au moins 5 personnes de cette cible avant d’investir."
            }
          : {
              niveau: "Ta cible est prête",
              peutContinuer: true,
              texte:
                "Ta cible est précise et crédible. Tu peux passer au guide suivant."
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
    <article className="guide1 guide2">
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


        <h1>Comment définir tes premières cibles ?</h1>


        <p className="guide1-accroche">
          Avance étape par étape. Tu peux revenir en arrière à tout moment.
        </p>
      </header>



      <details className="explication-repliable">
        <summary>Voir l’introduction</summary>


        <div className="carte intro">
          <p>
            « Mes clients ? Tout le monde peut avoir besoin de mon produit. »
            C’est la phrase la plus dangereuse qu’un porteur de projet puisse
            se dire. Un message qui parle à tout le monde ne touche personne,
            ni sur WhatsApp, ni sur Instagram, ni dans la rue.
          </p>


          <p>
            Ce guide te donne une méthode simple pour transformer « tout le
            monde » en un portrait précis de personnes réelles, celles qui
            achèteront en premier, et qui parleront de toi ensuite.
          </p>
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



          {etape === 0 && (
            <details className="explication-repliable">
              <summary>Voir l’histoire d’Aïda</summary>


              <div className="histoire">
                <strong>Aïda l’a vécu</strong>


                <p>
                  Au début, Aïda disait vendre « pour toutes les femmes qui
                  aiment la mode ». Ses posts ne généraient presque aucune
                  vente. En décrivant une cliente précise — Fatou, 29 ans,
                  assistante de direction à Dakar-Plateau — elle a changé ses
                  photos, ses horaires et son message. Ses ventes ont doublé
                  le mois suivant.
                </p>
              </div>
            </details>
          )}



          {etape === 6 && (
            <details className="explication-repliable">
              <summary>Voir comment choisir entre plusieurs cibles</summary>


              <p>
                Note chaque cible de 1 à 3 selon : la facilité à la contacter,
                son budget réel, l’urgence de son problème et le nombre de
                concurrents. Commence par la cible qui obtient le meilleur
                score.
              </p>
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


          <details className="explication-repliable">
            <summary>Voir si tu as choisi la bonne cible</summary>


            <div className="signaux">
              <div className="signal bon">
                <h3>Ce qui compte vraiment</h3>


                <ul>
                  <li>
                    Tu peux citer 3 personnes réelles qui correspondent à ce
                    portrait.
                  </li>
                  <li>
                    Cette personne a déjà dépensé de l’argent pour ce problème.
                  </li>
                  <li>
                    Tu sais exactement sur quel canal la joindre.
                  </li>
                </ul>
              </div>


              <div className="signal mauvais">
                <h3>Ce qui ne veut rien dire</h3>


                <ul>
                  <li>
                    Ta cible inclut « toutes les femmes » ou « tous les
                    jeunes ».
                  </li>
                  <li>
                    Tu ne sais pas où cette personne passe son temps.
                  </li>
                  <li>
                    Ton message pourrait s’adresser à n’importe qui.
                  </li>
                </ul>
              </div>
            </div>
          </details>


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



export default Guide2