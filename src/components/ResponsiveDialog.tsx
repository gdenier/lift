import { ReactElement, ReactNode } from "react"
import { SheetTrigger, Sheet, SheetContent } from "./ui/sheet"
import { Button } from "./ui/button"

export interface ResponsiveDialogProps {
  label: ReactNode
  panel: ReactNode
}

export const ResponsiveDialog = ({
  label,
  panel,
}: ResponsiveDialogProps): ReactElement => {
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="hidden w-full justify-start md:flex"
          >
            {label}
          </Button>
        </SheetTrigger>
        <SheetContent
          className="flex flex-col justify-between max-md:max-h-[90dvh] md:max-w-md"
          side="right"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {panel}
        </SheetContent>
      </Sheet>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="flex w-full justify-start md:hidden"
          >
            {label}
          </Button>
        </SheetTrigger>
        <SheetContent
          className="flex flex-col justify-between max-md:max-h-[90dvh] md:max-w-md"
          side="bottom"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {panel}
        </SheetContent>
      </Sheet>
    </>
  )
}
