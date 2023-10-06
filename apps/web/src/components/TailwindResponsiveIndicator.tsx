import { ReactElement } from "react"
import { env } from "~/env.mjs"

export const TailwindResponsiveIndicator = (): ReactElement | null => {
  if (env.NODE_ENV === "development")
    return (
      <div className="absolute bottom-2 right-2">
        <p className="rounded bg-primary p-2 text-sm text-primary-foreground sm:hidden">
          Base
        </p>
        <p className="hidden rounded bg-primary p-2 text-sm text-primary-foreground sm:inline md:hidden">
          SM
        </p>
        <p className="hidden rounded bg-primary p-2 text-sm text-primary-foreground md:inline lg:hidden">
          MD
        </p>
        <p className="hidden rounded bg-primary p-2 text-sm text-primary-foreground lg:inline xl:hidden">
          LG
        </p>
        <p className="hidden rounded bg-primary p-2 text-sm text-primary-foreground xl:inline">
          XL
        </p>
      </div>
    )

  return null
}
