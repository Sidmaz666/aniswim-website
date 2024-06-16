import Container from "@/components/global/page-container"
import TodaySchedule from "@/components/schedule-section";

export default function Schedule(){
  return(
    <Container>
      <TodaySchedule className="" expand={true} />
    </Container>
  )
}
