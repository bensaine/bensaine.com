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
	],
}
