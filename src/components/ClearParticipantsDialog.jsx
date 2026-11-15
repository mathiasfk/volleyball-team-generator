import { useTranslation } from 'react-i18next'

import { 
  AlertDialogAction,
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription,
  AlertDialogHeader, 
  AlertDialogTitle
} from '@/components/ui/alert-dialog.jsx'

const ClearParticipantsDialog = ({ onConfirm, onCancel }) => {
  const { t } = useTranslation()

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          {t('dialog.clear_participants.title')}
        </AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogDescription className="text-muted-foreground">
        {t('dialog.clear_participants.description')}
      </AlertDialogDescription>
      <AlertDialogAction 
        onClick={onConfirm} 
        className="bg-destructive text-white hover:bg-red-800"
      >
        {t('dialog.clear_participants.confirm')}
      </AlertDialogAction>
      <AlertDialogCancel 
        onClick={onCancel} 
        className="border-input"
      >
        {t('dialog.clear_participants.cancel')}
      </AlertDialogCancel>
    </AlertDialogContent>
  )
}

export default ClearParticipantsDialog

