"use server"

import axios from "axios"
import UserTime from "./user-time";
import axiosRetry from './utils/fetch-data-retry';
import Image from 'next/image';


export default async function TodaySchedule({className, expand=false}){
	let url
	if(expand){
		url = "https://subsplease.org/api/?f=schedule&tz"
	} else {
    url = `https://subsplease.org/api/?f=schedule&h=false&tz`
	}
  const data = await axiosRetry(url);
 

  return(
  	<>
  	{
  		expand ? (
  		<>
  		  {Object.entries(data.schedule).map(([key, value], i) => (
          <ScheduleCard key={key} 
           className={`
           ${i == Object.entries(data.schedule).length - 1 ? 'mb-24' : ''} 
           ${i !== 0 ? 'pt-4' : ''}
           ${className}
           `}
           data={value} heading={key} expand={expand} />
          ))}
  		</>
  		) : <ScheduleCard className={className} data={data} heading={"Today's Schedule"} expand={expand} />  	
    }
  	</>
  )
}

const ScheduleCard = ({className, data, heading, expand}) => {
	return (
	<div className={`flex flex-col space-y-4 ${className && className}`}>
  <div className={`py-2 text-xl font-semibold`}>
	      {heading}
   </div>
  <ul className="flex flex-col space-y-0">
    {
     data && expand == false && data?.schedule.map((s,i) => {
	return (
	  <li key={s.page} className="border-l-4 border-primary/60">
	  <div className={`alert shadow-lg flex items-center 
	  ${
	  i == 0 ? 'rounded-tr-box rounded-br-none rounded-s-none' :
	  i >= data.schedule.length - 1 ? 'rounded-br-box rounded-tr-none rounded-s-none' :
	  'rounded-none' }
	  justify-between bg-gradient-to-bl from-base-300 to-primary/5`}>
	  <div className="flex md:space-x-4 space-x-2">
	  <div className="avatar">
	    <div className="w-24 rounded-full">
	    		<Image
		       src={
		       	s.image_url.length > 0 ?
		       	"https://subsplease.org" + s.image_url
		       	: "https://placehold.co/200x200?text=Unavilable"
		       }
		       width={200}
		       height={200}
		       className={`avatar`}
		       alt={s.title}
		       loading='lazy'
		       unoptimized
		       />
	  </div>
	  </div>
	    <div className="felx flex-col p-2 space-y-2">
	    <span className="font-bold line-clamp-2">{s.title}</span>
	    <div className="text-xs">Airing Time: <UserTime time={s.time}/> </div>
	    </div>
	  </div>
	  </div>
	  </li>
	)
      })
    }
    {
     data && expand && data?.map((s,i) => {
	return (
	  <li key={s.page} className="border-l-4 border-primary/60">
	  <div className={`alert shadow-lg flex items-center 
	  ${
	  	i == 0 ? 'rounded-tr-box rounded-br-none rounded-s-none' :
	  	i >= data.length - 1 ? 'rounded-br-box rounded-tr-none rounded-s-none' :
	  	'rounded-none' 
	  }
	  justify-between bg-gradient-to-bl from-base-300 to-primary/5
	  `}>
	  <div className="flex md:space-x-4 space-x-2">
	  <div className="avatar">
	    <div className="w-24 rounded-full">
	    		<Image
		       src={
		       	s.image_url.length > 0 ?
		       	"https://subsplease.org" + s.image_url
		       	: "https://placehold.co/200x200?text=No\n+Image"
		       }
		       width={200}
		       height={200}
		       className={`avatar`}
		       alt={s.title}
		       loading='lazy'
		       unoptimized
		       />
	  </div>
	  </div>
	    <div className="felx flex-col p-2 space-y-2">
	    <span className="font-bold line-clamp-2">{s.title}</span>
	    <div className="text-xs">Airing Time: <UserTime time={s.time}/> </div>
	    </div>
	  </div>
	  </div>
	  </li>
	)
      })
    }
  </ul>
  </div>
		)
}