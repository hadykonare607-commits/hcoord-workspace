import Airtable from "airtable"

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_TOKEN
})

const base = airtable.base(process.env.AIRTABLE_BASE_ID)

const cleanNumber = (value) => {
  return String(value || "").replace(/\D/g, "")
}

export default async (request) => {
  try {
    const body = await request.json()
    const whatsappNumber = cleanNumber(body.whatsappNumber)

    if (!whatsappNumber || whatsappNumber.length < 8) {
      return new Response(
        JSON.stringify({
          authorized: false,
          message: "Entre un numéro WhatsApp valide."
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      )
    }

    const records = await base(process.env.AIRTABLE_TABLE_NAME)
      .select({
        maxRecords: 100
      })
      .firstPage()

    const member = records.find((record) => {
      const savedNumber = cleanNumber(record.fields["WhatsApp"])
      return savedNumber === whatsappNumber
    })

    if (!member) {
      return new Response(
        JSON.stringify({
          authorized: false,
          message: "Ce numéro WhatsApp n’est pas encore enregistré dans la communauté."
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" }
        }
      )
    }

    const hasWorkspaceAccess = member.fields["Accès workspace"] === true
    const status = member.fields["Statut d’accès"]
    const isAuthorized = hasWorkspaceAccess && status === "Autorisé"

    if (!isAuthorized) {
      return new Response(
        JSON.stringify({
          authorized: false,
          message: "Ton numéro est enregistré, mais l’accès au workspace n’est pas encore activé."
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" }
        }
      )
    }

    return new Response(
      JSON.stringify({
        authorized: true,
        message: "Accès confirmé.",
        firstName: member.fields["Prénom et nom"]
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        authorized: false,
        message: "Erreur lors de la vérification de l’accès."
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    )
  }
}