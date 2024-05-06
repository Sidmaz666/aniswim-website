import Container from "@/components/global/page-container"
import InfiniteScrollBox from "@/components/infinite-scroll-box"

export default function Chinese(){
  return(
    <Container>
    	<InfiniteScrollBox 
    	  urlParam={"&type=3"}
	  url={`https://aniswim-api-v2.vercel.app/releases`}
	/>
    </Container>
  )
}
