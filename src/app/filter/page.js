import Container from "@/components/global/page-container"
import InfiniteScrollBox from "@/components/infinite-scroll-box"
import queryString from "@/components/utils/url-param-string"

export default function Filter({searchParams}){
  return(
    <Container>
    	<InfiniteScrollBox 
    	  urlParam={`&q=&${queryString(searchParams)}`}
	  url={`https://aniswim-api-v2.vercel.app/search`}
	/>
    </Container>
  )
}
