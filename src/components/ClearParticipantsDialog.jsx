import { useTranslation } from 'react-i18next'
import { 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel 
} from '@/components/ui/alert-dialog.jsx'

const ClearParticipantsDialog = ({ onConfirm, onCancel }) => {
  const { t } = useTranslation()

  return (
    <AlertDialogContent className="bg-gray-800 border-gray-700">
      <AlertDialogHeader>
        <AlertDialogTitle className="text-white">
          {t('dialog.clear_participants.title')}
        </AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogDescription className="text-gray-300">
        {t('dialog.clear_participants.description')}
      </AlertDialogDescription>
      <AlertDialogAction 
        onClick={onConfirm} 
        className="bg-red-600 hover:bg-red-700"
      >
        {t('dialog.clear_participants.confirm')}
      </AlertDialogAction>
      <AlertDialogCancel 
        onClick={onCancel} 
        className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
      >
        {t('dialog.clear_participants.cancel')}
      </AlertDialogCancel>
    </AlertDialogContent>
  )
}

export default ClearParticipantsDialog

