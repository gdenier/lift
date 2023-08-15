import { toast } from "react-hot-toast"
import useSound from "use-sound"

export type NotifyProps =
  | {
      type: "success" | "error" | "loading"
      message: string
    }
  | {
      type: "promise"
      promise: Promise<unknown>
      loading: string
      success: string | ((data: unknown) => string)
      error: string | ((error: Error) => string)
    }

export const useNotify = () => {
  const [playSuccess] = useSound("/media/sound/success.mp3")

  return ({ type, ...props }: NotifyProps) => {
    if (type !== "promise" && "message" in props) {
      toast[type](props.message, {
        duration: 5000,
        position: "bottom-right",
      })
    }
    if (type === "promise" && "promise" in props) {
      toast.promise(props.promise, props)
      props.promise.then(() => playSuccess?.())
    }
  }
}
