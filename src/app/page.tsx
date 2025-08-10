import EquranApp from "./_ui/EquranApp";

export default async function Page() {
  const res = await fetch("https://equran.id/api/v2/surat", {
    next: { revalidate: 86400 } // cache for 1 day
  });

  const json = await res.json();

  return (
    <EquranApp surahs={json.data} />
  );
}