"use client"

import React, {useState, useEffect, useCallback} from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';
import SectionCard from './section-card';
import axiosRetry from './utils/fetch-data-retry';

export default function CarouselSection({data, heading, className, pageLink}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ dragFree: true });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi) => {
    setNextBtnEnabled(emblaApi.canScrollNext());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <>
      {data == false && pageLink === 'history' ? (
        <PreviouslyWatched 
          className={className} 
          heading={heading} 
          nextBtnEnabled={nextBtnEnabled} 
          prevBtnEnabled={prevBtnEnabled} 
          scrollNext={scrollNext} 
          scrollPrev={scrollPrev} 
          emblaRef={emblaRef} 
        />
      ) : (
        <div className={`flex flex-col mb-5 ${className}`}>
          <div className='flex justify-between items-center'>
            <div className='py-2 text-xl font-semibold'>
              <Link href={pageLink} className='link link-hover'>{heading}</Link>
            </div>
            <div className='flex space-x-3'>
              <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
              <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
            </div>
          </div>
          <div className="max-w-full overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {data.map((a) => <SectionCard data={a} key={a?.animeID} />)}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const PrevButton = ({enabled, onClick}) => (
  <button
    className={`btn btn-sm btn-circle btn-outline btn-primary flex justify-center items-center text-md ${enabled ? '' : 'hidden'}`}
    onClick={onClick}
    disabled={!enabled}
  >
    <MdKeyboardArrowLeft />
  </button>
);

const NextButton = ({enabled, onClick}) => (
  <button
    className={`btn btn-sm btn-circle btn-outline btn-primary flex justify-center items-center text-md ${enabled ? '' : 'hidden'}`}
    onClick={onClick}
    disabled={!enabled}
  >
    <MdKeyboardArrowRight />
  </button>
);

const PreviouslyWatched = ({emblaRef, className, heading, scrollNext, scrollPrev, nextBtnEnabled, prevBtnEnabled}) => {
  const [isHistory, setHistory] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const anime_data = [];
    const watch_data = localStorage.getItem("watched") || false;
    if (watch_data && Object.keys(JSON.parse(watch_data)).length !== 0) {
      const fetchData = async () => {
        for (const keys in JSON.parse(watch_data)) {
          try {
            const a = await axiosRetry(`https://aniswim-api-v2.vercel.app/details?id=${keys}`);
            anime_data.push({
              animeID: `${a.animeID}-episode-${JSON.parse(watch_data)[keys][0]}`,
              thumbnail: a.thumb
            });
          } catch (error) {
            console.error(error);
          }
        }
        setHistory(anime_data);
        setLoading(false);
      };
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <>
    { !isLoading && isHistory.length > 0  ? (
    <div className={`flex flex-col mb-5 ${className}`}>
      <div className='flex justify-between items-center'>
        <div className='py-2 text-xl font-semibold'>{heading}</div>
        <div className='flex space-x-3'>
          <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
          <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
        </div>
      </div>
      <div className="max-w-full overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {
            isHistory.map((a) => <SectionCard data={a} key={a?.animeID} />)
          }
        </div>
      </div>
    </div>
      ) : null
    }
    </>
  );
}
