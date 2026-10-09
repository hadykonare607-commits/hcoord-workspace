export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" })
  }



  const { reponses } = req.body



  if (!reponses) {
    return res.status(400).json({ error: "Réponses manquantes" })
  }



  const prompt = `
Tu es un conseiller en entrepreneuriat du Cabinet HC.
Analyse les réponses suivantes d’un porteur de projet au Sénégal
et rédige un rapport d’orientation entrepreneuriale professionnel,
fluide, logique et personnalisé.


Réponses du client :
${JSON.stringify(reponses, null, 2)}


Consignes :
- Écris en français professionnel.
- Ne invente pas de données absentes.
- Sois encourageant mais réaliste.
- Termine par : « Vous pouvez vous lancer. »
`



 const modeles = [
  "gemini-3.8-flash",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash"
]



  for (const modele of modeles) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modele}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": process.env.GEMINI_API_KEY
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt
                  }
                ]
              }
            ]
          })
        }
      )



      const data = await response.json()



      if (!response.ok) {
        console.log("Erreur Gemini :", modele, data)
        continue
      }



      const texte =
        data?.candidates?.[0]?.content?.parts?.[0]?.text



      if (texte) {
        return res.status(200).json({ rapport: texte })
      }
    } catch (error) {
      console.log("Erreur réseau Gemini :", error)
    }
  }



  return res.status(500).json({
    error: "Impossible de générer le rapport pour le moment."
  })
}
