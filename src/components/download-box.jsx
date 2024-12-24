import { useState, useEffect, memo } from "react"
import {FaSearch} from "react-icons/fa"
import useCollapseNumber from "./utils/collapse-number"
import { FaDownload } from "react-icons/fa";
import axiosRetry from "@/components/utils/fetch-data-retry"
import Hls2Mp4 from './utils/hls2mp4';
import JSZip from 'jszip';




export default function DownloadBox({total_ep}){
	const [currentArray,setCurrentArray] = useState([])
	const [epData,setEpData] = useState("")
	const [isSearch,setSearch] = useState("")
	const [animeId,setAnimeId] = useState("")
	const [progress, setProgress] = useState({});
	const [quality,setQuality] = useState("360")
  const hls2mp4Instance = []
	const data = useCollapseNumber(1,Number(total_ep))
	let isDownload = false

	const qualityOrder = ["360", "480", "720", "1080"];

	function getClosestQualityUrl(availableLinks, desiredQuality) {

  const desiredIndex = qualityOrder.indexOf(desiredQuality);
  
  if (desiredIndex === -1) {
    throw new Error(`Desired quality ${desiredQuality} is not supported.`);
  }

  const sortedLinks = availableLinks.sort((a, b) => {
    return qualityOrder.indexOf(a.quality) - qualityOrder.indexOf(b.quality);
  });

  for (let i = desiredIndex; i >= 0; i--) {
    const link = sortedLinks.find(link => link.quality === qualityOrder[i]);
    if (link) {
      return link.url;
    }
  }

  throw new Error("No suitable quality found.");
	}



	const fetchRealUrl = async (link) => {
    try {
      const data = await axiosRetry(link);
      return  getClosestQualityUrl(data.video_links[0].available_links, quality);
    } catch (error) {
      console.error(`Error fetching real URL for ${link}:`, error);
      return null;
    }
 	 };

  const downloadAndZipVideos = async (videoLinks) => {
  
    const zip = new JSZip();

    try {
      const realUrls = await Promise.all(videoLinks.map(fetchRealUrl));

      const downloadPromises = realUrls.map((url, index) => {
      const hls2mp4 = new Hls2Mp4({
      maxRetry: 3,
      tsDownloadConcurrency: 10,
 	    ffmpegBaseUrl : 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd',
      onProgress: (type, progress) => {
        console.log(`Progress type ${type}: ${progress}`);
        document.querySelector("#progress-box").innerHTML=`	
       	<div class="flex flex-col w-full">
			 		<span class="mb-1">
			 		 ${type == 0 && "Loading Downloader..." ||
        		type == 1 && "Fetching Metadata..." ||
        		type == 2 && "Downloading..." ||
        		type == 3 &&	"Compiling..."
        	 }
			 		</span>
			 		<div class="flex items-center">
			 		<progress class="progress progress-primary w-full rounded-box" max="100"
			 		 value="${progress && Number(progress * 100).toFixed(0)}"></progress>
			 		<span class="px-2 flex items-center">
			 		  <span class="pr-2">
					 ${progress && Number(progress * 100).toFixed(1)}% 
			 		  </span>
						<span>
						(${index + 1}/${hls2mp4Instance.length})
						</span>
			 		</span>
       		</div>
       	</div>
        `
      },
      onError: (error) => {
        console.log({error})
      },
    });

      	hls2mp4Instance.push(hls2mp4)

        if (!url) {
          setProgress((prev) => ({ ...prev, [videoLinks[index]]: 'Failed to fetch real URL' }));
          return Promise.resolve();
        }
        return hls2mp4.download(url).then((buffer) => {
          if (buffer) {
            zip.file(`${animeId}-episode-${index + 1}.mp4`, buffer);
            document.querySelector("#progress-box").innerHTML=`Zipping...`
          } else {
            document.querySelector("#progress-box").innerHTML=`Download`
          }
        }).catch(err => {
          document.querySelector("#progress-box").innerHTML=`Failed Downloading...`
          console.error('Download error:', err);
        });
      });

      await Promise.all(downloadPromises);

      if(isDownload){
       zip.generateAsync({ type: 'blob' }).then((content) => {
        document.querySelector("#progress-box").innerHTML=`Zipped...`
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = `${animeId}.zip`;
        link.click();
        URL.revokeObjectURL(link.href);
      	isDownload = false
      	document.querySelector("#progress-box").innerHTML="Download"
				document.querySelectorAll('.collapse_download_btn').forEach((x) => { x.disabled=false })
				document.querySelectorAll('.download_checkbox').forEach((x) => { x.disabled=false })
				document.querySelector('.selectall_checkbox').disabled=false 
				document.querySelector('.download_btn').disabled=false
				document.querySelectorAll('.download_checkbox').forEach((x) => { x.checked=false })
				document.querySelector('.selectall_checkbox').checked=false 
      });
		 }
    } catch (err) {
      console.error('Error during download and zip:', err);
    }
  };

	useEffect(() => {
		setEpData(data)
		setCurrentArray(
			data?.collapsed_nums_array[0]
		)
		const url = new URL(window.location.href);
        const animeId = url.pathname.replace("/watch/","")
        setAnimeId(animeId)
	},[])

	useEffect(() => {
		if(!isNaN(Number(isSearch)) &&
		 Number(isSearch) > 0 &&
		 Number(isSearch) <= Number(total_ep)){
		 const all_ep = Array.from(Array(Number(total_ep)), (_,i) => {return i + 1 })
		 const new_arr = all_ep.filter((e) => {
			const reg = new RegExp(String(e),"gi")
			if(reg.test(isSearch)) return e 
		 })	
		 setCurrentArray(new_arr.reverse())
		} else {
			setCurrentArray(
				data?.collapsed_nums_array[0]
			)
		}
	},[isSearch])

	const createDownloadLinks = () => {
		const checkboxes = document.querySelectorAll(".download_checkbox")
		const arr = []
		checkboxes.forEach((e) => {
			if(e.checked){
				arr.push(`https://aniswim-api-v2.vercel.app/links?id=${animeId}&ep=${e.dataset.value}`)
			}
		})
		return arr
	}

	const intDownload = (e) => {
		isDownload = true
		const links = createDownloadLinks()
		if(links.length > 0){
			 document.querySelector("#progress-box").innerHTML=`	
			 <div class="flex flex-col w-full">
			 	<span class="mb-1">Initializing...</span>
			 	<progress class="progress progress-primary w-full rounded-box"></progress>
       </div>
        `
			e.target.disabled = true
			document.querySelectorAll('.collapse_download_btn').forEach((x) => { x.disabled=true })
			document.querySelectorAll('.download_checkbox').forEach((x) => { x.disabled=true })
			document.querySelector('.selectall_checkbox').disabled=true 
			downloadAndZipVideos(links)
		}
	}


	const cancelDownload = () => {
			isDownload = false
			for(let i=0;i < hls2mp4Instance.length ; i++){
					 const instance = hls2mp4Instance[i]
					 instance.cancelDownload()
			}
			document.querySelector("#progress-box").innerHTML="Download"
			document.querySelectorAll('.collapse_download_btn').forEach((x) => { x.disabled=false })
			document.querySelectorAll('.download_checkbox').forEach((x) => { x.disabled=false })
			document.querySelector('.selectall_checkbox').disabled=false 
			document.querySelector('.download_btn').disabled=false
			document.querySelectorAll('.download_checkbox').forEach((x) => { x.checked=false })
			document.querySelector('.selectall_checkbox').checked=false 
	}

	return(
	<>
	<button className="btn-sm rounded-full md:btn md:rounded-box hover:text-primary"
 		onClick={
 			()=>document.getElementById('download_modal').showModal()
 		}>
	<FaDownload/>
	</button>
	<dialog id="download_modal" className="modal modal-top [margin-left:0px_!important]">
  	<div className="bg-base-100/60 rounded w-full h-full flex justify-center items-center">
 	
 	<div className="flex bg-base-100 flex-col rounded-box p-2">

 	<span 
 			className="p-2 font-bold text-lg capitalize" 
 			id="progress-box"
 			>
 		Download
 	</span>

 	<div className="flex items-center mb-1 pb-1">

 	<label className="input input-bordered input-sm flex items-center gap-2">
	  <FaSearch/>
	    <input 
		 type="text"
		 className="grow md:w-[250px] w-[150px]"
		  placeholder="Search" 
		  onChange={(e) => {
			setSearch(e.target.value)
		   }}
		  value={isSearch} 
		  />
	  </label>

 	<select onChange={(e) => { setQuality(e.target.value) }} 
 	className="select select-bordered select-sm w-full max-w-xs ml-2">
  	<option disabled defaultValue={qualityOrder[0]}>Quality</option>
		{
			qualityOrder.map((e) => {
				 return <option key={e}>{e}</option>
			})
		}
	</select>

 		</div>

 		<div className="grid grid-cols-3 bg-base-300 p-2 text-xs ">
		{
				epData?.short_form?.map((m) => {
					return <button
					className="m-2 px-2 p-1 bg-base-200 text-primary/50
					 link link-hover link-primary rounded-box collapse_download_btn"
					onClick={() => {
						setCurrentArray(
							epData?.collapsed_nums_array[Number(m.split('-index:')[1])]
						)
					}}
					key={m}>{m.split('-index:')[0]}</button>
				})
		}
	
	</div>

	<div id="episode-download-btn-container" className={`
	  flex flex-col max-h-[150px] md:max-h-[250px] overflow-auto py-2`}>
	  		<div className="form-control">
  			<label className="label cursor-pointer">
   				 <span className="label-text">Select All</span> 
    			<input type="checkbox" className="checkbox checkbox-primary selectall_checkbox" onChange={(e) => {
    				if(e.target.checked){
    					document.querySelectorAll(".download_checkbox").forEach((x) => {
    						x.checked = true
    					})
    				} else {
    					document.querySelectorAll(".download_checkbox").forEach((x) => {
    						x.checked = false
    					})
    				}
    			}} />
  			</label>
			</div>
		{
		   currentArray && currentArray.map((a) => {
		    return(
		    <div className="form-control">
  			<label className="label cursor-pointer">
   				 <span className="label-text">Episode {a}</span> 
    			<input type="checkbox" data-value={a} className="checkbox checkbox-primary download_checkbox" />
  			</label>
			</div>
		    )
		  })
		}
	  </div>
 	  
 	  <div className="flex w-full space-x-2 justify-end items-center py-2">
 	  <button className="btn btn-primary btn-sm download_btn" 
 	  onClick={(e) => {
 	  	intDownload(e)
 	  }}>Download</button>
 	  <form method="dialog">
    		<button onClick={cancelDownload} className="btn btn-error btn-outline btn-sm">Cancel</button>
      </form>
      </div>
      	

      	</div>


    </div>
	</dialog>
	</>
	)
}