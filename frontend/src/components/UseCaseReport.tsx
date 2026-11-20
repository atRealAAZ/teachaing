// "Download as PDF" for the use case labs. We render a clean, print-only
// report into <body> and open the browser's print dialog, where the
// participant picks "Save as PDF". That keeps text selectable and renders the
// AI's markdown (code blocks, lists, ✓ → €) exactly as on screen.

import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Box, Heading, Text } from '@chakra-ui/react'
import { MarkdownOutput, MicroLabel } from './labKit'

export type ReportMsg = { role: 'user' | 'assistant'; content: string }

export interface UseCaseReportData {
  kind: string // "ML use case"
  taskLabel: string // "Prediction / decision"
  problem: string
  task: string
  frequency: string
  timePer: string
  hourlyRate: number
  estimate: { hoursPerMonth: number; savedHours: number; savedEuro: number }
  blocks: { label: string; value: string }[]
  advice: string
  buildMsgs: ReportMsg[]
}

function Section(props: { title: string; children: ReactNode }) {
  return (
    <Box mt={7}>
      <Heading fontSize="xl" mb={3} pb={1} borderBottom="1px solid" borderColor="gray.200">
        {props.title}
      </Heading>
      {props.children}
    </Box>
  )
}

function Report({ data }: { data: UseCaseReportData }) {
  const { estimate } = data
  const filled = data.blocks.filter((b) => b.value.trim())
  const msgs = data.buildMsgs.filter((m) => m.content.trim())
  const date = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Box className="print-report" color="gray.800" fontFamily="body">
      <MicroLabel>
        {data.kind} · {date}
      </MicroLabel>
      <Heading fontSize="3xl" mt={1}>
        {data.task.trim() || `My ${data.kind}`}
      </Heading>

      <Section title="The problem">
        <Text fontSize="sm" whiteSpace="pre-wrap" lineHeight="1.7">
          {data.problem.trim() || '—'}
        </Text>
        <Text fontSize="sm" mt={3}>
          <b>{data.taskLabel}:</b> {data.task.trim() || '—'}
        </Text>
        <Text fontSize="sm" mt={1}>
          <b>How often:</b> {data.frequency.trim() || '—'} · <b>Time per instance:</b>{' '}
          {data.timePer.trim() || '—'} · <b>Hourly rate:</b> €{data.hourlyRate || 0}
        </Text>
        {estimate.hoursPerMonth > 0 && (
          <Text fontSize="sm" mt={3}>
            Costs about <b>{estimate.hoursPerMonth.toFixed(1)} hours per month</b> today;
            potential saving <b>~{estimate.savedHours.toFixed(1)} hours</b> (≈{' '}
            <b>€{Math.round(estimate.savedEuro)}</b>) per month.
          </Text>
        )}
      </Section>

      {filled.length > 0 && (
        <Section title="My solution plan">
          {filled.map((b) => (
            <Box key={b.label} mb={3} className="print-keep">
              <Text fontSize="sm" fontWeight={600}>
                {b.label}
              </Text>
              <Text fontSize="sm" whiteSpace="pre-wrap" color="gray.700" lineHeight="1.6">
                {b.value.trim()}
              </Text>
            </Box>
          ))}
        </Section>
      )}

      {data.advice.trim() && (
        <Section title="AI advice">
          <MarkdownOutput>{data.advice}</MarkdownOutput>
        </Section>
      )}

      {msgs.length > 0 && (
        <Section title="Build session">
          {msgs.map((m, i) => (
            <Box
              key={i}
              mb={4}
              pl={3}
              borderLeft="3px solid"
              borderColor={m.role === 'assistant' ? 'brand.300' : 'gray.300'}
            >
              <MicroLabel>{m.role === 'assistant' ? 'Build coach' : 'Me'}</MicroLabel>
              {m.role === 'assistant' ? (
                <Box mt={1}>
                  <MarkdownOutput>{m.content}</MarkdownOutput>
                </Box>
              ) : (
                <Text fontSize="sm" whiteSpace="pre-wrap" mt={1}>
                  {m.content}
                </Text>
              )}
            </Box>
          ))}
        </Section>
      )}
    </Box>
  )
}

// Returns the portal to render (null when idle) and a function that prints it.
export function useUseCaseReport(data: UseCaseReportData) {
  const [printing, setPrinting] = useState(false)
  // Browsers use the document title as the suggested PDF filename.
  const pdfTitle = `${data.kind} - ${data.task.trim() || 'plan'}`.slice(0, 80)

  useEffect(() => {
    if (!printing) return
    const previousTitle = document.title
    document.title = pdfTitle
    const done = () => {
      document.title = previousTitle
      setPrinting(false)
    }
    window.addEventListener('afterprint', done, { once: true })
    // let the portal paint (and fonts settle) before opening the dialog
    const t = window.setTimeout(() => window.print(), 50)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('afterprint', done)
      document.title = previousTitle
    }
  }, [printing, pdfTitle])

  const portal = printing ? createPortal(<Report data={data} />, document.body) : null
  return { portal, print: () => setPrinting(true), printing }
}
