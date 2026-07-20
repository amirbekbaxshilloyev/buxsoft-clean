import { getCmsData } from "@/services/cms";
import { BuxSoftApp } from "@/sections/BuxSoftApp";

/* ISR: sahifa serverda keshlanadi va har `revalidate` soniyada FONDA yangilanadi.
   Foydalanuvchi HAR DOIM tayyor keshni oladi (~0.1s) — sekin Apps Script chaqiruvi
   (4–6s) endi har zaprosда emas, 60 soniyada bir marta fonda bajariladi.
   Sheet'da o'zgarish ~60s ichida saytda aks etadi. */
export const revalidate = 60;

export default async function Home() {
  const data = await getCmsData();
  return <BuxSoftApp data={data} />;
}
