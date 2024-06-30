import Image from 'next/image'
import CarouselSection from "./carousel-sections";
import UserTime from "./user-time"
import { RiTimerFlashLine } from "react-icons/ri";



function DetailsBox({data, relatable, isScheduled}) {
  return (
  	<>
  		{isScheduled && (
  			<div className="p-1 md:p-2 w-full bg-primary glass text-sm md:text-md text-primary-content flex justify-center items-center space-x-2 rounded-b-box font-medium">
  				<RiTimerFlashLine className="md:text-lg text-2xl"/>	<span>Expected Next Release of {data.title} on <span className="font-bold underline">{isScheduled.day}</span> at <UserTime time={isScheduled.time} className="font-bold underline"/></span>
  			</div>
  		)}

        <div className="max-w-full mx-auto p-6 bg-gradient-to-tl from-primary/5 via-base-100 to-base-100">
        <div className="flex flex-col md:flex-row">
            <div className="flex-shrink-0">
             <Image
		       	 src={data.thumb}
		      	 width={200}
		      	 height={200}
		       	 className="rounded-box w-32 md:w-64 mx-auto md:mx-0"
		       	 alt={data?.title}
		       	 loading='lazy'
		       	 unoptimized
		       	/>
            </div>
            <div className="mt-4 md:mt-0 md:ml-6">
                <h1 className="text-3xl font-bold">{data?.title}</h1>
                <p className="brightness-75 ">Other Names: {data?.other_name.split(",").join(", ")}</p>
                <p className="brightness-75">Type: {data?.anime_type}</p>
                <p className="flex flex-wrap brightness-75 hover:brightness-110 ">Genre:&nbsp;{ data?.genre.split(",").map((g,i) => { return( <span><a href={`/genre/${g.toLowerCase()}`} className="text-primary underline font-medium">{g}</a>{i == data?.genre.split(",").length - 1  ? '' : ',' }&nbsp;</span>  )  }) }</p>
                <p className="brightness-75">Released Year: {data?.releaed_year}</p>
                <p className="brightness-75">Status: {data?.anime_status}</p>
                <p className="brightness-75">Total Episodes: {data.total_ep}</p>
                <p className="mt-4 text-sm brightness-75">{data?.description}</p>
            </div>
        </div>
    </div>
    <div className="p-6 pt-3 mx-auto max-w-full mb-32 md:mb-20">
    {
    	relatable && relatable.shift() && relatable.length > 0 && (
         <CarouselSection 
    		 pageLink={`/search?q=${data.title}`} 
    		 data={relatable}
    		 heading={"Related Anime"} className=""/>
    		 ) 
    }
    </div>
    </>
  )
}

export default DetailsBox