export default function SkelCard({len,className,figClass,imageClass}){
  const def = Array.from({length: len}, (_, i) => i)
  return(
    <>
    {
      def.map((m) => {
	return <div className={`
	    md:[flex:0_0_300px] [flex:0_0_200px]
	    rounded-box mr-3 mb-4
	    ${className && className}
	      `}
	     key={m}
	     >
	     <div className={`md:w-[300px] w-[200px] ${figClass && figClass}`}>
	     <figure className='pt-2 px-2'>
	       <div
	       className={`skeleton w-full h-[200px] md:h-[300px] rounded-t-box ${imageClass}`}
	       ></div>
	     </figure>
	    <div className="p-3 ">
		<span className='capitalize line-clamp-2 h-12 font-medium skeleton'>
	       </span>
	    </div>
	  </div>
       </div>
      })
    }
    </>
  )
}
