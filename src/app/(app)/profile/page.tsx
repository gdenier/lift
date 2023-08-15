import { auth, currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { db } from "~/lib/db"
import { formatUsername, formatWeight } from "~/lib/utils"
import { AddProfileWeightForm } from "./AddProfileWeightForm"
import { createWeight } from "~/lib/db/actions/profiles"
import { WeightChart } from "./WeightChart"
import { Button } from "~/components/ui/button"

export default async function ProfilePage() {
  const { userId } = auth()
  const user = await currentUser()
  if (!userId || !user) redirect("/sign-in")

  const data = await db.query.profile_weights.findMany({
    where: (profile_weights, { eq }) => eq(profile_weights.userId, userId),
    limit: 20,
    orderBy: (profile_weights, { asc }) => [asc(profile_weights.date)],
  })

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{formatUsername(user)}</CardTitle>
          <CardDescription>
            Retrouvez ici toutes les informations pour suivre votre évolution.
          </CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Poids</CardTitle>
          <div className="flex gap-1">
            <AddProfileWeightForm onSubmit={createWeight} />
            <Button variant="outline">Voir les données</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-60 w-full  rounded">
            <WeightChart data={data} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
