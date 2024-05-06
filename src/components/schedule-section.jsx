"use server"

import axios from "axios"
import UserTime from "./user-time";

export default async function TodaySchedule({className}){
  const url = `https://subsplease.org/api/?f=schedule&h=false&tz`
  const {data} = await axios.get(url);

  return(
 <div className={`flex flex-col space-y-4 ${className && className}`}>
  <div className='py-2 text-xl font-semibold'>
	       Today's Schedule 
   </div>
  <ul className="flex flex-col space-y-0">
    {
     data && data?.schedule.map((s,i) => {
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
		<img src={"https://subsplease.org" + s.image_url} alt={s.title} className="avatar" />
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
