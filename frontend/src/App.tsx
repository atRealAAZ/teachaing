import { useState } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import Sidebar, { type View } from './components/Sidebar'
import PythonLab from './components/PythonLab'
import UseCaseLab from './components/UseCaseLab'
import Cheatsheet from './components/Cheatsheet'
import PasscodeGate from './components/PasscodeGate'

export default function App() {
  const [view, setView] = useState<View>('lab')

  return (
    <PasscodeGate>
      <Flex h="100vh">
        <Sidebar view={view} onNavigate={setView} />
        <Box flex="1" bg="white" overflow="hidden">
          {view === 'lab' ? (
            <PythonLab />
          ) : view === 'usecase' ? (
            <UseCaseLab />
          ) : (
            <Cheatsheet />
          )}
        </Box>
      </Flex>
    </PasscodeGate>
  )
}
