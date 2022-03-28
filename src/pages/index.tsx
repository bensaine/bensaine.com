import * as React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core';
library.add(fas, far, fab)

export const footerLinks = [
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
			<title>bensaine.com</title>
			<div className="bg-gradient-to-b from-slate-800 to-slate-700 h-screen flex items-center">
				<div className="container mx-auto px-4 py-16 mt-[-5em]">
					<div className="flex flex-col items-center justify-center gap-8 p-10">
						<h1 className="text-8xl font-bold handwriting text-[#b8d2ff] text-center">Site under renovation.</h1>
					</div>
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
