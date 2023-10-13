"use client"

import { ReactElement, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"

export const InstallAppCard = (): ReactElement | null => {
  const [show, setShow] = useState(
    JSON.parse(localStorage.getItem("show-install") ?? "true")
  )

  const handleResponse = (res: boolean) => {
    if (!res) {
      localStorage.setItem("show-install", "false")
      setShow(false)
    }
    console.log("show installation setup")
  }

  if (!show) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Installer l&apos;application</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Saviez-vous que vous pouviez installer cette application web sans
          utiliser le store d&apos;application ?
        </p>
        <p>
          Pour cela il vous suffit d&apos;ajouter sur l&apos;écran
          d&apos;acceuil.
        </p>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="secondary" onClick={() => handleResponse(false)}>
          Ne plus voir
        </Button>
        <Button onClick={() => handleResponse(true)}>
          Voir la marche à suivre
        </Button>
      </CardFooter>
    </Card>
  )
}
