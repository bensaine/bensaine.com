/** @type {import('gatsby').GatsbyConfig} */
module.exports = {
	siteMetadata: {
		title: `bensaine.com`,
		siteUrl: `https://bensaine.com`,
	},
	plugins: [
		"gatsby-plugin-netlify",
		"gatsby-plugin-postcss",
		"gatsby-plugin-image",
		"gatsby-plugin-sitemap",
		{
			resolve: "gatsby-plugin-manifest",
			options: {
				icon: "src/images/icon.png",
			},
		},
		"gatsby-plugin-sharp",
		"gatsby-transformer-sharp",
		{
			resolve: "gatsby-source-filesystem",
			options: {
				name: "images",
				path: "./src/images/",
			},
			__key: "images",
		},
		{
			resolve: "gatsby-source-filesystem",
			options: {
				name: "pages",
				path: "./src/pages/",
			},
			__key: "pages",
		},
		{
			resolve: `gatsby-omni-font-loader`,
			options: {
				enableListener: true,
				preconnect: [`https://fonts.googleapis.com`, `https://fonts.gstatic.com`],
				web: [
					{
						name: `Lora`,
						file: `https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&display=swap`,
					},
					{
						name: `Inter`,
						file: `https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap`,
					},
				],
			},
		},
	],
}
