import { useState } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import Sidebar, { type View } from './components/Sidebar'
import PythonLab from './components/PythonLab'
import UseCaseLab from './components/UseCaseLab'
import MLLab from './components/MLLab'
import MLUseCaseLab from './components/MLUseCaseLab'
import AIEngUseCaseLab from './components/AIEngUseCaseLab'
import Cheatsheet from './components/Cheatsheet'
import MLCheatsheet from './components/MLCheatsheet'
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
          ) : view === 'mllab' ? (
            <MLLab />
          ) : view === 'mlusecase' ? (
            <MLUseCaseLab />
          ) : view === 'mlcheatsheet' ? (
            <MLCheatsheet />
          ) : view === 'aiengusecase' ? (
            <AIEngUseCaseLab />
          ) : (
            <Cheatsheet />
          )}
        </Box>
      </Flex>
    </PasscodeGate>
  )
}
