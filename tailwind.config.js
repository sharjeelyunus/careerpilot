/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    // Add other directories within src that might contain Tailwind classes
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // A broader catch-all for src
  ],
  theme: {
    extend: {
      // It seems most theme customizations are in globals.css
      // We can migrate them here later if desired.
    },
  },
  plugins: [
    require("tailwindcss-animate"), // This was in globals.css as @plugin
    // other plugins can be added here
  ],
}; 