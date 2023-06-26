"use client"
import { useState } from "react"
import { useSignIn } from "@clerk/nextjs"
import { useRouter } from "next/router"
import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"

export default function SignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const [emailAddress, setEmailAddress] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  // start the sign In process.
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!isLoaded) {
      return
    }

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (result.status === "complete") {
        console.log(result)
        await setActive({ session: result.createdSessionId })
        router.push("/")
      } else {
        /*Investigate why the login hasn't completed */
        console.log(result)
      }
    } catch (err: any) {
      console.error("error", err.errors[0].longMessage)
    }
  }

  return (
    <div>
      <form>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            onChange={(e) => setEmailAddress(e.target.value)}
            id="email"
            name="email"
            type="email"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            name="password"
            type="password"
          />
        </div>
        <Button onClick={handleSubmit}>Sign In</Button>
      </form>
    </div>
  )
}
