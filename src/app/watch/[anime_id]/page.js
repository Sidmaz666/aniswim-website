"use server"

import dynamic from 'next/dynamic'

import Container from "@/components/global/page-container"
import axiosRetry from "@/components/utils/fetch-data-retry"
import EpisodeBox from '@/components/episode-box'

const VideoPlayer = dynamic(
  () => import('@/components/video-player'),
  { ssr: false }
)

export default async function({params,searchParams}){
  const ep=searchParams?.ep || 1
  const {anime_id} = params
    try {
    const [details,links] = await Promise.all([
      await axiosRetry(`https://aniswim-api-v2.vercel.app/details?id=${anime_id}`),
      await axiosRetry(`https://aniswim-api-v2.vercel.app/links?id=${anime_id}&ep=${ep}`)
    ])

    return (
      <Container>
	<VideoPlayer url={links.video_links[0].main_link} poster={details.thumb}/>
      	<EpisodeBox total_ep={details.total_ep} fillers_ep={details.fillers_ep}/>
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
