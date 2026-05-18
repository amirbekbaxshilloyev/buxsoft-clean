import { getCmsData } from "@/services/cms";
import { BuxSoftApp } from "@/sections/BuxSoftApp";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getCmsData();
  return <BuxSoftApp data={data} />;
}
