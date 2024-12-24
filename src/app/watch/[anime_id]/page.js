"use server"

import Link from "next/link"
import PlayerPage from "@/components/player-container";
import axiosRetry from "@/components/utils/fetch-data-retry";
import Container from "@/components/global/page-container";
import { Suspense } from "react";


const removeObjectWithKey = (arr, key) => arr.filter(obj => !obj.hasOwnProperty(key));
function getShowDetails(scheduleData,searchTerm) {
  const patternsToRemove = [/season\s*\d+/i, /s\d+/i, /part\s*\d+/i, /ep\s*-\s*\d+/i, /ep\s*\d+/i]; 
  const cleanSearchTerm = patternsToRemove.reduce((term, pattern) => term.replace(pattern, ''), searchTerm).trim();
  for (const day in scheduleData.schedule) {
    const shows = scheduleData.schedule[day];
    for (const show of shows) {
      const cleanTitle = patternsToRemove.reduce((title, pattern) => title.replace(pattern, ''), show.title).trim();
      const cleanPage = patternsToRemove.reduce((page, pattern) => page.replace(pattern, ''), show.page).trim();
      if (cleanTitle === cleanSearchTerm || cleanPage === cleanSearchTerm) {
        return {
          day: day,
          time: show.time,
        };
      }
    }
  }
  return false;
}


export async function generateMetadata({ params, searchParams }, parent) {
  const ep=searchParams?.ep || 1
  const {anime_id} = await params
  return {
    title: `Watch ${anime_id.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase())} Episode ${ep}`,
  }
}
 



export default async function({params,searchParams}){
  const ep=searchParams?.ep || 1
  const {anime_id} = params
    try {
    const [details,links, relatable, schedule] = await Promise.all([
      await axiosRetry(`https://aniswim-api-v2.vercel.app/details?id=${anime_id}`),
      await axiosRetry(`https://aniswim-api-v2.vercel.app/links?id=${anime_id}&ep=${ep}`),
      await axiosRetry(`https://aniswim-api-v2.vercel.app/search?q=${anime_id.replace(/\b(\d+nd-season|\d+rd-season|\d+th-season|season-\d+|episode-\d+|\d+-episode|part-\d+|wo-\d+)\b/gi,'').replaceAll("-"," ").trim()}`),
      await axiosRetry(`https://subsplease.org/api/?f=schedule&tz`),
    ])

    const relatable_anime = removeObjectWithKey(relatable, 'filters');
    const isScheduled = getShowDetails(schedule,anime_id.replaceAll("_"," "))

    return (
      <Suspense>
      <Container className="md:pt-8">
        <PlayerPage 
          links={links} 
          details={details} 
          relatable_anime={relatable_anime} 
          isScheduled={isScheduled}
          />
      </Container>
      </Suspense>
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return (
      <Container>
        <div className="w-full h-full flex justify-center items-center ">
	      <div className="pt-8 flex flex-col w-full px-6 md:px-16 md:pt-16">
      	<div className="flex items-center">
          <img 
          src="https://e0.pxfuel.com/wallpapers/665/300/desktop-wallpaper-ducks-cute-animal-memes-funny-animals-cute-funny-animals.jpg" 
          alt="Error GIF" className="size-16 rounded-full" />
        	<span className="text-4xl md:text-6xl font-bold uppercase ml-4 tracking-tight">Error 069</span>
          </div>
          <span className="mt-6 text-lg font-semibold">Possible Reasons for error</span>
          <ul className="list-disc list-outside pl-8">
            <li> The Anime Video has not released yet. Watch the previous 
              <Link 
              className="text-primary font-bold underline" 
              href={`?ep=${searchParams?.ep > 1 ? searchParams?.ep - 1 : '#'}`}
              > Episode </Link>
              </li>
            <li> Content doesn't exist!.</li>
            <li> The Servers might be busy.</li>
            <li> Might be an issue with your internet.</li>
            <li> Something wrong with the universe.</li>
          </ul>
	      </div>
      </div>
      </Container>
    );
  }
}


