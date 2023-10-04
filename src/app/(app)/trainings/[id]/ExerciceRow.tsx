import { TrainingStep } from "~/lib/db/schema"
import { formatTime, formatWeight } from "~/lib/utils"

export const ExerciceRow = ({ step }: { step: TrainingStep }) => {
  return (
    <li className="flex flex-col gap-4">
      <div className="grid grid-cols-[auto_1fr] gap-x-4">
        <p className=" row-span-2 flex aspect-square h-10 w-10 shrink-0 items-center justify-center place-self-center rounded bg-primary text-primary-foreground">
          {step.order + 1}
        </p>
        <p className="text-lg font-bold first-letter:uppercase">
          {step.exercice?.exercice.name}
        </p>
        <p className="col-start-2 text-muted-foreground first-letter:uppercase">
          type of muscle
        </p>
      </div>

      <div className="flex flex-col gap-2 md:pl-14">
        {step?.exercice?.series?.map((serie) => (
          <div
            key={serie.id}
            className="flex w-full max-w-md justify-between gap-2 md:gap-4"
          >
            <p className="row-span-2 flex aspect-square h-6 w-6 shrink-0 items-center justify-center place-self-center rounded bg-secondary text-secondary-foreground">
              {serie.order + 1}
            </p>
            <p className="flex-1">
              {serie.repetition ??
                (serie.time ? formatTime(serie.time) : "none")}
            </p>
            <p className="flex-1">{formatWeight(serie.weight ?? 0)}</p>
            <p className="flex-1">{formatTime(serie.rest ?? 0)}</p>
          </div>
        ))}
      </div>
    </li>
  )
}
