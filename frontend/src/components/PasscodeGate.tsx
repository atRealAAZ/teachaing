import { useState, type ReactNode } from 'react'
import { Box, Button, Heading, Input, Stack, Text } from '@chakra-ui/react'
import api, { setLabPasscode } from '../api'

const DISMISSED_KEY = 'lab_passcode_entered'

export default function PasscodeGate({ children }: { children: ReactNode }) {
  const [entered, setEntered] = useState(
    () => sessionStorage.getItem(DISMISSED_KEY) === 'true'
  )
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)

  if (entered) return <>{children}</>

  const submit = async () => {
    setError('')
    setChecking(true)
    setLabPasscode(value.trim())
    try {
      await api.post('/lab/passcode-check')
      sessionStorage.setItem(DISMISSED_KEY, 'true')
      setEntered(true)
    } catch {
      setLabPasscode('')
      setError('Wrong passcode — check with your trainer.')
    } finally {
      setChecking(false)
    }
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
        {error && (
          <Text fontSize="sm" color="red.500">
            {error}
          </Text>
        )}
        <Button colorScheme="blue" onClick={submit} isLoading={checking}>
          Continue
        </Button>
      </Stack>
    </Box>
  )
}
