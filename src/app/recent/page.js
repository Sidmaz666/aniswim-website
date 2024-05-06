import Container from "@/components/global/page-container"
import InfiniteScrollBox from "@/components/infinite-scroll-box"

export default function Recent(){
  return(
    <Container>
    	<InfiniteScrollBox 
	  url={`https://aniswim-api-v2.vercel.app/releases`}
	/>
    </Container>
  )
}
