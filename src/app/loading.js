import LoaderAnimation from "@/components/global/loader-animation"

export default function Loader(){
    return(
      <div className="z-[100] absolute top-0 left-0 w-screen h-screen flex justify-center items-center bg-base-100">
      <div className="relative flex justify-center items-center">
        <span className="bg-gradient-to-r from-primary to-secondary inline-block text-transparent bg-clip-text">
          Loading...
        </span>
      	<LoaderAnimation/>
      <div className="absolute top-[40px] left-1 w-[120px] h-[125px] scale-75 border-[10px] border-primary rotate-45 hidden md:block"></div>
      </div>
      </div>
    )
}
