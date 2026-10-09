import Airtable from "airtable"

const cleanNumber = (value) => {
  return String(value || "").replace(/\D/g, "")
}

export default async (request) => {
  try {
    const apiKey = Deno.env.get("AIRTABLE_TOKEN")
    const baseId = Deno.env.get("AIRTABLE_BASE_ID")
    const tableName = Deno.env.get("AIRTABLE_TABLE_NAME")

    if (!apiKey || !baseId || !tableName) {
      console.error("Variable Airtable manquante dans Netlify.")
      return new Response(
        JSON.stringify({
          authorized: false,
          message: "La configuration du service est incomplète."
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      )
    }

    const airtable = new Airtable({ apiKey })
    const base = airtable.base(baseId)

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

    const records = await base(tableName)
      .select({ maxRecords: 100 })
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
    console.error("Erreur de vérification Airtable :", error)
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
