import Container from "@/components/global/page-container"
import InfiniteScrollBox from "@/components/infinite-scroll-box"
import ListOption from "@/components/list-option"
import {FaSliders} from "react-icons/fa6"

export default function ListByOrder({params}){
  return(
    <Container>
      <div className="collapse w-full md:py-2 md:mt-2">
      <input type="checkbox" className="peer" />
      <div className="capitalize collapse-title text-xl font-medium flex w-full justify-end items-center py-0 px-4 ">
    	<span className="w-full text-start md:px-6 px-2">List of "{params.list_option}"</span>
	  <FaSliders/>
    </div>
    <div className="collapse-content w-full">
	     <ListOption disableHeading={true}
	      className="mt-0 pt-0"
	    />
      </div>
      </div>
    <InfiniteScrollBox 
	  urlParam={`&list=${params.list_option}`}
	  url={`https://aniswim-api-v2.vercel.app/list`}
	/>
    </Container>
  )
}
