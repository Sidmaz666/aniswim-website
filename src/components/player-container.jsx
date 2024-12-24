"use client"

import EpisodeBox from '@/components/episode-box'
import DetailsBox from '@/components/details-box'
import VideoPlayer from "./video-player";
import { Suspense } from 'react';
import Loader from '@/app/loading';

const PlayerPage = ({links, details, relatable_anime, isScheduled}) => {
    return (
      <Suspense fallback={<Loader />}>
        <VideoPlayer url={links.video_links[0].main_link} poster={details.thumb}/>
        <EpisodeBox total_ep={details.total_ep} fillers_ep={details.fillers_ep}/>
        <DetailsBox data={details} relatable={relatable_anime} isScheduled={isScheduled} />
      </Suspense>
    )
  }

export default PlayerPage