export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Méthode non autorisée" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    )
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response(
      JSON.stringify({ error: "Corps de requête invalide" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }

  const { reponses } = body
  if (!reponses) {
    return new Response(
      JSON.stringify({ error: "Réponses manquantes" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }

  const cle = process.env.GEMINI_API_KEY
  if (!cle) {
    return new Response(
      JSON.stringify({ error: "Clé GEMINI_API_KEY manquante." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }

  const scores = reponses.scores || {}

  const prompt = `
Tu es un conseiller en entrepreneuriat du Cabinet HC au Sénégal.
Analyse les scores suivants et rédige un rapport d’orientation entrepreneuriale.

Scores :
Guide 1: ${scores.guide1 || "N/A"}
Guide 2: ${scores.guide2 || "N/A"}
Guide 3: ${scores.guide3 || "N/A"}
Guide 4: ${scores.guide4 || "N/A"}
Guide 5: ${scores.guide5 || "N/A"}

Réponds UNIQUEMENT avec un JSON valide, sans texte avant ou après, au format exact :
{
  "introduction": "2 phrases d’introduction.",
  "analyse": "Analyse des scores en 1 paragraphe.",
  "synthese": "Synthèse du profil en 1 paragraphe.",
  "recommandations": ["Recommandation 1", "Recommandation 2", "Recommandation 3"],
  "conclusion": "Conclusion courte se terminant par : Vous pouvez vous lancer."
}

Consignes :
- Français professionnel.
- Maximum 250 mots au total.
- Sois encourageant mais réaliste.
- Aucun Markdown, aucun **, *, ###, ---.
`

  try {
    const response = await fetch(
     "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": cle
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 800,
            temperature: 0.7
          }
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: data?.error?.message || "Erreur Gemini",
          details: data
        }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      )
    }

    const texte = data?.candidates?.[0]?.content?.parts?.[0]?.text || ""

    if (!texte) {
      return new Response(
        JSON.stringify({ error: "Gemini n’a pas renvoyé de texte.", details: data }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }

    const debut = texte.indexOf("{")
    const fin = texte.lastIndexOf("}")
    let rapport = null

    if (debut !== -1 && fin !== -1) {
      try {
        rapport = JSON.parse(texte.slice(debut, fin + 1))
      } catch {
        rapport = null
      }
    }

    return new Response(
      JSON.stringify({ rapport, texteBrut: texte }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Erreur réseau vers Gemini.", details: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}