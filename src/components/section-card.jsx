"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import axiosRetry from './utils/fetch-data-retry';
import Link from 'next/link';


export default function SectionCard({data, className, figClass, imageClass}){
  const [isImage, setImage] = useState(data?.thumbnail || undefined)

  useEffect(() => {
    if(!data.thumbnail){
      const reqImage = async (id) => {
	await new Promise((resolve,_) => {
	  setTimeout(async () => {
	    const res = await axiosRetry(`https://aniswim-api-v2.vercel.app/details?id=${id}`)
	    setImage(res.thumb)
	    resolve()
	  },80)
	})
      }
      if(data && data.animeID){
	reqImage(data?.animeID)
      }
    } 
  },[])



  return(
	    <Link 
    	    href={`/watch/${data?.animeID?.split("-episode-")[0]}?ep=${data?.animeID?.split("-episode-")[1] || 1}`}
	    className={`
	    md:[flex:0_0_300px] [flex:0_0_200px]
	    rounded-box mr-3 mb-4
	    bg-gradient-to-tl from-primary/5 via-base-100 to-base-100
	    ${className && className}
	      `}
	     key={data?.animeID}
	     >
	     <div className={`md:w-[300px] w-[200px] ${figClass && figClass}`}>
	     <figure className='pt-2 px-2'>
    		{
		  isImage ?
		       <Image
		       src={isImage}
		       width={200}
		       height={200}
		       className={`w-full h-[200px] md:h-[300px] rounded-t-box ${imageClass}`}
		       alt={data?.title}
		       loading='lazy'
		       unoptimized
		       />
		  	:
			<div 
			 className={`w-full h-[200px] md:h-[300px] rounded-t-box skeleton ${imageClass}`}
			>
		  	</div>
		}
	     </figure>
	    <div className="p-3">
		<span className='capitalize line-clamp-2 h-12 font-medium'>
		      {data?.animeID.replaceAll("-"," ")}
	       </span>
	    </div>
	  </div>
       </Link>
  )
}
