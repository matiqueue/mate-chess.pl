import Image from "next/image"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full">
      <div className="flex-1 flex flex-col">
        <div className="relative flex w-full h-[90vh] items-center justify-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0 ">
              <Image
              src="/backgrounds/sign-in-background.webp"
              alt="Background"
              fill
              className="object-cover opacity-10 rounded-[70%_10%_90%_15%_/25%_60%_35%_50%]"
              priority
              />
          </div>
              {children}
          </div>
      </div>
    </div>
  )
}