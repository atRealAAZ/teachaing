import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  config: { initialColorMode: 'light', useSystemColorMode: false },
  fonts: {
    heading: `'Instrument Serif', Georgia, serif`,
    body: `'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    mono: `'JetBrains Mono', 'SF Mono', 'Fira Code', monospace`,
  },
  colors: {
    brand: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
    },
    gray: {
      25: '#fcfcfd',
      50: '#f8f9fb',
      100: '#f1f3f5',
      200: '#e2e5e9',
      300: '#d0d5db',
      400: '#9aa1ab',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
      950: '#030712',
    },
    warm: { 50: '#fefdfb', 100: '#fdf8f0' },
  },
  radii: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
  },
  shadows: {
    card: '0 1px 2px rgba(16, 24, 40, 0.04), 0 1px 3px rgba(16, 24, 40, 0.06)',
    cardHover:
      '0 2px 4px rgba(16, 24, 40, 0.05), 0 4px 12px rgba(16, 24, 40, 0.08)',
    input: '0 1px 2px rgba(16, 24, 40, 0.04)',
  },
  styles: {
    global: {
      body: {
        bg: 'white',
        color: 'gray.900',
        fontSize: 'sm',
        lineHeight: 'tall',
      },
    },
  },
  components: {
    Heading: {
      baseStyle: { fontWeight: 400, letterSpacing: '-0.02em' },
    },
    Button: {
      baseStyle: {
        fontFamily: 'body',
        fontWeight: 500,
        letterSpacing: '-0.01em',
        borderRadius: 'md',
        transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      sizes: {
        sm: { h: '32px' },
        md: { h: '38px' },
        lg: { h: '44px', fontWeight: 600 },
      },
      variants: {
        outline: {
          borderColor: 'gray.200',
          _hover: { bg: 'gray.50' },
        },
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            borderColor: 'gray.200',
            borderRadius: 'md',
            boxShadow: 'input',
            _hover: { borderColor: 'gray.300' },
            _placeholder: { color: 'gray.400' },
            _focus: {
              borderColor: 'brand.500',
              boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
            },
          },
        },
      },
    },
    Textarea: {
      variants: {
        outline: {
          borderColor: 'gray.200',
          borderRadius: 'md',
          boxShadow: 'input',
          _hover: { borderColor: 'gray.300' },
          _placeholder: { color: 'gray.400' },
          _focus: {
            borderColor: 'brand.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
          },
        },
      },
    },
    Select: {
      variants: {
        outline: {
          field: {
            borderColor: 'gray.200',
            borderRadius: 'md',
            _hover: { borderColor: 'gray.300' },
            _focus: {
              borderColor: 'brand.500',
              boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
            },
          },
        },
      },
    },
    Modal: {
      baseStyle: {
        dialog: { borderRadius: 'xl', boxShadow: 'xl' },
        overlay: { bg: 'blackAlpha.400', backdropFilter: 'blur(8px)' },
      },
    },
    Table: {
      baseStyle: {
        th: {
          fontFamily: 'body',
          fontWeight: 500,
          fontSize: 'xs',
          textTransform: 'none',
          color: 'gray.500',
          borderColor: 'gray.100',
        },
        td: { borderColor: 'gray.100' },
      },
    },
    Badge: {
      baseStyle: {
        fontFamily: 'body',
        fontWeight: 500,
        borderRadius: 'md',
        fontSize: 'xs',
        textTransform: 'none',
      },
    },
    Tooltip: {
      baseStyle: { bg: 'gray.800', fontSize: 'xs', borderRadius: 'md' },
    },
    Divider: {
      baseStyle: { borderColor: 'gray.100' },
    },
  },
})

export default theme
