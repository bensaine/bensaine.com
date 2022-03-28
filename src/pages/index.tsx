import * as React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core';
library.add(fas, far, fab)

const footerLinks = [
	{
		name: "github",
		url: "https:/github.com/bensaine",
		icon: ['fab', 'github'],
	},
	{
		name: "linkedin",
		url: "https://ca.linkedin.com/in/benjamin-saine",
		icon: ['fab', 'linkedin'],
	},
	{
		name: "email",
		url: "mailto:bensaine09@gmail.com",
		icon: ['fas', 'envelope'],
	},
]

// markup
const IndexPage = () => {
	return (
		<main className="flex-row font-sans text-gray-200 min-h-screen">
			<title>Home Page</title>
			<div className="bg-gradient-to-b from-slate-800 to-slate-700 h-screen flex items-center">
				<div className="container mx-auto px-4 py-16">
					<div className="flex items-end justify-center bg-gradient-to-br from-white/80 to-white/10 backdrop-blur-lg rounded-xl border-2 p-10">
						<h1 className="text-8xl font-bold handwriting drop-shadow-lg text-transparent bg-clip-text bg-gradient-to-br from-[#66acee] to-[#0075ff]">Ben Saine</h1>
						<p className="text-2xl flex items-center">I am a full stack developer located in&nbsp; 
						<span className="inline-block bg-orange-50 opacity-80 text-gray-800 mx-1 py-1 px-2 rounded-lg font-mono text-sm">
							<FontAwesomeIcon icon={["fas", "location-dot"] as IconProp} className="text-[#f03a3a]"/>
							&nbsp;Montreal, Canada
						</span> 
						&nbsp;with a passion for problem solving.</p>
					</div>
				</div>
			</div>
			<div className="bg-gradient-to-b from-slate-700 to-slate-600">
				<div className="container mx-auto px-4 py-16">
					<h2 className="text-2xl font-bold">My skills</h2>
				</div>
			</div>
			<div className="bg-gradient-to-b from-slate-600 to-slate-500 h-screen">
				<div className="container mx-auto px-4 py-16">
					<h2 className="text-2xl font-bold">My projects</h2>
				</div>
			</div>
			<div className="flex flex-col justify-between fixed bottom-0 right-0 p-2 group hover:h-24 rounded-tl-xl bg-gradient-to-br from-gray-800 to-gray-900 bg-opacity-20 backdrop-blur-xl">
				<div className="hidden group-hover:flex items-center justify-center">
					<FontAwesomeIcon icon={["fas", "link"] as IconProp} fixedWidth/>
					<span className="text-center handwriting text-xl ml-2"> Links</span>
				</div>
				<div className="flex justify-between">	
					{footerLinks.map((link) => (
						<div key={link.name} className="rounded-full leading-[initial] cursor-pointer bg-gradient-to-br from-gray-600 to-gray-800 p-2 mx-1">
							<a href={link.url} target="_blank" className="text-white opacity-90">
								<FontAwesomeIcon icon={link.icon as IconProp} size="1x" fixedWidth/>
							</a>
						</div>
					))}
				</div>
			</div>
		</main>
	)
}

export default IndexPage
