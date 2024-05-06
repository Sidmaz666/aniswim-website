export default function Container({children,className}){
  return(
    <section className={`px-4 md:px-6  ${className ? className : ''}`}>
      {children}
    </section>
  )
}
