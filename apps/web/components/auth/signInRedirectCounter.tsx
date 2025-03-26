import { useState, useEffect } from "react";
import { redirect } from "next/navigation"
import { Button } from "@workspace/ui/components/button"

export default function RedirectCounter(){

    const title = "Nie znaleźliśmy twojego konta"
    const description = "Załóż konto aby moć korzystać w pełni z naszych usług!"
    const message = "Najpierw utwórz konto!"
  
    // Konstruujemy URL z query params
    const query = new URLSearchParams({
      title,
      description,
      message,
    })

    const [seconds, setSeconds] = useState(5)
    useEffect(() => {
      const interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
  
      return () => clearInterval(interval); // Clean up when the component unmounts
    }, []);

    useEffect( () => {
        setTimeout(() => {
            redirect(`/sign-up?${query.toString()}`)
        }, 5200)
    })

    return (
        <>
            {seconds}
            {seconds == 0 ?
            <Button onClick={() =>  {redirect(`/sign-up?${query.toString()}`)}}>Przejdź na sign-up</Button>
            : ""}
        </>
    )
}