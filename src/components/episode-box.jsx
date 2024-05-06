"use client"

import Link from "next/link"
import {FaSearch} from "react-icons/fa"

export default function EpisodeBox({total_ep,fillers_ep}){
	return(
      <div className="rounded-t-none w-full flex flex-col mb-20 h-[250px] bg-base-200">
	<div className="rounded-t-none w-full px-2 py-4 flex justify-between bg-base-300">
	    <button>
	    Episode: {total_ep}
	    </button>
	  <label className="input input-bordered input-sm flex items-center gap-2">
	  <FaSearch/>
	    <input type="text" className="grow md:w-[150px] w-[80px]" placeholder="Search" />
	  </label>
	</div>	
	  <div className="
	  w-full grid py-2 grid-cols-[repeat(auto-fill,60px)]
	  overflow-auto h-full justify-evenly">
		{
		  Array.from(Array(Number(total_ep)),(_,i) => i + 1).map((a) => {
		    return(
		      <Link
		      onClick={() => {
			document.querySelector('#render-pages').scrollTo(0,0)
		      }}
		      href={`?ep=${a}`}
		      className={`btn btn-sm btn-outline btn-primary m-2 px-2 
			flex space-x-2 justify-center items-center
			${
			fillers_ep.includes(String(a)) ? 'border-warning' : null
			}
			`}
		      key={`${a}-ep-btn`}>
		      	<span>
		      	{a}
		      	{
			fillers_ep.includes(String(a)) ?
		      	<span className="text-warning/50">F</span>
			:
			null
			}
		      </span>
		      </Link>
		    )
		  })
		}
	  </div>
      </div>	
  )
}
