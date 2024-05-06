import Container from "@/components/global/page-container"
import InfiniteScrollBox from "@/components/infinite-scroll-box"

export default function Dub(){
  return(
    <Container>
    	<InfiniteScrollBox 
    	  urlParam={"&type=2"}
	  url={`https://aniswim-api-v2.vercel.app/releases`}
	/>
    </Container>
  )
}
