import { Box, Button, Text, VStack } from '@chakra-ui/react'

export type View =
  | 'lab'
  | 'usecase'
  | 'cheatsheet'
  | 'mllab'
  | 'mlusecase'
  | 'mlcheatsheet'

function NavButton(props: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <Button
      variant="ghost"
      justifyContent="flex-start"
      w="100%"
      size="sm"
      fontWeight={props.active ? 600 : 500}
      color={props.active ? 'brand.700' : 'gray.600'}
      bg={props.active ? 'brand.50' : 'transparent'}
      _hover={{ bg: props.active ? 'brand.50' : 'gray.100' }}
      onClick={props.onClick}
    >
      {props.label}
    </Button>
  )
}

function SectionLabel(props: { children: string }) {
  return (
    <Text
      px={3}
      fontSize="xs"
      fontWeight={700}
      color="gray.400"
      textTransform="uppercase"
      letterSpacing="0.08em"
    >
      {props.children}
    </Text>
  )
}

export default function Sidebar(props: {
  view: View
  onNavigate: (view: View) => void
}) {
  return (
    <Box
      w="260px"
      flexShrink={0}
      bg="gray.50"
      borderRight="1px solid"
      borderColor="gray.200"
      display="flex"
      flexDirection="column"
      p={4}
    >
      <Box px={2} py={3}>
        <Text fontFamily="heading" fontSize="2xl" letterSpacing="-0.02em">
          The Lab
        </Text>
        <Text fontSize="xs" color="gray.500">
          python · machine learning
        </Text>
      </Box>
      <VStack align="stretch" spacing={1} mt={4}>
        <SectionLabel>Python</SectionLabel>
        <NavButton
          active={props.view === 'lab'}
          label="🧪  The capstone lab"
          onClick={() => props.onNavigate('lab')}
        />
        <NavButton
          active={props.view === 'usecase'}
          label="💡  Use Case"
          onClick={() => props.onNavigate('usecase')}
        />
        <NavButton
          active={props.view === 'cheatsheet'}
          label="📖  Cheatsheet"
          onClick={() => props.onNavigate('cheatsheet')}
        />
      </VStack>
      <VStack align="stretch" spacing={1} mt={6}>
        <SectionLabel>Machine Learning</SectionLabel>
        <NavButton
          active={props.view === 'mllab'}
          label="🤖  The capstone lab"
          onClick={() => props.onNavigate('mllab')}
        />
        <NavButton
          active={props.view === 'mlusecase'}
          label="💡  Use Case"
          onClick={() => props.onNavigate('mlusecase')}
        />
        <NavButton
          active={props.view === 'mlcheatsheet'}
          label="📖  Cheatsheet"
          onClick={() => props.onNavigate('mlcheatsheet')}
        />
      </VStack>
      <Box mt="auto" px={2} pb={1}>
        <Text fontSize="xs" color="gray.400">
          Break it, read the traceback, fix it — that's the whole craft.
        </Text>
      </Box>
    </Box>
  )
}
