"use client"

import React, {useState, useEffect, useCallback} from 'react'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image';
import Link from "next/link"

export default function Carousel({data}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({loop:true},[Autoplay()]);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);


  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );

  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const scrollTo = useCallback(
    (index) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onInit = useCallback((emblaApi) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, []);

  const play = useCallback((emblaApi) => {
       emblaApi.plugins().autoplay.play()
    },[])

  const stop = useCallback((emblaApi) => {
       emblaApi.plugins().autoplay.stop()
    },[])

  useEffect(() => {
      if (!emblaApi) return;
      onInit(emblaApi);
      onSelect(emblaApi);
      emblaApi.on('reInit', onInit);
      emblaApi.on('reInit', onSelect);
      emblaApi.on('select', onSelect);
      emblaApi.on("pointerDown", stop ); 
      emblaApi.on("pointerUp", play);
  }, [emblaApi, onInit, onSelect]);


  return(
	    <div className="overflow-hidden w-full relative" ref={emblaRef}>
	      <div className="flex w-full">
    		{
		  data.map((a, i) => {
		     return(
		      <Link 
           href={`watch/${a?.animeID}`} 
           className="min-w-full h-[200px] md:h-[400px] 
           overflow-hidden rounded-box flex items-start mx-4 cursor-pointer 
		       glass bg-primary/10"
			     key={a?.animeID + i}
		       >
		       	<div className='w-full h-full flex justify-center items-center md:pl-8 px-4 py-2 brightness-200'>
		       		<div className='flex flex-col space-y-2'>
				  <span className='md:text-lg text-sm font-semibold'>{a?.title}</span>
				  <span className='text-sm line-clamp-1'>
		       		   {a?.genre?.replaceAll(",",", ")}
		       		   </span>
				  <span className='line-clamp-2 text-xs md:text-md'>{a?.description}</span>
				  <span className='text-xs md:text-md'>{a?.anime_type}</span>
				  <span className='text-xs md:text-sm'>{a?.anime_status} Episode:{a?.total_ep}</span>
		       		</div>
		        </div>
			      <Image
		       		className='rounded-e-box object-contain object-right h-full w-full'
		       		width={100}
		       		height={100}
		       		src={a?.thumb} 
		       		alt={a?.title}
		       		loading = 'lazy'
		       		unoptimized
		       />
			</Link>
		     )
		  })
		}
	    </div>
	    <div className="px-4 flex w-full justify-between py-2 items-center">
		<div className="flex space-x-4 px-4">
		  {scrollSnaps.map((_, index) => (
		    <DotButton
		      key={index}
		      selected={index === selectedIndex}
		      onClick={() => scrollTo(index)}
		    />
		  ))}
		  </div>
		  <div className="flex space-x-4">
		    <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
		    <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
		  </div>
	    </div>
	  </div>
    )
}


const DotButton = (props) => {
  const { selected, onClick } = props;

  return (
    <button
      className={`w-3 h-3 rounded-box bg-primary ${selected ? 'bg-secondary' : '' }`}
      type="button"
      onClick={onClick}
    />
  );
};

const PrevButton = ({enabled,onClick}) => {
  return (
    <button
      className="btn btn-sm flex justify-center items-center text-xl"
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
      className="btn btn-sm flex justify-center items-center text-xl"
      onClick={onClick}
      disabled={!enabled}
    >
    <MdKeyboardArrowRight/>
    </button>
  );
};

