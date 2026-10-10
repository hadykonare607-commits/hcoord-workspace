export default async () => {
  return new Response(
    JSON.stringify({
      authorized: true,
      message: "Accès ouvert."
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  )
}
