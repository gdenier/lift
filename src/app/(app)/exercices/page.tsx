import { auth } from "@clerk/nextjs"
import Link from "next/link"
import { redirect } from "next/navigation"
import { buttonVariants } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { db } from "~/lib/db"
import { exercices } from "~/lib/db/schema"

export default async function ExercicesPage() {
  const { userId } = auth()
  if (!userId) redirect("/sign-in")
  const data = await db.select().from(exercices)

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Exercices</CardTitle>
          <CardDescription>
            Liste de tous les exercices. Vous pouvez les consulter et voir les
            détails d&apos;execution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul>
            {data.map((exercice) => (
              <li
                key={exercice.id}
                className="flex w-full items-center justify-between gap-2 rounded border border-transparent p-2 hover:border hover:border-border hover:bg-muted"
              >
                <p className="first-letter:capitalize">{exercice.name}</p>
                <Link
                  href={`/exercices/${exercice.id}`}
                  className={buttonVariants()}
                >
                  Voir
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
