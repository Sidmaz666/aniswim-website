import { Noto_Sans_JP, Noto_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/global/theme-provider";
import NextTopLoader from 'nextjs-toploader';
import Navbar from "@/components/global/navbar";


const notoSansJP = Noto_Sans_JP({ subsets: ['latin'] , preload: false });
const notoSans = Noto_Sans({ subsets: ['latin', 'vietnamese', 'cyrillic'] , preload: false  });

export const metadata = {
  title: "Aniswim ~ Watch & Download Anime Unlimited",
  description: "Aniswim offers free unlimited anime streaming and downloading services, all the data provided here are out sourced from a third-party.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
     <head>
  		<meta 
  			property="og:title" 
  			content="Aniswim ~ Watch & Download Anime Unlimited"/>
  		<meta 
  			property="og:type" 
  			content="website"/>
  		<meta 
  			property="og:image" 
  			content="https://aniswim.vercel.app/preview.png"/>
  		<meta 
  			property="og:url" 
  			content="https://aniswim.vercel.app/"/>
		<meta property="twitter:card" content="Aniswim ~ Watch & Download Anime Unlimited" />
  		<meta 
  			name="twitter:image" 
  			content="https://aniswim.vercel.app/preview.png"/>
  		<meta 
  			name="keywords" 
  			content="aniswim, watch, anime, stream, movie, animated, download anime, free anime"/>
  		<meta 
  			property="og:description" 
  			content="Aniswim offers free unlimited anime streaming and downloading services, all the data provided here are out sourced from a third-party."/>
  		<meta 
  			name="description" 
  			content="Aniswim offers free unlimited anime streaming and downloading services, all the data provided here are out sourced from a third-party."/>
  		<meta 
  			property="og:site_name" 
  			content="Aniswim ~ Watch & Download Anime Unlimited"/>
  		<meta 
  			name="twitter:image:alt" 
  			content="Aniswim ~ Watch & Download Anime Unlimited"/>
     </head>
    <body className={`${notoSansJP.className} ${notoSans.className} overflow-hidden`}>
  	<ThemeProvider
	  themes={[
	    "light",
	    "bumblebee",
	    "retro",
	    "synthwave",
	    "coffee",
	    "dark",
	    "forest",
	    "dracula",
	    "night",
	    "sunset",
	  ]}
	  >
		<NextTopLoader showSpinner={false} color="oklch(var(--p))" zIndex={9999} />
	    <Navbar>
		{children}
	    </Navbar>
    	</ThemeProvider>
      </body>
    </html>
  );
}
