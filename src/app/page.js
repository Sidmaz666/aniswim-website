"use server"

import Container from "@/components/global/page-container";
import Carousel from "@/components/carousel"
import CarouselSection from "@/components/carousel-sections";
import TodaySchedule from "@/components/schedule-section";
import ListOption from "@/components/list-option";
import axiosRetry from "@/components/utils/fetch-data-retry";

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
      	<CarouselSection pageLink={"popular"} 
      	data={popularData} heading={"Popular Anime"} className={"md:pt-4 pt-6"}/>
      	<CarouselSection pageLink={"new"} 
      	data={newSeson} heading={"New Anime"} className=""/>
      	<CarouselSection pageLink={"/movies"} data={moviesData} heading={"Movies"} className=""/>
      	<CarouselSection pageLink={"/recent"} data={recentAnime} heading={"Recent Releases"} className={""}/>
      	<CarouselSection pageLink={"/chinese"} data={chineseAnime} heading={"Recent Chinese Anime"} className=""/>
      	<CarouselSection pageLink={"/dub"} data={recentDub} heading={"Recently Dubbed"} className=""/>
      	<TodaySchedule className=""/>
        <ListOption className={"pb-20 mb-20"}/>
      </Container>
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return (
      <Container>
        <div className="w-full h-full flex justify-center items-center">
	      <p>
      		Error fetching data. Please try again later.
	      </p>
      </div>
      </Container>
    );
  }
}

