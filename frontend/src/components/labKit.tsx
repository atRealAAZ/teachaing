// Shared lab idioms: preset cards, stepper pills, block fields, output cards,
// callouts — the visual grammar every lab reuses.

import type { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import {
  Badge,
  Box,
  Code,
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
  topic?: string
  hint: string
  example: string
  optional?: boolean
  rows: number
  value: string
  onChange: (value: string) => void
  onInsertExample: () => void
  mono?: boolean
  placeholder?: string
}) {
  const {
    label,
    topic,
    hint,
    example,
    optional,
    rows,
    value,
    onChange,
    onInsertExample,
    mono = true,
    placeholder = "# type your Python here — hover 'example' if you're stuck (click it to insert)",
  } = props
  return (
    <Box>
      <Flex align="baseline" gap={2} flexWrap="wrap">
        <Text fontWeight={600} fontSize="sm" fontFamily="body">
          {label}
        </Text>
        {topic && (
          <Badge colorScheme="purple" variant="subtle">
            {topic}
          </Badge>
        )}
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
        fontFamily={mono ? 'mono' : 'body'}
        fontSize={mono ? 'xs' : 'sm'}
        spellCheck={false}
        placeholder={placeholder}
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

// Streaming AI answers arrive as markdown — render them in the lab's own
// voice: serif headings, quiet body text, dark mono code blocks.
export function MarkdownOutput(props: { children: string }) {
  return (
    <Box whiteSpace="normal">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <Text fontFamily="heading" fontSize="xl" mt={5} mb={2} sx={{ ':first-child': { mt: 0 } }}>
              {children}
            </Text>
          ),
          h2: ({ children }) => (
            <Text fontFamily="heading" fontSize="lg" mt={5} mb={2} sx={{ ':first-child': { mt: 0 } }}>
              {children}
            </Text>
          ),
          h3: ({ children }) => (
            <Text fontWeight={600} fontSize="sm" mt={4} mb={1}>
              {children}
            </Text>
          ),
          p: ({ children }) => (
            <Text fontSize="sm" color="gray.700" mb={2} lineHeight="1.7">
              {children}
            </Text>
          ),
          ul: ({ children }) => (
            <Box as="ul" pl={5} mb={3} fontSize="sm" color="gray.700">
              {children}
            </Box>
          ),
          ol: ({ children }) => (
            <Box as="ol" pl={5} mb={3} fontSize="sm" color="gray.700">
              {children}
            </Box>
          ),
          li: ({ children }) => (
            <Box as="li" mb={1} lineHeight="1.7">
              {children}
            </Box>
          ),
          code: ({ children, className }) =>
            className || String(children).includes('\n') ? (
              <Box
                as="pre"
                bg="gray.900"
                color="gray.100"
                fontFamily="mono"
                fontSize="xs"
                p={4}
                borderRadius="md"
                overflowX="auto"
                whiteSpace="pre-wrap"
                my={3}
              >
                {children}
              </Box>
            ) : (
              <Code fontSize="xs" colorScheme="purple">
                {children}
              </Code>
            ),
          pre: ({ children }) => <>{children}</>,
          strong: ({ children }) => (
            <Text as="strong" fontWeight={600}>
              {children}
            </Text>
          ),
          hr: () => <Box borderTop="1px solid" borderColor="gray.200" my={4} />,
        }}
      >
        {props.children}
      </ReactMarkdown>
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
