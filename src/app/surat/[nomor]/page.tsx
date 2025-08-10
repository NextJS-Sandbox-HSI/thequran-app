export default async function Page({
  params,
}: {
  params: Promise<{ nomor: string }>
}) {
  const { nomor } = await params

  const res = await fetch(`https://equran.id/api/v2/surat/${nomor}`, {
    next: { revalidate: 86400 } // cache for 1 day
  })

  const json = await res.json()
 
  return (
    <pre>{JSON.stringify(json.data, null, 2)}</pre>
  );
}