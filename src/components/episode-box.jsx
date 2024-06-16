"use client"

import { useState, useEffect, memo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSearchParams } from 'next/navigation'
import {FaSearch} from "react-icons/fa"
import useCollapseNumber from "./utils/collapse-number"
import { FaArrowDown, FaArrowUp } from "react-icons/fa6"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md"
import { FaDownload } from "react-icons/fa";
import DownloadBox from "./download-box"

function EpisodeBoxComponent({total_ep,fillers_ep}){
	const searchParams = useSearchParams()
	const [currentArray,setCurrentArray] = useState([])
	const [epData,setEpData] = useState("")
	const [isReverse,setReversed] = useState(false)
	const [isSearch,setSearch] = useState("")
	const [isWatched,setWatched] = useState([])
	const [isAutoplay,setAutoplay] = useState(false)
	const navigate = useRouter() 
	const data = useCollapseNumber(1,Number(total_ep))
	const current_ep = searchParams.get('ep')

	useEffect(() => {
		setEpData(data)
		setCurrentArray(
			data?.collapsed_nums_array[0]
		)

		const url = new URL(window.location.href);
        const animeId = url.pathname.replace("/watch/","")
		let localStorageData = localStorage.getItem("watched") || "{}"

        if(localStorageData !== null && typeof JSON.parse(localStorageData) == "object" ){
          localStorageData = JSON.parse(localStorageData)
          if(localStorageData[animeId]){
            setWatched(localStorageData[animeId])
          }
        }
	},[])

	useEffect(() => {
		if(!isNaN(Number(isSearch)) &&
		 Number(isSearch) > 0 &&
		 Number(isSearch) <= Number(total_ep)){
		 const all_ep = Array.from(Array(Number(total_ep)), (_,i) => {return i + 1 })
		 const new_arr = all_ep.filter((e) => {
			const reg = new RegExp(String(e),"gi")
			if(reg.test(isSearch)) return e 
		 })	
		 setCurrentArray(new_arr.reverse())
		} else {
			setCurrentArray(
				data?.collapsed_nums_array[0]
			)
		}
	},[isSearch])


  useEffect(() => {
    // Check if 'autoplay' exists in localStorage
    const savedAutoplay = localStorage.getItem('autoplay');
    if (savedAutoplay === null) {
      // If not, set 'autoplay' to false in localStorage
      localStorage.setItem('autoplay', 'false');
    } else {
      // If it exists, update the state based on the stored value
      setAutoplay(savedAutoplay === 'true');
    }
  }, []);

  const handleAutoplayToggle = () => {
    const newAutoplay = !isAutoplay;
    setAutoplay(newAutoplay);
    // Save the new state in localStorage
    localStorage.setItem('autoplay', newAutoplay.toString());
  };

	return(
	<div className="rounded-t-none w-full flex flex-col bg-base-200">
	<div className="rounded-t-none w-full px-2 py-4 flex justify-between items-center bg-base-300">
	    <span className="font-medium pl-6">
	    Episode: {current_ep}
	    </span>
	<div className="flex items-center space-x-2">
	<label className="input input-bordered input-sm flex items-center gap-2">
	  <FaSearch/>
	    <input 
		 type="text"
		 className="grow md:w-[150px] w-[80px]"
		  placeholder="Search"
		  onChange={(e) => {
			setSearch(e.target.value)
		   }}
		   onKeyDown={(e) => {
			if(e.key == "Enter" && !isNaN(Number(isSearch)) &&
				Number(isSearch) > 0 &&
				Number(isSearch) <= Number(total_ep)){
					navigate.push(`?ep=${currentArray[0]}`)
			}
		   }}
		  value={isSearch} 
		  />
	  </label>
	  <button
	  onClick={() => {
		setReversed(!isReverse);
		setCurrentArray(currentArray.reverse())
	  }}
	  >
		{
			isReverse ?
			<FaArrowUp/>
			 : <FaArrowDown/>
		}
	  </button>
	</div>
	</div>	
	<div className="rounded-t-none w-full px-8 py-4 flex justify-between bg-base-300">
	<div className="form-control">
  	<label className="label cursor-pointer">
    <span className="label-text mr-2">Auto Next</span> 
    <input 
    checked={isAutoplay}
    onChange={handleAutoplayToggle}
    type="checkbox"
    className="toggle toggle-sm"
    />
  	</label>
	</div>
		<div className="flex space-x-4 justify-center items-center px-2">
		<DownloadBox total_ep={total_ep}/>
		<Link
		href={`?ep=${Number(current_ep) - 1}`}
      	className={`btn btn-sm btn-circle btn-outline btn-primary 
	          flex justify-center items-center text-md 
			  ${Number(current_ep) <= 1 ? 'hidden' : '' }`}
    >
    	<MdKeyboardArrowLeft/>
    	</Link>
		<Link
		id="next-btn"
		href={`?ep=${Number(current_ep) + 1}`}
      	className={`btn btn-sm btn-circle btn-outline btn-primary 
	          flex justify-center items-center text-md
	          ${Number(current_ep) >= total_ep ? 'hidden' : '' }`}
    >
    	<MdKeyboardArrowRight/>
    	</Link>
		</div>
	</div>

	<div className="grid grid-cols-3 md:flex md:flex-wrap bg-base-300
	 px-4 pb-3 text-xs ">
		{
				epData?.short_form?.map((m) => {
					return <button
					className="m-2 px-2 p-1 bg-base-200 text-primary/50
					 link link-hover link-primary rounded-box"
					onClick={() => {
						setCurrentArray(
							epData?.collapsed_nums_array[Number(m.split('-index:')[1])]
						)
					}}
					key={m}>{m.split('-index:')[0]}</button>
				})
		}
	
	</div>
	  <div id="episode-button-container" className={`
	  w-full grid py-2 grid-cols-[repeat(auto-fill,60px)]
	  overflow-auto h-full justify-evenly max-h-[150px] md:max-h-[250px]`}>
		{
		  currentArray.map((a) => {
		    return(
		      <Link
		      onClick={() => {
				document.querySelector('#render-pages').scrollTo(0,0)
		      }}
		      href={`?ep=${a}`}
		      className={`btn btn-sm btn-outline btn-primary m-2 px-2 
			flex space-x-2 justify-center items-center
			${
			isWatched.includes(String(a)) ? 'bg-primary/20' : ''
			}
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

const EpisodeBox = memo(EpisodeBoxComponent)
export default EpisodeBox