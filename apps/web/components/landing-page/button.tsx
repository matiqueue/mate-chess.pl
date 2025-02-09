import { gsap } from "gsap"
import { useRef } from "react"
import styles from "@/styles/landing-page/button.module.css"
import { useRouter } from "next/navigation"
import { Smooch_Sans } from "next/font/google"

const smooch_sans = Smooch_Sans({
  subsets: ["latin"],
  weight: ["600", "700"],
})

const Button = () => {
  const buttonRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const handleClick = () => {
    const timeLine = gsap.timeline({
      paused: false,
    })

    timeLine
      .to(buttonRef.current, {
        duration: 0.6,
        opacity: 0.9,
        background: "linear-gradient(90deg, #c0c0c0, #000)", // Gradient srebrno-czarny
        boxShadow: "0px 0px 20px 5px rgba(192, 192, 192, 0.8)", // Srebrna poświata
      })
      .to(buttonRef.current, {
        duration: 0.8,
        height: 0.2,
        opacity: 0.8,
        background: "linear-gradient(90deg, #c0c0c0, #000)", // Gradient srebrno-czarny
        boxShadow: "0px 0px 30px 10px rgba(192, 192, 192, 0.9)", // Silniejszy srebrny cień
        fontSize: 0,
        delay: 0.25,
      })
      .to(buttonRef.current, {
        duration: 0.1,
        opacity: 1,
        background: "#000", // Pełne czarne tło
      })
      .to(buttonRef.current, 0, {
        width: 2,
        delay: 0.2,
      })
      .to(buttonRef.current, 0.1, {
        boxShadow: "0px 0px 50px 25px rgba(192, 192, 192, 0.7)", // Mocniejsza srebrna poświata
        y: 90,
        height: 100,
        delay: 0.23,
      })
      .to(buttonRef.current, 0.3, {
        height: 1000, // Kreska rośnie na ekranie
        y: -1500, // Unosi się do góry
        boxShadow: "0px 0px 75px 25px rgba(192, 192, 192, 0.6)", // Subtelna srebrna poświata
        background: "linear-gradient(90deg, #000, #c0c0c0)", // Gradient powraca do srebrno-czarnego
        delay: 0.2,
      })
      .then(() => {
        router.push("/home")
      })
  }
  return (
    <div ref={buttonRef} onClick={handleClick} className={styles.button}>
      <p className={`${smooch_sans.className} button-text`}>PLAY MATE-CHESS</p>
    </div>
  )
}

export default Button
