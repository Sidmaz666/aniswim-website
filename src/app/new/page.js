import Container from "@/components/global/page-container"
import InfiniteScrollBox from "@/components/infinite-scroll-box"

export default function NewAnime(){
  return(
    <Container>
    	<InfiniteScrollBox 
	  url={`https://aniswim-api-v2.vercel.app/new`}
	/>
    </Container>
  )
}
