"use server"

import Container from "@/components/global/page-container";
import Carousel from "@/components/carousel"
import CarouselSection from "@/components/carousel-sections";
import TodaySchedule from "@/components/schedule-section";
import ListOption from "@/components/list-option";
import axiosRetry from "@/components/utils/fetch-data-retry";
import { FaGithub } from "react-icons/fa";


export default async function Home() {
  try {
    const initialData = await axiosRetry('https://aniswim-api-v2.vercel.app/')
    const carouselData_ = initialData.slice(0, 5);
    const popularData = initialData.slice(5);

    const carouselData = await Promise.all(carouselData_.map(async item => {
      try {
        const detailedData = await axiosRetry(`https://aniswim-api-v2.vercel.app/details?id=${item.animeID}`);
        return detailedData;
      } catch (error) {
        console.error(`Failed to fetch details for animeID ${item.animeID}:`, error);
        return null; 
      }
    }));

    const [newSeson,recentAnime,chineseAnime,recentDub,moviesData] = await Promise.all([
      await axiosRetry('https://aniswim-api-v2.vercel.app/new'),
      await axiosRetry('https://aniswim-api-v2.vercel.app/releases'),
      await axiosRetry('https://aniswim-api-v2.vercel.app/releases?type=3'),
      await axiosRetry('https://aniswim-api-v2.vercel.app/releases?type=2'),
      await axiosRetry('https://aniswim-api-v2.vercel.app/movies'),
    ])

    return (
      <Container>
        <Carousel data={carouselData}/>
        <CarouselSection pageLink={"history"} 
        data={false} heading={"Previously Watched"} className={"md:pt-4 pt-6"}/>
      	<CarouselSection pageLink={"popular"} 
      	data={popularData} heading={"Popular Anime"} className={"md:pt-4 pt-6"}/>
      	<CarouselSection pageLink={"new"} 
      	data={newSeson} heading={"New Anime"} className=""/>
      	<CarouselSection pageLink={"/movies"} data={moviesData} heading={"Movies"} className=""/>
      	<CarouselSection pageLink={"/recent"} data={recentAnime} heading={"Recent Releases"} className={""}/>
      	<CarouselSection pageLink={"/chinese"} data={chineseAnime} heading={"Recent Chinese Anime"} className=""/>
      	<CarouselSection pageLink={"/dub"} data={recentDub} heading={"Recently Dubbed"} className=""/>
      	<TodaySchedule className=""/>
        <ListOption className={"pb-2 mb-6"}/>
        <footer className="footer footer-center flex items-end justify-center p-10 md:mb-24 mb-40">
        <aside className="flex items-end justify-center">
          <a href="https://github.com/Sidmaz666" target="_blank"
           className="flex items-center space-x-2">
            <span>Build by - Sidmaz666</span> <FaGithub/>
          </a>
        </aside> 
        <nav>
      </nav>
      </footer>
      </Container>
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

