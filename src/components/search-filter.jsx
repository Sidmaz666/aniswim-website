"use client"

import { useState, useEffect } from "react"
import axiosRetry from "./utils/fetch-data-retry";
import useSWR from "swr";

export default function SearchFilter() {
  const [isParam,setParam] = useState([])
  const [isQuery,setQuery] = useState("")
  useEffect(() => {
    	let foundSort = false;
	for (let i = isParam.length - 1; i >= 0; i--) {
    	if (isParam[i].startsWith("sort=")) {
        	if (!foundSort) {
            	foundSort = true;
        	} else {
            	isParam.splice(i, 1);
              }
    	   }
	}
        const URL_SEARCH_PARAM = isParam.join("&")
	setQuery(URL_SEARCH_PARAM)
  },[isParam])
  const { data: filterData, error } = useSWR('https://aniswim-api-v2.vercel.app/filters', async (url) => {
    const response = await axiosRetry(url);
    return response.filter_options;
  }, {
    revalidateOnFocus: false
  });

  if (error) return <div className="px-6 py-4 w-full">Error fetching data...</div>;
  if (!filterData) return <div className="w-full text-center p-4"> <span className="loading loading-spinner loading-xs"></span></div>;

  const {genre,country,season,year,language,type,status,sort} = filterData

  return (
      <div className="w-full flex flex-wrap">
	  <FilterCheckboxes isParam={isParam} setParam={setParam} topic="season" value={season}/>
	  <FilterCheckboxes isParam={isParam} setParam={setParam} topic="status" value={status}/>
	  <FilterCheckboxes isParam={isParam} setParam={setParam} topic="language" value={language}/>
	  <FilterCheckboxes isParam={isParam} setParam={setParam} topic="genre" value={genre}/>
	  <FilterCheckboxes isParam={isParam} setParam={setParam} topic="country" value={country}/>
	  <FilterCheckboxes isParam={isParam} setParam={setParam} topic="year" value={year}/>
	  <FilterCheckboxes isParam={isParam} setParam={setParam} topic="type" value={type}/>
	  <FilterRadio topic="sort" value={sort} isParam={isParam} setParam={setParam}/>
	  <a className="btn btn-outline btn-primary md:w-1/3 md:m-4 w-full text-start my-3"
	    href={`search?q=${window.location.search.split("?q=")[1].split("&")[0]}${isQuery.length > 1 ? "&" + isQuery : '' }`}>
		  Apply
	  </a>
	  <button
    		onClick={() => {
		  document.querySelectorAll("input[type=checkbox]").forEach((e) => {
				e.checked=false
		  })
		  setParam([])
		}}
    		className="btn btn-outline btn-ghost md:w-1/3 md:m-4 w-full text-start my-3">
		  Reset
	  </button>
      </div>
    );
}

const FilterCheckboxes = ({topic,value,isParam,setParam}) => {
  const handleCheck = (e) => {
      if(e.target.checked){
	  const prev_ = [...isParam,e.target.value]
	  setParam(prev_)
      } else {
	  const new_ = isParam.filter((a) => {return a !== e.target.value})
	  setParam(new_)
      }
  }
  return(
   <div className="form-control md:w-1/2 w-full">
	  <div className="collapse collapse-plus rounded-none">
	      <input type="checkbox" className="peer" />
    	   <div 
	     className="collapse-title bg-transparent">
	      <span className="capitalize text-lg font-semibold py-4">{topic}</span>
    	   </div>
    	  <div 
	     className="collapse-content bg-base-200/30 rounded-box">
    {
    	value.map((a) => {
	  return(
	     <label className="cursor-pointer label" key={a}>
		<span className="label-text capitalize">{a && String(a).split(";")[0]}</span>
		  <input type="checkbox"
		      onChange={(e) => {
			  handleCheck(e)
		      }}
		      className="checkbox checkbox-sm" 
		      value={`${topic}[]=${String(a).includes(";") ? String(a).split(";")[1] : a}`} />
		   </label> 
		)
	     })
	   }
	  </div>
	</div>
    </div>
  )
}

const FilterRadio = ({topic,value,isParam,setParam}) => {
  const handleSort = (value) => {
    const filter = isParam.filter((a) => {return a !== value})
    const prev_ = [...filter, value]
    setParam(prev_)
  }
  return(
	  <div className="collapse collapse-plus rounded-none w-full md:w-1/2">
	      <input type="checkbox" className="peer" />
    	   <div 
	     className="collapse-title bg-transparent">
	      <span className="capitalize text-lg font-semibold py-4">{topic}</span>
    	   </div>
    	  <div 
	     className="collapse-content bg-base-200/30 rounded-box">
	 <div className="form-control">
	  {
	      value.map((a) => {
		return(
		   <label className="label cursor-pointer" key={a}>
		      <span className="label-text capitalize">{a && String(a).replace("_"," ")}</span>
		      <input type="radio" onClick={(e) => { handleSort(e.target.value) }}
		  	className="radio" name="sort_value" value={`sort=${a}`}/>
		   </label> 
		)
	     })
	   }
	  </div>
	</div>
    </div>
  )
}
