module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        float: {
            '0%': {
              filter: 'drop-shadow(2px 10px 0px rgba(0, 0, 0, 0.4))',
              transform: 'translatey(0px)'
            },
            '50%': {
              filter: 'drop-shadow(10px 10px 0px rgba(0, 0, 0, 0.2))',
              transform: 'translatey(-10px)'
            },
            '100%': {
              filter: 'drop-shadow(2px 10px 0px rgba(0, 0, 0, 0.4))',
              transform: 'translatey(0px)'
            }
        }
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
