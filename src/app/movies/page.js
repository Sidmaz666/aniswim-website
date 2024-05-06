import Container from "@/components/global/page-container"
import InfiniteScrollBox from "@/components/infinite-scroll-box"

export default function Movies(){
  return(
    <Container>
    	<InfiniteScrollBox 
	  url={`https://aniswim-api-v2.vercel.app/movies`}
	/>
    </Container>
  )
}
