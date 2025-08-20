
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { mora:"#6B2A82", babaco:"#F4C542", menta:"#6BC9A6", yogurt:"#FFF7F2" },
      borderRadius: { lg2:"24px" },
      boxShadow: { card:"0 8px 20px rgba(0,0,0,.06)" }
    }
  },
  plugins: []
}
