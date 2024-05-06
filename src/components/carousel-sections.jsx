"use client"

import React, {useState, useEffect, useCallback} from 'react'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import useEmblaCarousel from 'embla-carousel-react'
import Link from 'next/link';
import SectionCard from './section-card';

export default function CarouselSection({data,heading,className,pageLink}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    dragFree:true
  });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);


  const scrollPrev = useCallback(
    () => {
    if (!emblaApi) return;
      emblaApi && emblaApi.scrollPrev()
    },[emblaApi]
  );

  const scrollNext = useCallback(
    () => {
    if (!emblaApi) return;
      emblaApi && emblaApi.scrollNext()
    },[emblaApi]
  );


  const onSelect = useCallback((emblaApi) => {
      setNextBtnEnabled(emblaApi.canScrollNext());
      setPrevBtnEnabled(emblaApi.canScrollPrev());
  },[])


  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('reInit',onSelect)
    emblaApi.on('select',onSelect)
  }, [emblaApi, onSelect]);


  return(
    	<div className={`flex flex-col mb-5 ${className && className}`}>
    	<div className='flex justify-between items-center'>
	    <div className='py-2 text-xl font-semibold'>
    		<Link href={pageLink && pageLink} className='link link-hover'>
    			 {heading} 
    		</Link>
    	     </div>
    		<div className='flex space-x-3'>
			<PrevButton onClick={scrollPrev} enabled={prevBtnEnabled}/>
    			<NextButton onClick={scrollNext} enabled={nextBtnEnabled}/>
    		</div>
    	</div>
	    <div className="max-w-full overflow-hidden" ref={emblaRef}>
	      <div className="flex">
    		{
		  data.map((a) => {
		     return(
		       <SectionCard data={a} key={a?.animeID}/>
		  )})
		}
		</div>
	    </div>
    </div>
  )
}


const PrevButton = ({enabled,onClick}) => {
  return (
    <button
      className={`btn btn-sm btn-circle btn-outline btn-primary 
	          flex justify-center items-center text-md  ${enabled ? '' : 'hidden'} `}
      onClick={onClick}
      disabled={!enabled}
    >
    <MdKeyboardArrowLeft/>
    </button>
  );
};

const NextButton = ({enabled,onClick}) => {
  return (
    <button
      className={`btn btn-sm btn-circle btn-outline btn-primary 
	          flex justify-center items-center text-md  ${enabled ? '' : 'hidden'} `}
      onClick={onClick}
      disabled={!enabled}
    >
    <MdKeyboardArrowRight/>
    </button>
  );
};



