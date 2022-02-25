    let params = {};

    if (location.search) {
	let parts = location.search.substring(1).split('&');

	for (let i = 0; i < parts.length; i++) {
	    let nv = parts[i].split('=');
	    if (!nv[0]) continue;
	    params[nv[0]] = nv[1] || true;
	}
    }

      const page_no = params.page ; 
      const next_btn = document.querySelector('.next-pg') 
      const prev_btn = document.querySelector('.prev-pg')

      try{
	    if(typeof page_no == 'undefined'){
		next_btn.dataset.page=1
	      } else {
		  prev_btn.style.display = "flex"
		  next_btn.dataset.page = page_no
	      } 
      } catch (error) {
		console.log(error)
	      }

	  if(page_no == 1){
	prev_btn.style.display = "none"
	    }

	function go_NextPage(){
	
	  const nxp = Number(next_btn.dataset.page) + 1

	  if(window.location.pathname == '/search'){
	    window.location.href = `search?q=${params.q}&page=${nxp}`
	  } else {
	    window.location.href = `?page=${nxp}`
	  }

	  }
  	
	function go_PreviousPage(){
	  
	  const nxp = Number(next_btn.dataset.page) - 1
	  
	  if(window.location.pathname == '/search'){
	    window.location.href = `search?q=${params.q}&page=${nxp}`
	  } else {
		  window.location.href = `?page=${nxp}`
	  }

	  }
	
	

	
	if(window.location.pathname == '/latest'){
	const top_or_latest =	document.querySelector('.latest-h1')
	  top_or_latest.textContent = "Popular"
	  window.document.title = "Home | Recent Uploaded Anime"

	  top_or_latest.setAttribute("onClick","javascript: window.location.href = '/' ")
	  	
	}
	
    if(window.location.pathname == "/search"){
      document.querySelector('.srch-for').textContent = `Searched Results For ~ ${params.q.replace('+',' ')}`
		    window.document.title = "Searched-" + params.q.replace('+',' ')
    } else {
      document.querySelector('.srch-prompt').style.display = "none"
    }

