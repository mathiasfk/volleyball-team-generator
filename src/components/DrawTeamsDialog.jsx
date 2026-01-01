import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button.jsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.jsx'

const DrawTeamsDialog = ({ open, onOpenChange, hasExistingTeams, onDrawTeams, onCancel }) => {
  const { t } = useTranslation()

  const handleOpenChange = (value) => {
    if (!value) {
      onCancel()
    } else {
      onOpenChange?.(value)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
      <DialogHeader>
        <DialogTitle className="text-white text-center text-xl">
          {t('dialog.draw_teams.title')}
        </DialogTitle>
        <DialogDescription className="text-gray-300 text-center">
          {t('dialog.draw_teams.description')}
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-3 py-4">
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
      </div>
      <DialogFooter>
        <Button
          onClick={onCancel}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white w-full py-6 text-lg"
        >
          {t('dialog.draw_teams.cancel')}
        </Button>
      </DialogFooter>
    </DialogContent>
    </Dialog>
  )
}

export default DrawTeamsDialog

