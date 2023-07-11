import { auth } from "@clerk/nextjs"
import { eq } from "drizzle-orm"
import { ArrowRightSquare } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { AddTrainingDialog } from "~/components/AddTrainingDialog"
import { Timer } from "~/components/Timer"
import { buttonVariants } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { db } from "~/lib/db"
import { createTraining } from "~/lib/db/actions/trainings"
import { trainings } from "~/lib/db/schema/trainings"

export default async function Home() {
  const { userId } = auth()
  if (!userId) redirect("/sign-in")
  const data = await db
    .select()
    .from(trainings)
    .where(eq(trainings.userId, userId))

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Bonjour !</CardTitle>
          <p>Quel entrainement allez-vous faire aujourd&apos;hui ?</p>
        </CardHeader>
      </Card>
      <Card className="mt-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Mes entrainements</CardTitle>
          <AddTrainingDialog onSubmit={createTraining} />
        </CardHeader>
        <CardContent>
          {!data.length ? (
            <p>Pas encore d&apos;entrainement</p>
          ) : (
            <ul>
              {data.map((training) => (
                <li
                  key={training.id}
                  className="flex w-full items-center justify-between"
                >
                  <p>{training.title}</p>
                  <Link
                    href={`/trainings/${training.id}`}
                    className={buttonVariants({ size: "icon" })}
                  >
                    <ArrowRightSquare className="h-5 w-5" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Timer</CardTitle>
        </CardHeader>
        <CardContent>
          <Timer />
        </CardContent>
      </Card>
    </div>
  )
}
