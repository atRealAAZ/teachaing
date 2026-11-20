import { useEffect, useState } from 'react'
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
import { LAB_RESET_EVENT, usePersistentState } from './persist'

export default function App() {
  // remember the open tab, so a refresh lands where the participant was
  const [view, setView] = usePersistentState<View>('app.view', 'lab')
  // bumped by "Start over": remounts the lab so it rereads its (now empty) storage
  const [resetCount, setResetCount] = useState(0)

  useEffect(() => {
    const onReset = () => setResetCount((n) => n + 1)
    window.addEventListener(LAB_RESET_EVENT, onReset)
    return () => window.removeEventListener(LAB_RESET_EVENT, onReset)
  }, [])

  return (
    <PasscodeGate>
      <Flex h="100vh">
        <Sidebar view={view} onNavigate={setView} />
        <Box key={`${view}-${resetCount}`} flex="1" bg="white" overflow="hidden">
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
