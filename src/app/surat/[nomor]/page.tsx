import EquranSurat from '@/app/_ui/EquranSurat';

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
    <EquranSurat 
      surahData={json.data}
      selectedReciter="03"
    />
  );
}