const GUIDES = [
  "Guide 1 - Tester son idée avant d'investir (problème, cible, solution, signaux de demande)",
  "Guide 2 - Définir ses premières cibles (portrait précis, quartier, canal, budget, déclencheur d'achat)",
  "Guide 3 - Construire son positionnement (phrase de positionnement, différenciation, test sur 5 personnes)",
  "Guide 4 - Diagnostiquer sa communication (WhatsApp, Instagram, cohérence, clarté de l'offre)",
  "Guide 5 - Lancer avec un petit budget (tri des dépenses, leviers gratuits, réinvestissement)"
]

const SCHEMA = {
  type: "OBJECT",
  properties: {
    introduction: { type: "STRING" },
    analyse: { type: "ARRAY", items: { type: "STRING" } },
    recommandations: { type: "ARRAY", items: { type: "STRING" } },
    conclusion: { type: "STRING" }
  },
  required: ["introduction", "analyse", "recommandations", "conclusion"]
}

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return Response.json({ error: "GEMINI_API_KEY manquante" }, { status: 500 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "Requête invalide" }, { status: 400 })
  }

  const { scores, reponses } = body
  if (!scores || !reponses) {
    return Response.json({ error: "Données manquantes" }, { status: 400 })
  }

  const donnees = GUIDES.map((titre, i) => {
    const n = i + 1
    return {
      guide: titre,
      score: scores[`guide${n}`],
      sur: 16,
      reponses_ecrites: reponses[`guide${n}`] || {}
    }
  })

  const prompt = `Tu es consultant au Cabinet HC (Dakar, Sénégal), spécialisé dans l'accompagnement de porteurs de projet.
Rédige un rapport d'orientation entrepreneuriale personnalisé, en français, en vouvoyant le lecteur.

Règles :
- Appuie-toi sur les réponses écrites de la personne : cite ses idées, sa cible, son quartier, sa phrase de positionnement, etc. Rien de générique.
- Barème de chaque guide (sur 16) : 0-5 = à reprendre, 6-10 = à consolider, 11-16 = solide.
- Si une réponse écrite est vide, dis-le simplement et invite à la compléter. N'invente aucun fait.
- Ton professionnel, bienveillant, concret, adapté au contexte sénégalais (FCFA, WhatsApp, Mobile Money...).
- Ne promets aucun succès. La conclusion donne un avis nuancé selon les scores, pas un "vous pouvez vous lancer" automatique.
- "analyse" : exactement 5 paragraphes (un par guide, dans l'ordre), 3 à 5 phrases chacun.
- "recommandations" : exactement 5 actions concrètes (une par guide, dans l'ordre), 1 à 2 phrases.
- "introduction" : 2 à 3 phrases. "conclusion" : 3 à 4 phrases.
- Pas de markdown, texte brut uniquement.

Données de la personne :
${JSON.stringify(donnees, null, 2)}`

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash"

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json",
            responseSchema: SCHEMA,
            thinkingConfig: { thinkingBudget: 0 }
          }
        })
      }
    )

    const data = await res.json()
    if (!res.ok) {
      return Response.json(
        { error: data?.error?.message || "Erreur Gemini" },
        { status: res.status }
      )
    }

    const texte = data.candidates?.[0]?.content?.parts
      ?.map((p) => p.text)
      .join("")
    const rapport = JSON.parse(texte)

    return Response.json({ rapport })
  } catch (e) {
    return Response.json(
      { error: "Impossible de générer le rapport pour le moment." },
      { status: 500 }
    )
  }
}