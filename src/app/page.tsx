import { db } from "~/lib/db"
import { exercices } from "~/lib/db/schema/exercice"

export default async function Home() {
  const data = await db.select().from(exercices)

  return (
    <div>
      {!data.length ? "No data in db" : null}
      {data.map((exo) => (
        <p key={exo.id}>{exo.name}</p>
      ))}
    </div>
  )
}
