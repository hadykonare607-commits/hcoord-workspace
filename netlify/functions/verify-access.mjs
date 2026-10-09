export default async (request) => {
  const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID
  const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME

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

    const cleanNumber = (value) => {
      return String(value || "").replace(/\D/g, "")
    }

    const whatsappNumber = cleanNumber(body.whatsappNumber)

    if (!whatsappNumber || whatsappNumber.length < 8) {
      return json(
        {
          authorized: false,
          message: "Entre un numéro WhatsApp valide."
        },
        400
      )
    }

    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
      AIRTABLE_TABLE_NAME
    )}?maxRecords=100`

    const airtableResponse = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`
      }
    })

    if (!airtableResponse.ok) {
      return json(
        {
          authorized: false,
          message: "Erreur de connexion à Airtable."
        },
        500
      )
    }

    const airtableData = await airtableResponse.json()

    const member = airtableData.records.find((record) => {
      const savedNumber = cleanNumber(
        record.fields && record.fields["WhatsApp"]
      )

      return savedNumber === whatsappNumber
    })

    if (!member) {
      return json(
        {
          authorized: false,
          message:
            "Ce numéro WhatsApp n’est pas encore enregistré dans la communauté."
        },
        403
      )
    }

    const hasWorkspaceAccess =
      member.fields["Accès workspace"] === true

    const status = member.fields["Statut d’accès"]

    const isAuthorized =
      hasWorkspaceAccess && status === "Autorisé"

    if (!isAuthorized) {
      return json(
        {
          authorized: false,
          message:
            "Ton numéro est enregistré, mais l’accès au workspace n’est pas encore activé."
        },
        403
      )
    }

    return json({
      authorized: true,
      message: "Accès confirmé.",
      firstName: member.fields["Prénom et nom"]
    })
  } catch (error) {
    return json(
      {
        authorized: false,
        message: "Erreur lors de la vérification de l’accès."
      },
      500
    )
  }
}