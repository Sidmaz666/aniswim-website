async function render_home(res,page,wpg){
  try{
  const axios = require('axios')
  const topAnime_JSON_url = `https://aniswim-api.vercel.app/${wpg}page=${page}`
  const fetch_json = await axios(topAnime_JSON_url)
  const json_data = fetch_json.data
  

  res.status(200).render('index', { json_data }  )

  } catch (error){
    console.log(error)
  }
}

async function render_vPage(res,get_id,get_ep){
  try{
  const axios = require('axios')
  const Anime_JSON_url = `https://aniswim-api.vercel.app/anime?id=${get_id}&ep=${get_ep}`
  const fetch_json = await axios(Anime_JSON_url)
  const json_data = fetch_json.data
 
  res.status(200).render('anime', { json_data , get_id  })
 
  } catch (error){
    console.log(error)
  }
}


module.exports = {
  render_home,
  render_vPage
}
