import LoaderAnimation from "@/components/global/loader-animation"

export default function Loader(){
    return(
      <div className="z-[100] absolute top-0 left-0 w-screen h-screen flex justify-center items-center bg-base-100">
      <div className="relative flex justify-center items-center">
      	<LoaderAnimation/>
      <div className="absolute top-[40px] left-1 w-[120px] h-[125px] scale-75 border-[10px] border-primary rotate-45"></div>
      </div>
      </div>
    )
}
