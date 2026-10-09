import { useState, useEffect, useRef } from "react"



const etapes = [
  {
    titre: "Audite ton WhatsApp",
    analogie:
      "Comme une boutique : avant d’ajouter un nouveau produit, regarde si ta vitrine est propre et claire.",
    exemple: "Exemple : ton statut, ton catalogue et ta photo de profil.",
    champ: "whatsapp"
  },
  {
    titre: "Audite ton Instagram ou Facebook",
    analogie:
      "Comme un taxi : le client doit comprendre en quelques secondes où tu vas et ce que tu proposes.",
    exemple: "Exemple : ta bio et ta dernière publication.",
    champ: "instagram"
  },
  {
    titre: "Audite ta carte de visite ou ton flyer",
    analogie:
      "Comme une carte de restaurant : le client doit trouver vite ce qu’il peut commander.",
    exemple: "Exemple : ce qui est écrit, ce qui manque, ce qui est flou.",
    champ: "carte"
  },
  {
    titre: "Écoute ce que dit le bouche à oreille",
    analogie:
      "Comme un bon mécanicien : les clients parlent de toi à d’autres, écoute ce qu’ils retiennent.",
    exemple: "Exemple : ce que les gens disent de toi autour de toi.",
    champ: "bouche"
  },
  {
    titre: "Repère les signaux qui ne passent pas",
    analogie:
      "Comme un parapluie : si personne n’en veut sous le soleil, ce n’est pas un problème de parapluie.",
    exemple: "Note ce qui revient souvent : questions, silences, incompréhensions.",
    champ: "signaux"
  },
  {
    titre: "Choisis un pilier à corriger",
    analogie:
      "Comme au sport : mieux vaut améliorer une chose chaque semaine que tout changer d’un coup.",
    exemple: "Exemple : la cohérence visuelle, le message clair ou la fréquence.",
    champ: "piliers"
  }
]



const questions = [
  "As-tu les mêmes couleurs et le même logo sur tous tes canaux ?",
  "Publies-tu à une fréquence régulière ?",
  "Un inconnu comprend-il en 10 secondes ce que tu vends et pour qui ?",
  "Ton prix est-il visible sans qu’on ait à te le demander ?",
  "Réponds-tu aux messages clients en quelques heures ?",
  "As-tu demandé à quelqu’un d’extérieur ce qu’il comprend de ta communication ?",
  "Utilises-tu le même ton sur tous tes canaux ?",
  "Sais-tu quels posts ont généré des ventes ?"
]



const taches = [
  "Reprends ta grille d’audit et note ce qui manque.",
  "Choisis un seul pilier à corriger cette semaine.",
  "Demande à une personne extérieure ce qu’elle comprend."
]



function Guide4({ selectedBook, onOpenBook, books, numero }) {
  const [reponses, setReponses] = useState({
    whatsapp: "",
    instagram: "",
    carte: "",
    bouche: "",
    signaux: "",
    piliers: ""
  })



  const [diagnostic, setDiagnostic] = useState(Array(8).fill(null))
  const [tachesFaites, setTachesFaites] = useState(Array(3).fill(false))
  const [etape, setEtape] = useState(0)
  const [scoreFinal, setScoreFinal] = useState(null)
  const [scoreAffiche, setScoreAffiche] = useState(0)
  const [erreur, setErreur] = useState("")



  const resultatRef = useRef(null)



  useEffect(() => {
    const a = localStorage.getItem(`guide4-audit-${numero}`)
    const d = localStorage.getItem(`guide4-diagnostic-${numero}`)
    const t = localStorage.getItem("guide4-taches")
    const s = localStorage.getItem(`guide4-score-${numero}`)



    if (a) setReponses(JSON.parse(a))
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
      `guide4-audit-${numero}`,
      JSON.stringify(nouveau)
    )
  }



  const changerDiagnostic = (index, valeur) => {
    const nouveau = [...diagnostic]
    nouveau[index] = valeur
    setDiagnostic(nouveau)
    localStorage.setItem(
      `guide4-diagnostic-${numero}`,
      JSON.stringify(nouveau)
    )
  }



  const changerTache = (index) => {
    const nouveau = [...tachesFaites]
    nouveau[index] = !nouveau[index]
    setTachesFaites(nouveau)
    localStorage.setItem("guide4-taches", JSON.stringify(nouveau))
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
    localStorage.setItem(`guide4-score-${numero}`, String(total))
    window.dispatchEvent(new Event("guide4-score-change"))



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
              "Ta communication n’est pas encore assez claire. Corrige d’abord ta bio, ton offre visible et la cohérence visuelle."
          }
        : scoreFinal <= 10
          ? {
              niveau: "Continue avec prudence",
              peutContinuer: true,
              texte:
                "Ta communication commence à être cohérente. Choisis un seul pilier à corriger cette semaine."
            }
          : {
              niveau: "Prêt pour le guide suivant",
              peutContinuer: true,
              texte:
                "Ta communication est claire et cohérente. Tu peux passer au guide suivant."
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
    <article className="guide1 guide4">
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
          Comment diagnostiquer la communication de ta jeune entreprise ?
        </h1>


        <p className="guide1-accroche">
          Avant de publier plus, vérifie si ce que tu publies déjà fonctionne.
        </p>
      </header>



      <details className="explication-repliable">
        <summary>Voir l’introduction et ce que tu vas repartir avec</summary>


        <div className="carte intro">
          <p>
            Beaucoup de porteurs de projet pensent que leur problème se
            résout en publiant plus souvent. Mais si le message de base est
            confus, la fréquence ne change rien.
          </p>


          <ul>
            <li>Une grille d’audit de tous tes canaux.</li>
            <li>Les signaux qui montrent qu’un visiteur ne comprend pas.</li>
            <li>Les 3 piliers d’une communication cohérente.</li>
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
              <summary>Voir l’histoire d’Aïda</summary>


              <div className="histoire">
                <strong>Aïda l’a vécu</strong>


                <p>
                  En listant honnêtement ses canaux, Aïda a réalisé que sa bio
                  Instagram ne mentionnait ni ses prix, ni sa zone de
                  livraison, ni même le mot « vêtements ». Corriger seulement
                  cette bio a fait grimper ses messages entrants.
                </p>
              </div>
            </details>
          )}



          {etape === 4 && (
            <details className="explication-repliable">
              <summary>Voir les signaux qui ne passent pas</summary>


              <div className="signaux">
                <div className="signal bon">
                  <h3>Ce qui compte vraiment</h3>


                  <ul>
                    <li>Les messages contiennent déjà les bonnes informations.</li>
                    <li>Des clients te recommandent spontanément.</li>
                    <li>Ton offre et ton prix sont visibles.</li>
                  </ul>
                </div>


                <div className="signal mauvais">
                  <h3>Ce qui ne veut rien dire</h3>


                  <ul>
                    <li>On te pose souvent les mêmes questions de base.</li>
                    <li>Des gens aiment mais ne commandent jamais.</li>
                    <li>Un ami ne sait pas dire ce que tu vends.</li>
                    <li>Tu changes souvent de ton ou de style.</li>
                  </ul>
                </div>
              </div>
            </details>
          )}



          {etape === 5 && (
            <details className="explication-repliable">
              <summary>Voir les 3 piliers d’une communication cohérente</summary>


              <div className="todo">
                <p>1. Visuel constant.</p>


                <p>2. Message clair et répété.</p>


                <p>3. Fréquence tenable.</p>


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



export default Guide4