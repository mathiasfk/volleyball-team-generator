import { useTranslation } from 'react-i18next'

import { 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription,
  AlertDialogHeader, 
  AlertDialogTitle} from '@/components/ui/alert-dialog.jsx'
import { Button } from '@/components/ui/button.jsx'

const DrawTeamsDialog = ({ hasExistingTeams, onDrawTeams, onCancel }) => {
  const { t } = useTranslation()

  return (
    <AlertDialogContent className="bg-gray-800 border-gray-700">
      <AlertDialogHeader>
        <AlertDialogTitle className="text-white text-center text-xl">
          {t('dialog.draw_teams.title')}
        </AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogDescription className="text-gray-300 text-center mb-4">
        {t('dialog.draw_teams.description')}
      </AlertDialogDescription>
      <div className="flex flex-col gap-3">
        {hasExistingTeams && (
          <>
            <Button
              onClick={() => onDrawTeams(0)}
              className="bg-red-600 hover:bg-red-700 text-white w-full py-6 text-lg font-semibold"
            >
              {t('dialog.draw_teams.keep_red')}
            </Button>
            <Button
              onClick={() => onDrawTeams(1)}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full py-6 text-lg font-semibold"
            >
              {t('dialog.draw_teams.keep_blue')}
            </Button>
          </>
        )}
        <Button
          onClick={() => onDrawTeams(null)}
          className="bg-green-600 hover:bg-green-700 text-white w-full py-6 text-lg font-semibold"
        >
          {t('dialog.draw_teams.redraw_all')}
        </Button>
        <AlertDialogCancel 
          onClick={onCancel}
          className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white w-full py-6 text-lg"
        >
          {t('dialog.draw_teams.cancel')}
        </AlertDialogCancel>
      </div>
    </AlertDialogContent>
  )
}

export default DrawTeamsDialog

