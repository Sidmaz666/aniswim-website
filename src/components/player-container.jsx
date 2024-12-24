"use client"

import EpisodeBox from '@/components/episode-box'
import DetailsBox from '@/components/details-box'
import VideoPlayer from "./video-player";

const PlayerPage = ({links, details, relatable_anime, isScheduled}) => {
    return (
      <>
      <VideoPlayer url={links.video_links[0].main_link} poster={details.thumb}/>
      <EpisodeBox total_ep={details.total_ep} fillers_ep={details.fillers_ep}/>
      <DetailsBox data={details} relatable={relatable_anime} isScheduled={isScheduled} />
      </>
    )
  }

export default PlayerPage