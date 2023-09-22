import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { NotFound } from "~/components/NotFound"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { getTraining } from "~/lib/db/actions/trainings.actions.old"
import {
  Exercice,
  Serie,
  TrainingExercice,
  TrainingSuperset,
} from "~/lib/db/schema"
import { formatTime, formatWeight } from "~/lib/utils"
import { TrainingHeader } from "./TrainingHeader"

export default async function TrainingPage({
  params,
}: {
  params: { id: string }
}) {
  const { userId } = auth()
  if (!userId) redirect("/sign-in")
  const training = await getTraining(params.id, userId)

  const rows: (TrainingExercice | TrainingSuperset)[] = []
  training?.trainings_exercices.forEach((tExercice) =>
    rows.splice(tExercice.order - 1, 0, tExercice)
  )
  training.trainings_supersets.forEach((superset) =>
    rows.splice(superset.order - 1, 0, superset)
  )

  if (!training) return <NotFound />

  return (
    <div className="w-full">
      <TrainingHeader training={training} />

      <Card className="mt-2">
        <CardHeader>
          <CardTitle>Exercices</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-4">
            {rows.map((row, index) =>
              "rounds" in row ? (
                <SupersetRow key={row.id} superset={row} index={index} />
              ) : (
                <ExerciceRow key={row.id} tExercice={row} />
              )
            )}
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

      <div className="flex flex-col gap-2 md:pl-14">
        {series.map((serie, index) => (
          <ExerciceSerieDetail
            serie={serie}
            key={`serie-${serie.id}${index}`}
          />
        ))}
      </div>
    </li>
  )
}

const SupersetRow = ({
  superset,
  index,
}: {
  superset: TrainingSuperset
  index: number
}) => {
  const exercices = superset.exercices.sort((a, b) => a.order - b.order)

  return (
    <li>
      <div className="flex gap-4">
        <p className=" row-span-2 flex aspect-square h-10 w-10 shrink-0 items-center justify-center place-self-center rounded bg-primary text-primary-foreground">
          {superset.order}
        </p>
        <p className="text-lg font-bold first-letter:uppercase">
          Superset {index}
        </p>
      </div>
      <div className="flex flex-col gap-4 md:pl-14">
        {exercices.map((exercice) => (
          <div key={`${superset.id}${exercice.id}`}>
            <p className="font-bold first-letter:uppercase">
              {exercice.exercice.name}
            </p>
            <div className="flex flex-col gap-2">
              {superset.rounds.map((round) => {
                const serie = round.series.find(
                  (s) => s.order === exercice.order
                )
                if (!serie) return null
                return (
                  <ExerciceSerieDetail
                    serie={serie}
                    key={`${round.id}${exercice.id}`}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </li>
  )
}

const ExerciceSerieDetail = ({ serie }: { serie: Serie }) => {
  return (
    <div className="flex w-full max-w-md justify-between gap-2 md:gap-4">
      <p className="row-span-2 flex aspect-square h-6 w-6 shrink-0 items-center justify-center place-self-center rounded bg-secondary text-secondary-foreground">
        {serie.order}
      </p>
      <p className="flex-1">
        {serie.repetition ?? (serie.time ? formatTime(serie.time) : "none")}
      </p>
      <p className="flex-1">{formatWeight(serie.weight ?? 0)}</p>
      {"rest" in serie ? (
        <p className="flex-1">{formatTime(serie.rest)}</p>
      ) : null}
    </div>
  )
}
