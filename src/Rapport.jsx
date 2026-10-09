import { useState, useEffect } from "react"




function Rapport({ numero, onRetour }) {
  const [scores, setScores] = useState({})
  const [rapport, setRapport] = useState(null)




  useEffect(() => {
    const charger = () => {
      setScores({
        guide1: localStorage.getItem(`guide1-score-${numero}`),
        guide2: localStorage.getItem(`guide2-score-${numero}`),
        guide3: localStorage.getItem(`guide3-score-${numero}`),
        guide4: localStorage.getItem(`guide4-score-${numero}`),
        guide5: localStorage.getItem(`guide5-score-${numero}`)
      })
    }




    charger()
  }, [numero])




  const genererRapport = () => {
    const s = (cle) => parseInt(scores[cle], 10) || 0




    const g1 = s("guide1")
    const g2 = s("guide2")
    const g3 = s("guide3")
    const g4 = s("guide4")
    const g5 = s("guide5")




    const texteGuide1 = () => {
      if (g1 <= 10)
        return `Avec ${g1} points au Guide 1, votre projet dispose encore d’une marge de préparation. L’essentiel est de clarifier votre idée, de définir précisément ce que vous vendez et à qui vous vous adressez. Ce travail de cadrage évitera les hésitations lors du lancement.`
      if (g1 <= 13)
        return `Votre résultat de ${g1} points au Guide 1 montre que votre projet repose sur des bases correctes. L’idée est présente, mais elle gagnerait à être davantage précisée : produit ou service offert, client visé, problème résolu. Cette clarté facilitera toutes les étapes suivantes.`
      return `Avec ${g1} points au Guide 1, votre projet est clairement défini. Vous savez ce que vous proposez et à qui vous vous adressez, ce qui constitue une assise solide pour construire la suite de votre démarche.`
    }




    const texteGuide2 = () => {
      if (g2 <= 10)
        return `Le score de ${g2} au Guide 2 révèle que l’étude de votre environnement mérite davantage d’attention. Avant de vous lancer, prenez le temps d’observer vos concurrents, d’écouter vos futurs clients et de vérifier que votre offre répond à un besoin réel.`
      if (g2 <= 13)
        return `Avec ${g2} points au Guide 2, vous avez une première lecture de votre marché. Pour aller plus loin, rencontrez quelques clients potentiels et comparez votre offre à celle de vos concurrents afin d’affiner votre positionnement.`
      return `Votre score de ${g2} au Guide 2 traduit une bonne compréhension de votre marché. Vous avez identifié des éléments importants de votre environnement, ce qui vous permettra d’aborder la concurrence avec plus de recul.`
    }




    const texteGuide3 = () => {
      if (g3 <= 10)
        return `Le Guide 3 affiche ${g3} points, ce qui invite à renforcer votre préparation opérationnelle. Définissez dès maintenant les étapes concrètes de réalisation : fournisseurs, matériel, démarches et premières actions à mener.`
      if (g3 <= 13)
        return `Avec ${g3} points au Guide 3, votre organisation prend forme. Établissez un planning simple des premières semaines afin de transformer vos idées en actions concrètes et mesurables.`
      return `Votre score de ${g3} au Guide 3 montre une bonne capacité à structurer votre activité. Cette rigueur opérationnelle vous aidera à avancer méthodiquement vers le lancement.`
    }




    const texteGuide4 = () => {
      if (g4 <= 10)
        return `Le score de ${g4} au Guide 4 suggère de renforcer votre préparation financière et administrative. Estimez vos dépenses de départ, identifiez vos sources de financement possibles et renseignez-vous sur les démarches nécessaires.`
      if (g4 <= 13)
        return `Avec ${g4} points au Guide 4, vous avez une vision correcte des aspects pratiques de votre projet. Consolidez cette base en préparant un budget simple et en vérifiant les obligations liées à votre activité.`
      return `Votre score de ${g4} au Guide 4 traduit une bonne maîtrise des aspects organisationnels et financiers. Cette préparation vous donnera davantage de sécurité lors du démarrage.`
    }




    const texteGuide5 = () => {
      if (g5 <= 10)
        return `Le Guide 5 affiche ${g5} points. C’est un domaine à développer, car il peut devenir un véritable atout pour votre projet. Identifiez une ou deux compétences à renforcer en priorité.`
      if (g5 <= 13)
        return `Avec ${g5} points au Guide 5, vous disposez d’un niveau satisfaisant. Continuez à développer cette dimension, car elle pourra devenir un élément de différenciation pour votre activité.`
      return `Votre score de ${g5} au Guide 5 est votre meilleure performance. Cette maîtrise représente un véritable atout : appuyez-vous dessus pour renforcer la crédibilité de votre projet auprès de vos futurs clients et partenaires.`
    }




    const recommandations = []




    const rec = (cle, faible, moyen, fort) => {
      const score = s(cle)
      if (score <= 10) recommandations.push(faible)
      else if (score <= 13) recommandations.push(moyen)
      else recommandations.push(fort)
    }




    rec(
      "guide1",
      "Clarifiez votre offre : ce que vous vendez, à qui, et quel problème vous résolvez.",
      "Précisez votre offre et votre client idéal afin de renforcer la cohérence du projet.",
      "Valorisez la clarté de votre projet dans votre communication et vos échanges."
    )




    rec(
      "guide2",
      "Rencontrez au moins cinq clients potentiels et étudiez trois concurrents avant de vous lancer.",
      "Affinez votre positionnement en comparant votre offre à celle du marché.",
      "Exploitez votre connaissance du marché pour choisir un positionnement différenciant."
    )




    rec(
      "guide3",
      "Établissez un planning simple des 30 premiers jours de votre activité.",
      "Transformez vos idées en actions concrètes avec des échéances précises.",
      "Gardez cette rigueur opérationnelle pour piloter votre lancement."
    )




    rec(
      "guide4",
      "Préparez un budget de départ et renseignez-vous sur les démarches administratives.",
      "Mettez en place un suivi simple de vos dépenses et de vos obligations.",
      "Consolidez votre organisation financière pour sécuriser votre développement."
    )




    rec(
      "guide5",
      "Identifiez une compétence prioritaire à renforcer dans ce domaine.",
      "Continuez à développer cette dimension pour renforcer votre projet.",
      "Faites de cette force un argument central auprès de vos clients et partenaires."
    )




    setRapport({
      introduction:
        "À partir de vos cinq guides d’évaluation, le Cabinet HC a analysé votre niveau de préparation entrepreneuriale. Ce rapport met en lumière vos points d’appui ainsi que les axes à consolider avant le lancement de votre activité au Sénégal.",
      analyse: [
        texteGuide1(),
        texteGuide2(),
        texteGuide3(),
        texteGuide4(),
        texteGuide5()
      ],
      recommandations,
      conclusion:
        "Votre profil montre une base de départ réelle, avec des forces à valoriser et quelques points à renforcer. En travaillant progressivement sur les axes identifiés, vous augmenterez vos chances de réussite. Vous pouvez vous lancer."
    })
  }




  const telecharger = () => {
    window.print()
  }




  return (
    <div className="rapport">
      <div className="barre-retour">
        <button
          type="button"
          className="bouton-retour"
          onClick={onRetour}
        >
          <span className="fleche-retour">←</span>
          Retour
        </button>
      </div>




      <div className="rapport-feuille">
        <p className="rapport-cabinet">CABINET HC</p>



        <p className="rapport-sous-titre">
          Conseil et accompagnement entrepreneurial
        </p>



        <h1>Rapport d’orientation entrepreneuriale</h1>



        <p className="rapport-date">
          Établi le {new Date().toLocaleDateString("fr-FR")}
        </p>




        {rapport ? (
          <div className="rapport-contenu">
            <p className="rapport-intro">{rapport.introduction}</p>




            <h2 className="rapport-titre-section">
              Analyse de vos résultats
            </h2>




            {rapport.analyse.map((texte, index) => (
              <p key={index}>{texte}</p>
            ))}




            <h2 className="rapport-titre-section">
              Recommandations pratiques
            </h2>




            <ul className="rapport-liste">
              {rapport.recommandations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>




            <h2 className="rapport-titre-section">
              Conclusion
            </h2>




            <p>{rapport.conclusion}</p>
          </div>
        ) : (
          <div className="rapport-attente">
            <p>
              Clique sur le bouton ci-dessous pour générer ton analyse
              personnalisée à partir de tes réponses.
            </p>
          </div>
        )}




        <div className="rapport-footer">
          <p>Fait à Dakar, le {new Date().toLocaleDateString("fr-FR")}</p>



          <p className="rapport-signature">Cabinet HC</p>



          <p className="rapport-signature">
            Conseil et accompagnement entrepreneurial
          </p>
        </div>
      </div>




      <button
        type="button"
        className="bouton-ia"
        onClick={genererRapport}
      >
        Générer mon analyse personnalisée
      </button>




      {rapport && (
        <button
          type="button"
          className="bouton-telecharger"
          onClick={telecharger}
        >
          Télécharger mon rapport
        </button>
      )}
    </div>
  )
}




export default Rapport