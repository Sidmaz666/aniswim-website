import Link from "next/link";

export default function ListOption({className,disableHeading}){
  const options = [...Array(26).keys()].map(i => String.fromCharCode(i + 97)).concat([...Array(10).keys()].map(i => i.toString()));

  return(
       <div className={`flex flex-col space-y-4 pt-10 ${className && className}`}>
    	{
	  disableHeading ?
		null
	  :
	    <span className='py-2 text-xl font-semibold'>
    			A-Z List
    	    </span>
	}
       <div className={`flex flex-wrap`}>
		{
		  options.map((o,i) => {
		   return <a href={`/list/${o}`} key={o+i} 
		     className="capitalize btn btn-sm btn-outline btn-primary m-2">
		      {o}
		    </a>
		  })
		}
       </div>
     </div>
  )
}
