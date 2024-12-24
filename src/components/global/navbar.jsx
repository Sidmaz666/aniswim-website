"use client"

import {FaPalette, FaSearch, FaHome, FaFire, FaMountain} from "react-icons/fa"
import { useState, useEffect, memo} from "react"
import { FaBarsStaggered, FaXmark} from "react-icons/fa6";
import { useTheme } from "next-themes";
import axiosRetry from "../utils/fetch-data-retry";
import useSWR from "swr";
import Link from "next/link";
import Logo from "./logo";

function TopNavbar({children}){
  const [isSidebar,setSidebar] = useState(true)
  useEffect(() => {
  	if(localStorage.getItem("is-sidebar") == null){
  	    localStorage.setItem("is-sidebar", true)
  	  } else {
  	  	setSidebar(
  	  		strToBool(
						localStorage.getItem("is-sidebar")
  	  			)
  	  		)
  	  }
  },[])
  return(
    <main className="flex flex-col h-[100dvh] w-screen overflow-hidden">
      <Header setSidebar={setSidebar} />
    	<PageLayout>
	  <Sidebar isSidebar={isSidebar}>
		<SidebarList/>
    	   </Sidebar>
    	   <BottomNav>
		<BottomList/>
    	   </BottomNav>
    		<div className="overflow-auto w-full bg-base-100" id="render-pages">
		   {children}
    		</div>
    	</PageLayout>
    </main>
  )
}

function Header({setSidebar}){
  const toggleSidebar = () => {
    setSidebar(prevSidebar => !prevSidebar);
    localStorage.setItem("is-sidebar", !strToBool(localStorage.getItem("is-sidebar")) )
  };
  return(
    <header className="flex justify-between items-center p-2 bg-base-100 sticky top-0 left-0 z-50">
	  <div className="flex space-x-3 items-center">
		<button className="btn btn-ghost hidden md:block text-xl"
		  onClick={toggleSidebar}>
		  <FaBarsStaggered/>
		</button>
    		<Link scroll={false}  href={"/"}>
		  <Logo className="h-[1.8rem]"/>
    		</Link>
    	  </div>
	  <Search className="hidden md:flex"/>
    	<div className="flex space-x-3 items-center md:block">
    		<SearchMobile/>
    		<ThemeChanger/>
    	</div>
    </header>
  )
}

function Sidebar({children,isSidebar}){
  return(
    <>
    {
      isSidebar && (
	  <nav className="md:w-[350px] w-full md:min-h-full bg-base-100 overflow-auto hidden md:block">
	      {children}
	  </nav>
	)
    }
    </>
  )
}


function BottomNav({children}){
  return(
    <nav className="w-full bg-base-100 md:hidden flex absolute left-0 bottom-0 z-50">
	{children}
    </nav>
  )
}

function SidebarList(){
	return(
	  <ul className="h-screen md:h-full overflow-auto flex flex-col md:pb-20 md:pt-0 pt-10">
	    <li className="w-full flex md:border-b-2 border-base-200">
	    <Link scroll={false}  href={"/popular"}
	      className="px-6 py-4 text-start w-full btn-ghost hover:bg-primary hover:text-primary-content">
	  	Most Popular
	      </Link>
	    </li>
	    <li className="w-full flex md:border-b-2 border-base-200">
	    <Link scroll={false}  href={"/new"}
	      className="px-6 py-4 text-start w-full btn-ghost hover:bg-primary hover:text-primary-content">
	  	New Season
	      </Link>
	    </li>
	    <li className="w-full flex md:border-b-2 border-base-200">
	    <Link scroll={false}  href={"/recent"}
	      className="px-6 py-4 text-start w-full btn-ghost hover:bg-primary hover:text-primary-content">
	  	Recent Releases
	      </Link>
	    </li>
	    <li className="w-full flex md:border-b-2 border-base-200">
	    <Link scroll={false}  href={"/list"}
	      className="px-6 py-4 text-start w-full btn-ghost hover:bg-primary hover:text-primary-content">
	  	Anime List
	      </Link>
	    </li>
	    <li className="w-full flex md:border-b-2 border-base-200">
	    <Link scroll={false}  href={"/movies"}
	      className="px-6 py-4 text-start w-full btn-ghost hover:bg-primary hover:text-primary-content">
	  	Movies
	      </Link>
	    </li>
	    <li className="w-full flex md:border-b-2 border-base-200">
	    <Link scroll={false}  href={"/dub"}
	      className="px-6 py-4 text-start w-full btn-ghost hover:bg-primary hover:text-primary-content">
	  	Dub
	      </Link>
	    </li>
	    <li className="w-full flex md:border-b-2 border-base-200">
	    <Link scroll={false}  href={"/schedule"}
	      className="px-6 py-4 text-start w-full btn-ghost hover:bg-primary hover:text-primary-content">
				Schedule
	      </Link>
	    </li>
	    <li className="w-full flex">
	    <div className="collapse collapse-arrow rounded-none md:border-b-2 border-base-200">
	      <input type="checkbox" className="peer" />
    	   <div 
	     className="collapse-title bg-base-100
	     peer-checked:bg-base-200/30 px-6">
	  	Genre
    	   </div>
    	  <div 
	     className="collapse-content bg-base-100
	     peer-checked:bg-base-200/30">
	      <GenreList/>
	  </div>
	</div>
	    </li>
	    <li className="w-full flex">
	    <div className="collapse collapse-arrow rounded-none md:border-b-2 border-base-200">
	      <input type="checkbox" className="peer" />
    	   <div 
	     className="collapse-title bg-base-100
	     peer-checked:bg-base-200/30 px-6">
	    Filter
    	   </div>
    	  <div 
	     className="collapse-content bg-base-100
	     peer-checked:bg-base-200/30 px-6">
	  	<FilterList/>
	  </div>
	</div>
	    </li>
	  </ul>
	)
}

function BottomList(){
	return(
	  <>
	    <ul className="flex w-full justify-evenly items-center py-2">
	      <li> 
			<Link scroll={false}  href={"/"}>
		  	<FaHome/>
		  	</Link>
		  </li>
	      <li>
		  	<Link scroll={false}  href={"/popular"}>
			<FaFire/>
			</Link>
		  </li>
	      <li>
		  <Link scroll={false}  href={"/recent"}>
			<FaMountain/>
			</Link>
		  </li>
	      <li>
		<button
	  	className=""
	  	onClick={
		  ()=>document.getElementById('trigger_navmenu_mobile').showModal()
		}><FaBarsStaggered/></button>
	  	</li>
	    </ul>
	  <dialog id="trigger_navmenu_mobile" className="modal">
	    <div className="bg-base-100 w-full h-full">
	      <form method="dialog">
		<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
	      </form>
	  	<SidebarList/>
	    </div>
	  </dialog>
	  </>
	)
}

function PageLayout({children}){
	return(
	  <div className="flex w-full h-full">
		{children}
	  </div>
	)
}

function Search(){
  const [isQuery, setQuery] = useState("");

  useEffect(() => {
	if(window.location.pathname == "/search"){
	  setQuery(
	    window.location.search?.split("?q=")[1]?.split("&")[0]?.replaceAll("-"," ") || ""
	  )
	}
  },[])

  const { data: isAnime, error, isValidating: isLoading } = useSWR(
    isQuery.length > 1 ? `https://aniswim-api-v2.vercel.app/search?q=${isQuery.trim().replace(/\s+/," ").replaceAll(" ","-")}` : null,
    async (url) => {
      const response = await axiosRetry(url);
      return response;
    }, {
      revalidateOnFocus: false
    }
  );
    return(
    	 <div className="hidden md:flex md:w-full md:px-56 lg:px-72 dropdown dropdown-bottom">
      		<div className="relative flex w-full">
		<input type="text" 
		onChange={(e) => setQuery(e.target.value)}
      		className="
		input input-bordered input-sm
      		w-full border-e-0 rounded-e-none
      		placeholder:font-semibold
      		"
      		onKeyDown={(e) => {
		  if(e.key == "Enter"){
		    e.target.nextSibling.click()
		  }
		}}
      		placeholder="Search..."
    		value={isQuery}
      		/>
    		<a
      		href={isQuery.trim().length > 1 ?  `search?q=${isQuery.trim().replace(/\s+/," ").replaceAll(" ","-")}` : ''}
      		className="btn btn-sm btn-active btn-ghost hover:bg-primary hover:text-primary-content border-s-0 rounded-s-none">
		  <FaSearch/>
		</a>
	      <div className={`absolute left-0 bottom-0 w-full translate-y-2 z-50
		   ${isQuery.length > 1 ? '' : 'hidden'}`}>
	      <div className="menu dropdown-content bg-base-200 w-full rounded-btn max-h-[350px] shadow-xl">
	      <ul tabIndex={0} className="flex flex-col overflow-x-hidden overflow-y-auto h-full">
		{isLoading && <div className="w-full p-2 text-center">
		  <span className="loading loading-spinner loading-xs"></span>
		</div>}
		{error && <div className="w-full p-4">Error: {error.message}</div>}
		{!isLoading && isAnime && isAnime.length > 0 && isAnime[0].title !== undefined ? (
		  isAnime.filter((x) => { return x.title !== undefined }).map((a,i) => (
		    <li key={`${a.animeID}-${i}`}>
		      <Link scroll={false}  href={`/watch/${a.animeID}`} className="flex border-b-4 border-base-100">
			<img src={a.thumbnail} width={100} height={100} alt={a.title} />
			<span className="p-4">{a.title}</span>
		      </Link>
		    </li>
		  ))
		) : (
		  !isLoading && isAnime?.length == 1 ? <div className="text-center py-4">No Anime Found {isQuery}</div>
		  : null
		)}
	      </ul>
		  </div>
	      </div>
	    </div>
    	</div>
      )
}

function SearchMobile() {
  const [isQuery, setQuery] = useState("");

  useEffect(() => {
	if(window.location.pathname == "/search"){
	  setQuery(
	    window.location.search?.split("?q=")[1]?.split("&")[0]?.replaceAll("-"," ") || ""
	  )
	}
  },[])

  const { data: isAnime, error, isValidating: isLoading } = useSWR(
    isQuery.length > 1 ? `https://aniswim-api-v2.vercel.app/search?q=${isQuery.trim().replace(/\s+/," ").replaceAll(" ","-")}` : null,
    async (url) => {
      const response = await axiosRetry(url);
      return response;
    }, {
      revalidateOnFocus: false
    }
  );

  return (
    <div className="md:hidden">
      <button
        className="btn bg-transparent hover:bg-transparent border-0"
        onClick={() => {
			document.getElementById('trigger_search_mobile').showModal();
			document.getElementById('mobile-search-input').focus();
		}}
      >
        <FaSearch />
      </button>
      <dialog id="trigger_search_mobile" className="modal overflow-hidden">
        <div className="bg-base-100 w-full h-screen">
          <div className="flex w-full">
            <input
			  id="mobile-search-input"
              type="text"
              onChange={(e) => setQuery(e.target.value)}
              className="input input-md border-0 rounded-none w-full hover:border-0 hover:rounded-none focus:outline-0"
              placeholder="Search..."
      		onKeyDown={(e) => {
		  if(e.key == "Enter"){
		    document.querySelector("#show-more-search-mobile").click()
		  }
		}}
              value={isQuery}
            />
            <form method="dialog">
              <button
                onClick={() => {
                  setQuery("");
                }}
                className="btn btn-md bg-base-100 rounded-none border-none hover:rounded-none hover:border-none"
              >
                <FaXmark />
              </button>
            </form>
          </div>
          <div className="flex flex-col overflow-auto h-full pb-12" id="search_mobile_render">
            {isLoading && <div className="w-full p-2 py-4 text-center">
	      <span className="loading loading-spinner loading-xs"></span>
	      </div>}
            {error && <div className="w-full p-4">Error: {error.message}</div>}
            {!isLoading && isAnime && isAnime.length > 0 && isAnime[0].title !== undefined ? (
	      <>
	      {isAnime.filter((x) => { return x.title !== undefined }).map((a,i) => (
                <Link scroll={false}  href={`/watch/${a.animeID}`}
		  key={a.animeID + "-" + i} className="flex border-b-4 border-base-200/30">
                  <img src={a.thumbnail} width={100} height={100} alt={a.title} />
                  <span className="p-4">{a.title}</span>
                </Link>
              ))}
	      <a
	        id="show-more-search-mobile"
      		href={`search?q=${isQuery.trim().replace(/\s+/," ").replaceAll(" ","-")}`}
	        className="w-full text-center p-2">Show More</a>
	      </>
            ) : (
              !isLoading && isAnime?.length == 1 ? <div className="text-center py-4">No Anime Found {isQuery}</div>
	      : null
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
}


function ThemeChanger(){
  const {setTheme} = useTheme()
  const toggle_theme = (value) => {
    setTheme(value)
  }
  return(
  <div className="dropdown">
  <div tabIndex={0} role="button" className="btn btn-ghost">
    <FaPalette className="text-xl"/>
  </div>
  <ul tabIndex={0}
    className="dropdown-content z-[20] p-2 shadow-2xl bg-base-200
    rounded-box w-52 -translate-x-[76%] translate-y-2">
    <li>
	<input type="radio"
    	onClick={(e) => { toggle_theme(e.target.value)  }}
    	name="theme-dropdown"
	className="
	theme-controller btn btn-sm btn-block
	btn-ghost justify-start
	"
	aria-label="Light"
	value="light"/>
      </li>
    <li>
	<input type="radio"
    	onClick={(e) => { toggle_theme(e.target.value)  }}
    	name="theme-dropdown"
	className="
	theme-controller btn btn-sm btn-block
	btn-ghost justify-start
	"
	aria-label="Dark"
	value="dark"/>
      </li>
    <li>
	<input type="radio"
    	onClick={(e) => { toggle_theme(e.target.value)  }}
    	name="theme-dropdown"
	className="
	theme-controller btn btn-sm btn-block
	btn-ghost justify-start
	"
	aria-label="Corporate"
	value="corporate"/>
      </li>
    <li>
	<input type="radio"
    	onClick={(e) => { toggle_theme(e.target.value)  }}
    	name="theme-dropdown"
	className="
	theme-controller btn btn-sm btn-block
	btn-ghost justify-start
	"
	aria-label="Valentine"
	value="valentine"/>
      </li>
    <li>
	<input type="radio"
    	onClick={(e) => { toggle_theme(e.target.value)  }}
    	name="theme-dropdown"
	className="
	theme-controller btn btn-sm btn-block
	btn-ghost justify-start
	"
	aria-label="Synthwave"
	value="synthwave"/>
      </li>
    <li>
	<input type="radio"
    	onClick={(e) => { toggle_theme(e.target.value)  }}
    	name="theme-dropdown"
	className="
	theme-controller btn btn-sm btn-block
	btn-ghost justify-start
	"
	aria-label="Business"
	value="business"/>
      </li>
    <li>
	<input type="radio"
    	onClick={(e) => { toggle_theme(e.target.value)  }}
    	name="theme-dropdown"
	className="
	theme-controller btn btn-sm btn-block
	btn-ghost justify-start
	"
	aria-label="Forest"
	value="forest"/>
      </li>
    <li>
	<input type="radio"
    	onClick={(e) => { toggle_theme(e.target.value)  }}
    	name="theme-dropdown"
	className="
	theme-controller btn btn-sm btn-block
	btn-ghost justify-start
	"
	aria-label="Dracula"
	value="dracula"/>
      </li>
    <li>
	<input type="radio"
    	onClick={(e) => { toggle_theme(e.target.value)  }}
    	name="theme-dropdown"
	className="
	theme-controller btn btn-sm btn-block
	btn-ghost justify-start
	"
	aria-label="Night"
	value="night"/>
      </li>
    <li>
	<input type="radio"
    	onClick={(e) => { toggle_theme(e.target.value)  }}
    	name="theme-dropdown"
	className="
	theme-controller btn btn-sm btn-block
	btn-ghost justify-start
	"
	aria-label="Sunset"
	value="sunset"/>
      </li>
  </ul>
  </div>
  )
}

function GenreList() {
  const { data: genreData, error } = useSWR('https://aniswim-api-v2.vercel.app/genre', async (url) => {
    const response = await axiosRetry(url);
    return response.genre;
  },{
    revalidateOnFocus: false
  });

  const linkClass = () => {
    return [
      "link-primary", "link-secondary", "link-accent", "link-success",
      "link-info", "link-warning", "link-error"
    ][Math.floor(Math.random() * 7)]
  }

  if (error) return <div className="px-6 py-4 w-full">Error fetching data...</div>;
  if (!genreData) return <div className="w-full text-center p-4"> <span className="loading loading-spinner loading-xs"></span></div>;

  return (
    <div className="grid grid-cols-2 w-full gap-2 md:gap-2 capitalize break-words">
      {genreData.map((g) => {
        return (
          <Link scroll={false} 
	  onClick={() => {
	    document.querySelector("#render-pages").scroll(0,0)
	  }}
	  key={g} href={`/genre/${g}`} className={`${linkClass()} link-hover text-sm`}>{g}</Link>
        )
      })}
    </div>
  );
}

function FilterList() {
  const [isParam,setParam] = useState([])
  const [isQuery,setQuery] = useState("")
  useEffect(() => {
    const localFilters = localStorage.getItem('filters')?.split(",");
    if (localFilters) {
      setParam(localFilters);
    }
  }, []);
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
    	if(isParam.length > 0){
	    localStorage.setItem('filters', isParam);
	} else {
	      localStorage.removeItem("filters");
	}
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
      <div className="w-full pb-5">
	  <FilterCheckboxes isParam={isParam} setParam={setParam} topic="season" value={season}/>
	  <FilterCheckboxes isParam={isParam} setParam={setParam} topic="status" value={status}/>
	  <FilterCheckboxes isParam={isParam} setParam={setParam} topic="language" value={language}/>
	  <FilterCheckboxes isParam={isParam} setParam={setParam} topic="genre" value={genre}/>
	  <FilterCheckboxes isParam={isParam} setParam={setParam} topic="country" value={country}/>
	  <FilterCheckboxes isParam={isParam} setParam={setParam} topic="year" value={year}/>
	  <FilterCheckboxes isParam={isParam} setParam={setParam} topic="type" value={type}/>
	  <FilterRadio topic="sort" value={sort} isParam={isParam} setParam={setParam}/>
	  <a className="btn btn-outline btn-primary w-full text-start my-3"
	    href={`filter?query_type=filter${isQuery.length > 1 ? "&" + isQuery : '' }`}>
		  Apply
	  </a>
	  <button
    		onClick={() => {
		  localStorage.removeItem("filters")
		  document.querySelectorAll("input[type=checkbox]").forEach((e) => {
				e.checked=false
		  })
		  setParam([])
		}}
    		className="btn btn-outline btn-ghost w-full text-start my-3">
		  Reset
	  </button>
      </div>
    );
}

const FilterCheckboxes = ({topic,value,isParam,setParam}) => {
  useEffect(() => {
    const localFilters_ = localStorage.getItem("filters")
    if(localFilters_ !== null){
      const localFilters = localFilters_.split(",")
      value.forEach((a) => {
	const paramValue = `${topic}[]=${String(a).includes(";") ? String(a).split(";")[1] : a}`;
	const isChecked = localFilters.includes(paramValue);
	document.getElementById(paramValue.replace("[]=","_")).checked = isChecked;
      });
    }
  }, []);
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
   <div className="form-control">
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
		      id={`${topic}_${String(a).includes(";") ? String(a).split(";")[1] : a}`}
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
	  <div className="collapse collapse-plus rounded-none">
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


function strToBool(s) {
    return s.toLowerCase() === "true";
}

const Navbar = memo(TopNavbar) 
export default Navbar