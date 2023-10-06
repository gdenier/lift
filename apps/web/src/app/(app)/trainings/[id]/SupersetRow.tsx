import { TrainingStep } from "~/lib/db/schema"
import { formatTime, formatWeight } from "~/lib/utils"

export const SupersetRow = ({ step }: { step: TrainingStep }) => {
  return (
    <li>
      <div className="flex gap-4">
        <p className=" row-span-2 flex aspect-square h-10 w-10 shrink-0 items-center justify-center place-self-center rounded bg-primary text-primary-foreground">
          {step.order + 1}
        </p>
        <p className="text-lg font-bold first-letter:uppercase">
          Superset ({formatTime(step.superset?.rest ?? 0)} entre round)
        </p>
      </div>
      <div className="flex flex-col gap-4 md:pl-14">
        {step.superset?.exercices?.map((exercice) => (
          <div key={`${exercice.id}`}>
            <p className="font-bold first-letter:uppercase">
              {exercice.exercice.name}
            </p>
            <div className="flex flex-col gap-2">
              {exercice.series?.map((serie, index) => (
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
                  {index !== exercice.series?.length ? (
                    <p className="flex-1">
                      {formatTime(step.superset?.intervalRest ?? 0)}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </li>
  )
}
