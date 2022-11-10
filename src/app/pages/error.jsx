import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Card from '../components/card.jsx'

export default function Error(){
  const [isJson,setJson] = useState({}) 
  useEffect(() => {
    const fetch = async () => {
      const req = await axios('https://api.waifu.im/random/?selected_tags=waifu')
      const data = await req.data
      setJson(data.images[0])
      console.log(data)
    }
    fetch();
  },[])

  return (
    <>
      {
      isJson ?
	  <>
	      <Card 
		style={{ cursor:`not-allowed` }}
		poster={isJson.url}
      		key={isJson.signature}
      		animeId={"one-piece"}
      		title="Error 404!"
	      	/>

	</>
	: ""
      }
    </>
  )
}
