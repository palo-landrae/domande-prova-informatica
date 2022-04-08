import { prisma } from "./prisma";

export default async function handle(req, res) {
  const domande = await prisma.domande.aggregateRaw({
    pipeline: [{ $sample: { size: 9 } }],
  });
  res.json(domande);
}
