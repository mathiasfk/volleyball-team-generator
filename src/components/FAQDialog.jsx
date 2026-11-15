import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx'
import { ScrollArea } from '@/components/ui/scroll-area.jsx'
import { gtag } from '@/services/analytics.js'

function FAQDialog({ open, onOpenChange }) {
  const { t } = useTranslation()
  const questions = t('faq.questions', { returnObjects: true })
  const previousOpenRef = useRef(open)

  // Track when FAQ dialog is opened
  useEffect(() => {
    if (open && !previousOpenRef.current) {
      gtag('event', 'faq_dialog_open', {})
    }
    previousOpenRef.current = open
  }, [open])

  // Track when a question is expanded
  const handleAccordionChange = (value) => {
    if (value) {
      // Extract the index from the value (e.g., "item-0" -> 0)
      const index = parseInt(value.replace('item-', ''), 10)
      const question = questions[index]
      
      gtag('event', 'faq_question_expand', {
        question_index: index,
        question_text: question?.question || '',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-2xl border-[var(--color-border)] bg-[var(--color-card-primary)] text-[var(--color-text-primary)]">
        <DialogHeader>
          <DialogTitle className="ds-text-section text-[var(--color-text-primary)]">{t('faq.title')}</DialogTitle>
          <DialogDescription className="ds-text-secondary text-[var(--color-text-secondary)]">
            {t('faq.title')}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <Accordion type="single" collapsible className="w-full" onValueChange={handleAccordionChange}>
            {questions.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-[var(--color-border)]">
                <AccordionTrigger className="text-left text-[var(--color-text-primary)] hover:text-[var(--color-text-primary)]">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="ds-text-secondary text-[var(--color-text-secondary)]">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default FAQDialog

