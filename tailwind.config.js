/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      // เพิ่มไฟล์ที่คุณใช้ tailwind css ถ้าใช้อยู่
    ],
    theme: {
      extend: {
        animation: {
          'slide-down': 'slideDown 0.3s ease-out',
        },
        keyframes: {
          slideDown: {
            '0%': { transform: 'translateY(-100%)' },
            '100%': { transform: 'translateY(0)' },
          },
        },
      },
    },
    plugins: [],
  }
  