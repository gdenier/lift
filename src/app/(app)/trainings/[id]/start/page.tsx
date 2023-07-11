import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { NotFound } from "~/components/NotFound"
import { db } from "~/lib/db"

export default async function StartTrainingPage({
  params,
}: {
  params: { id: string }
}) {
  const { userId } = auth()
  if (!userId) redirect("/sign-in")
  const training = await db.query.trainings.findFirst({
    with: {
      trainings_exercices: {
        with: {
          exercice: true,
          series: true,
        },
        orderBy: (trainings_exercices, { asc }) => [
          asc(trainings_exercices.order),
        ],
      },
    },
    where: (trainings, { eq, and }) =>
      and(eq(trainings.id, params.id), eq(trainings.userId, userId)),
  })

  if (!training) return <NotFound />

  return <h1>StartTrainingPage</h1>
}
