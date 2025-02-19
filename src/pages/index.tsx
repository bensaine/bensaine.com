import { IconProp, library } from "@fortawesome/fontawesome-svg-core"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { far } from "@fortawesome/free-regular-svg-icons"
import { fas } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import Couch from "../images/couch.svg"
import Links from "../images/links.svg"
library.add(fas, far, fab)

export const footerLinks = [
	{
		name: "github",
		url: "https://github.com/bensaine",
		icon: ["fab", "github"],
	},
	{
		name: "linkedin",
		url: "https://www.linkedin.com/in/ben-saine",
		icon: ["fab", "linkedin"],
	},
	{
		name: "email",
		url: "mailto:bensaine09@gmail.com",
		icon: ["fas", "envelope"],
	},
]

export function Head() {
	return (
		<>
			<meta charSet="utf-8" />
			<title>Ben Saine | bensaine.com</title>
			<meta name="description" content="I am a software developer located in Montreal, Canada with a passion for problem solving." />
		</>
	)
}

// markup
const IndexPage = () => {
	return (
		<>
			{/* <SplashScreen /> */}
			<main className="flex-row font-sans text-gray-200 h-screen overflow-hidden">
				<div className="bg-gradient-to-b from-slate-800 to-slate-700 h-screen flex items-center">
					<div className="container mx-auto px-4 py-12 mt-[-5em]">
						<div className="flex flex-col items-center justify-center gap-8 p-10 md:pb-24 pb-36">
							<h1 className="text-6xl lg:text-8xl handwriting text-[#b8d2ff] text-center">Hi, I'm Ben.</h1>
							<h2 className="text-xl lg:text-2xl text-center">
								Welcome. Make yourself at home. It's still quite empty in here — I'm currently out and about getting some furniture.
								<br /> Check back soon!
							</h2>
						</div>
					</div>
				</div>
				<span className="absolute right-16 bottom-14">
					<object className="w-44 select-none pointer-events-none" type="image/svg+xml" data={Links}>
						My links
					</object>
				</span>
				<span className="absolute left-44 bottom-28 hidden sm:block">
					<object className="w-44 select-none pointer-events-none" type="image/svg+xml" data={Couch}>
						A couch, at least...
					</object>
				</span>
				<span className="absolute hidden sm:block left-28 bottom-20 text-5xl select-none pointer-events-none">🛋️</span>
				<div className="flex flex-col justify-between fixed bottom-0 right-0 p-2 rounded-tl-xl bg-gradient-to-br from-gray-800 to-gray-900 bg-opacity-20 backdrop-blur-xl">
					<div className="flex justify-between">
						{footerLinks.map((link) => (
							<div key={link.name} className="rounded-full leading-[initial] cursor-pointer bg-gradient-to-br from-gray-600 to-gray-800 p-2 mx-1">
								<a href={link.url} aria-label={link.name} target="_blank" className="text-white opacity-90">
									<FontAwesomeIcon icon={link.icon as IconProp} size="1x" fixedWidth />
								</a>
							</div>
						))}
					</div>
				</div>
			</main>
		</>
	)
}

export default IndexPage
