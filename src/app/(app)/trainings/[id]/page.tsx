import { auth } from "@clerk/nextjs"
import { Edit, History, Timer } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { NotFound } from "~/components/NotFound"
import { WeightIcon } from "~/components/icons/WeightIcon"
import { buttonVariants } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { db } from "~/lib/db"
import { TrainingExercice } from "~/lib/db/schema"
import { cn, formatTime, formatWeight } from "~/lib/utils"

export default async function TrainingPage({
  params,
}: {
  params: { id: string }
}) {
  const { userId } = auth()
  if (!userId) redirect("/sign-in")
  const training = await db.query.trainings.findFirst({
    with: {
      sessions: {
        orderBy: (sessions, { desc }) => [desc(sessions.createdAt)],
      },
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

  return (
    <div className="w-full">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>{training.title}</CardTitle>
          <Link
            href={`/trainings/${params.id}/edit`}
            className={buttonVariants()}
          >
            <Edit />
            Modifier
          </Link>
        </CardHeader>
        <CardContent className="flex flex-wrap justify-between gap-2">
          <p>Réalisé {training.sessions.length} fois</p>
          {training.sessions[0]?.createdAt ? (
            <p>
              Réalisé {training.sessions[0]?.createdAt.toLocaleString()} la
              derniere fois
            </p>
          ) : null}
          <p>{training.trainings_exercices.length} exercice(s)</p>
          <p>
            {training.trainings_exercices.reduce(
              (total, tExercice) => total + tExercice.series.length,
              0
            )}{" "}
            série(s)
          </p>
          <p>
            {formatWeight(
              training.trainings_exercices.reduce(
                (total, tExercice) =>
                  total +
                  tExercice.series.reduce(
                    (tWeight, serie) =>
                      tWeight + (serie?.weight ?? 0) * serie.repetition,
                    0
                  ),
                0
              )
            )}{" "}
            soulevé
          </p>
          <p>
            ~
            {formatTime(
              training.trainings_exercices.reduce(
                (total, tExercice) =>
                  total +
                  tExercice.series.reduce(
                    // 60 represent the average execution time
                    // TODO: set default time on account level
                    (tTime, serie) => tTime + (serie?.rest ?? 120) + 60,
                    0
                  ),
                0
              )
            )}{" "}
            d&apos;entrainement
          </p>
        </CardContent>
      </Card>

      <Card className="mt-2">
        <CardHeader>
          <CardTitle>Exercices</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-4">
            {training.trainings_exercices.map((tExercice) => (
              <ExerciceRow key={tExercice.id} tExercice={tExercice} />
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

const ExerciceRow = ({ tExercice }: { tExercice: TrainingExercice }) => {
  const series = tExercice.series.sort((a, b) => a.order - b.order)

  return (
    <li className="flex flex-col gap-4">
      <div className="grid grid-cols-[auto_1fr] gap-x-4">
        <p className=" row-span-2 flex aspect-square h-10 w-10 shrink-0 items-center justify-center place-self-center rounded bg-primary text-primary-foreground">
          {tExercice.order}
        </p>
        <p className="text-lg font-bold first-letter:uppercase">
          {tExercice.exercice.name}
        </p>
        <p className="col-start-2 text-muted-foreground first-letter:uppercase">
          type of muscle
        </p>
      </div>

      {series.map((serie, index) => (
        <div
          key={`serie-${serie.id}${index}`}
          className="flex w-full max-w-md justify-between gap-2 md:gap-4 md:pl-14"
        >
          <p className="row-span-2 flex aspect-square h-6 w-6 shrink-0 items-center justify-center place-self-center rounded bg-secondary text-secondary-foreground">
            {serie.order}
          </p>
          <p className="flex-1">{serie.repetition}</p>
          <p className="flex-1">{formatWeight(serie.weight ?? 0)}</p>
          <p className="flex-1">{formatTime(serie.rest)}</p>
        </div>
      ))}
    </li>
  )
}
