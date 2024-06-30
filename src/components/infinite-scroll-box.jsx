"use client"

import { useEffect } from 'react';
import axiosRetry from './utils/fetch-data-retry';
import useSWRInfinite from "swr/infinite"
import SectionCard from './section-card';
import SkelCard from './skeleton-card';

const fetcher = async (url) => {
  const res = await axiosRetry(url);
  return res;
};

export default function InfiniteScrollBox({url, urlParam , isPage, skelLen}) {
    const handleScroll = () => {
      if (
	  (document.querySelector(`#render-pages`).scrollTop + 
	  document.querySelector(`#render-pages`).clientHeight ) >=
	  document.querySelector(`#render-pages`).scrollHeight - 300
      ) {
        handleLoadMore();
      }
    };

   const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && previousPageData.length < 19 && Object.keys(previousPageData[0]).includes("filters")){
      document.querySelector(`#render-pages`).removeEventListener('scroll', handleScroll);
      document.querySelectorAll('.skeleton').forEach((e) => { e.remove() })
      return null; 
    } 
    return `${url}?page=${pageIndex + 1}${urlParam ? urlParam : ''}`; 
  };
  const { data, error, isValidating, setSize  } = useSWRInfinite(
    getKey,
    fetcher, {
      initialSize: isPage || 1,
      revalidateAll: false,
      revalidateFirstPage: false,
      persistSize: false,
      parallel: false,
      revalidateOnFocus:false,
      keepPreviousData: true
    });

  const handleLoadMore = () => {
    setSize(size => size + 1);
  };


   useEffect(() => {
	document.querySelector(`#render-pages`).addEventListener('scroll', handleScroll);
    return () => {
	document.querySelector(`#render-pages`).removeEventListener('scroll', handleScroll);
    };
  }, []);


  if (error) return <div className='flex w-full h-full justify-center items-center font-semibold text-lg text-red-500'><span>Error fetching data...</span></div>;
  if (!data) return (
    <div className='grid gap-4 md:grid-cols-[repeat(auto-fill,300px)] justify-center pb-20 w-full'>
        <SkelCard
	className="w-[350px]  md:w-[300px] m-0"
	figClass={"w-[350px]"}
	imageClass={"h-[350px]"}
	len={skelLen || 20}
	/>
  </div>
  );

  const allData = data.reduce((acc, curr) => acc.concat(curr), []);

  return (
    <div className='grid gap-4 md:grid-cols-[repeat(auto-fill,300px)] justify-center md:pb-20 pb-32 w-full'>
      {allData.map((item) => (
	item.animeID !== undefined ?
        <SectionCard key={item.animeID}
	className="w-[350px]  md:w-[300px] m-0"
	figClass={"w-[350px]"}
	imageClass={"h-[350px]"}
	data={item}/>
	: null
      ))}
	{
	  isValidating && 
	  <SkelCard
	  className="w-[350px]  md:w-[300px] m-0"
	  figClass={"w-[350px]"}
	  imageClass={"h-[350px]"}
	  len={skelLen || 20}
	  />
	}
    </div>
  );
};

