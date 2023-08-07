module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    darkMode: 'class',
    theme: {
      fontFamily: {
        display: ['Open Sans', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
      },
      extend: {
        fontSize: {
          14: '14px',
        },
        backgroundColor: {
          'main-bg': '#EAECEE',
          'main-dark-bg': '#20232A',
          'secondary-dark-bg': '#33373E',
          'light-gray': '#F7F7F7',
          'half-transparent': 'rgba(0, 0, 0, 0.5)',
        },
        borderWidth: {
          1: '1px',
        },
        borderColor: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        width: {
          400: '400px',
          760: '760px',
          780: '780px',
          800: '800px',
          1000: '1000px',
          1200: '1200px',
          1400: '1400px',
        },
        height: {
          80: '80px',
        },
        minHeight: {
          590: '590px',
        },
        backgroundImage: {
          'hero-pattern':
            "url('https://firebasestorage.googleapis.com/v0/b/ots-pocket.appspot.com/o/projectFiles%2Fhero.png?alt=media&token=ac3bfc69-7096-4c38-b603-2974d5eca03a')",
            'hero-water':
            "url('https://firebasestorage.googleapis.com/v0/b/ots-pocket.appspot.com/o/projectFiles%2FCopy%20of%20Copy%20of%20PocSof%20(5).png?alt=media&token=4f76a14d-e7be-4ec2-bb31-217e428f1472')",
            'hero-texus':
            "url('https://firebasestorage.googleapis.com/v0/b/ots-pocket.appspot.com/o/projectFiles%2FCopy%20of%20Copy%20of%20PocSof%20(5).png?alt=media&token=4f76a14d-e7be-4ec2-bb31-217e428f1472')"
        },  
      },
    },
    plugins: [],
  };