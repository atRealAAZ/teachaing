// Shared lab idioms: preset cards, stepper pills, block fields, output cards,
// callouts — the visual grammar every lab reuses.

import type { ReactNode } from 'react'
import {
  Badge,
  Box,
  Flex,
  HStack,
  Text,
  Textarea,
  Tooltip,
} from '@chakra-ui/react'

export function PresetCard(props: {
  emoji?: string
  label: string
  description: string
  selected: boolean
  dashed?: boolean
  onClick: () => void
}) {
  const { emoji, label, description, selected, dashed, onClick } = props
  return (
    <Box
      as="button"
      type="button"
      textAlign="left"
      p={4}
      borderRadius="lg"
      border={dashed ? '1px dashed' : '1px solid'}
      borderColor={selected ? 'brand.400' : 'gray.200'}
      bg={selected ? 'brand.50' : 'white'}
      transition="all 0.1s ease"
      _hover={{ borderColor: selected ? 'brand.400' : 'brand.300', bg: 'brand.50' }}
      onClick={onClick}
    >
      <Text fontWeight={600} fontSize="sm" fontFamily="body">
        {emoji ? `${emoji}  ` : ''}
        {label}
      </Text>
      <Text fontSize="xs" color="gray.500" mt={1}>
        {description}
      </Text>
    </Box>
  )
}

export function Stepper(props: { steps: string[]; active: number }) {
  const { steps, active } = props
  return (
    <HStack spacing={0} mt={4} mb={8} flexWrap="wrap" rowGap={2}>
      {steps.map((label, i) => (
        <HStack key={label} spacing={0}>
          {i > 0 && <Box w="16px" h="1px" bg="gray.200" />}
          <Badge
            borderRadius="full"
            px={3}
            py={1}
            colorScheme={i === active ? 'purple' : i < active ? 'purple' : 'gray'}
            variant={i === active ? 'solid' : 'subtle'}
          >
            {label}
          </Badge>
        </HStack>
      ))}
    </HStack>
  )
}

export function BlockField(props: {
  label: string
  topic: string
  hint: string
  example: string
  optional?: boolean
  rows: number
  value: string
  onChange: (value: string) => void
  onInsertExample: () => void
}) {
  const { label, topic, hint, example, optional, rows, value, onChange, onInsertExample } = props
  return (
    <Box>
      <Flex align="baseline" gap={2} flexWrap="wrap">
        <Text fontWeight={600} fontSize="sm" fontFamily="body">
          {label}
        </Text>
        <Badge colorScheme="purple" variant="subtle">
          {topic}
        </Badge>
        {optional && (
          <Badge colorScheme="gray" variant="subtle">
            optional
          </Badge>
        )}
        <Tooltip
          label={
            <Box as="pre" fontFamily="mono" fontSize="xs" whiteSpace="pre-wrap" m={0}>
              {example}
            </Box>
          }
          placement="top-start"
          hasArrow
          maxW="480px"
        >
          <Text
            as="span"
            fontSize="xs"
            color="brand.500"
            cursor="help"
            onClick={() => {
              if (!value.trim()) onInsertExample()
            }}
          >
            example
          </Text>
        </Tooltip>
      </Flex>
      <Text fontSize="xs" color="gray.500" mb={2}>
        {hint}
      </Text>
      <Textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        fontFamily="mono"
        fontSize="xs"
        spellCheck={false}
        placeholder="# type your Python here — hover 'example' if you're stuck (click it to insert)"
      />
    </Box>
  )
}

export function OutputCard(props: {
  label: string
  children: ReactNode
  mono?: boolean
  subdued?: boolean
  maxH?: string
}) {
  const { label, children, mono, subdued, maxH = '360px' } = props
  return (
    <Box border="1px solid" borderColor="gray.200" borderRadius="lg" overflow="hidden">
      <Box bg="gray.50" px={4} py={2} borderBottom="1px solid" borderColor="gray.100">
        <Text fontSize="xs" fontWeight={600} color="gray.500" isTruncated>
          {label}
        </Text>
      </Box>
      <Box
        p={4}
        bg={subdued ? 'gray.50' : 'white'}
        whiteSpace="pre-wrap"
        fontFamily={mono ? 'mono' : 'body'}
        fontSize={mono ? 'xs' : 'sm'}
        maxH={maxH}
        overflowY="auto"
      >
        {children}
      </Box>
    </Box>
  )
}

export function Callout(props: {
  tone: 'warn' | 'guide' | 'success'
  title: string
  children: ReactNode
}) {
  const { tone, title, children } = props
  const colors = {
    warn: { bg: 'orange.50', border: 'orange.200', title: 'orange.800', body: 'orange.700' },
    guide: { bg: 'brand.50', border: 'brand.100', title: 'brand.800', body: 'brand.700' },
    success: { bg: 'green.50', border: 'green.200', title: 'green.800', body: 'green.700' },
  }[tone]
  return (
    <Box bg={colors.bg} border="1px solid" borderColor={colors.border} borderRadius="lg" p={4}>
      <Text fontWeight={600} fontSize="sm" color={colors.title} fontFamily="body">
        {title}
      </Text>
      <Text fontSize="sm" color={colors.body} mt={1}>
        {children}
      </Text>
    </Box>
  )
}

export function MicroLabel(props: { children: ReactNode; onDark?: boolean }) {
  return (
    <Text
      fontSize="xs"
      fontWeight={600}
      textTransform="uppercase"
      letterSpacing="0.05em"
      color={props.onDark ? 'gray.400' : 'gray.500'}
      fontFamily="body"
    >
      {props.children}
    </Text>
  )
}
