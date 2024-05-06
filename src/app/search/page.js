import Container from "@/components/global/page-container"
import InfiniteScrollBox from "@/components/infinite-scroll-box"
import queryString from "@/components/utils/url-param-string"
import {FaSliders} from "react-icons/fa6"
import SearchFilter from "@/components/search-filter"

export default function Search({searchParams}){
  return(
    <Container>
      <div className="collapse w-full md:py-2 md:mt-2">
      <input type="checkbox" className="peer" />
      <div className="collapse-title text-xl font-medium flex w-full justify-end items-center py-0 px-4 ">
	  <FaSliders/>
      </div>
      <div className="collapse-content w-full">
    	<SearchFilter/>
      </div>
      </div>
    	<InfiniteScrollBox 
    	  urlParam={`&${queryString(searchParams)}`}
	  url={`https://aniswim-api-v2.vercel.app/search`}
	/>
    </Container>
  )
}
