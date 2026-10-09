export default async (request) => {
  const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID
  const AIRTABLE_TABLE_NAME = "Workbook responses"

  const json = (data, status = 200) => {
    return new Response(JSON.stringify(data), {
      status,
      headers: {
        "Content-Type": "application/json"
      }
    })
  }

  try {
    const body = await request.json()

    const whatsappNumber = String(body.whatsappNumber || "").replace(/\D/g, "")

    if (!whatsappNumber || whatsappNumber.length < 8) {
      return json(
        {
          saved: false,
          message: "Numéro WhatsApp invalide."
        },
        400
      )
    }

    const pointDeDepart = String(body.pointDeDepart || "").trim()
    const prochainPas = String(body.prochainPas || "").trim()
    const actionsSemaine = String(body.actionsSemaine || "").trim()

    const fields = {
      WhatsApp: whatsappNumber,
      "Point de départ": pointDeDepart,
      "Prochain pas": prochainPas,
      "Actions de la semaine": actionsSemaine
    }

    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
      AIRTABLE_TABLE_NAME
    )}`

    const airtableResponse = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fields
      })
    })

    if (!airtableResponse.ok) {
      return json(
        {
          saved: false,
          message: "Impossible d’enregistrer tes réponses dans Airtable."
        },
        500
      )
    }

    return json({
      saved: true,
      message: "Tes réponses ont bien été enregistrées."
    })
  } catch (error) {
    return json(
      {
        saved: false,
        message: "Erreur lors de l’enregistrement."
      },
      500
    )
  }
}