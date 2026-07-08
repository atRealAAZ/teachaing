import { useState, type ReactNode } from 'react'
import { Box, Button, Heading, Input, Stack, Text } from '@chakra-ui/react'
import { setLabPasscode } from '../api'

const DISMISSED_KEY = 'lab_passcode_entered'

export default function PasscodeGate({ children }: { children: ReactNode }) {
  const [entered, setEntered] = useState(
    () => sessionStorage.getItem(DISMISSED_KEY) === 'true'
  )
  const [value, setValue] = useState('')

  if (entered) return <>{children}</>

  const submit = () => {
    setLabPasscode(value.trim())
    sessionStorage.setItem(DISMISSED_KEY, 'true')
    setEntered(true)
  }

  return (
    <Box h="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
      <Stack spacing={4} w="320px" p={8} bg="white" borderRadius="md" boxShadow="md">
        <Heading size="md">Python Lab</Heading>
        <Text fontSize="sm" color="gray.600">
          Enter the passcode your trainer shared to start the lab.
        </Text>
        <Input
          type="password"
          placeholder="Passcode"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          autoFocus
        />
        <Button colorScheme="blue" onClick={submit}>
          Continue
        </Button>
      </Stack>
    </Box>
  )
}
