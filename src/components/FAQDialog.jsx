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
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-blue-400">{t('faq.title')}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {t('faq.title')}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <Accordion type="single" collapsible className="w-full" onValueChange={handleAccordionChange}>
            {questions.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-gray-700">
                <AccordionTrigger className="text-left text-gray-200 hover:text-white">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400">
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

