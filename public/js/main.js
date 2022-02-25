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

      if(typeof page_no == 'undefined'){
	  next_btn.dataset.page=1
	} else {
	    prev_btn.style.display = "flex"
	    next_btn.dataset.page = page_no
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
	
	const srch_inp = document.querySelector('.srch-txt')
	
	function search_this(){
	let pre_query = srch_inp.value
	  if(pre_query.length == ''){
		console.log(`Can't just search for nothing!`)
	  } else {
	    const query = pre_query.replace(/\s/g,'+')
	    window.location.href = `/search?q=${query}`
	  }
	}

      srch_inp.addEventListener('keypress', function(e){
	if(e.key === 'Enter'){
		search_this()
	}
      })
	
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

