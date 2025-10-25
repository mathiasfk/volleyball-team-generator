import { useEffect, useState } from 'react'
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
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Slider } from '@/components/ui/slider.jsx'

import SkillLevelIcon from './SkillLevelIcon.jsx'

/**
 * Dialog for editing participant name and skill level
 */
const EditParticipantDialog = ({ 
  open, 
  onOpenChange, 
  participant, 
  onSave 
}) => {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [skillLevel, setSkillLevel] = useState(1)

  // Update local state when participant changes or dialog opens
  useEffect(() => {
    if (open && participant) {
      setName(participant.name || '')
      const weight = participant.weight || 1.0
      // Map weight to slider position: 0.5 -> 2, 1.0 -> 1, 1.5 -> 0 (inverted)
      if (weight <= 0.5) setSkillLevel(2)
      else if (weight >= 1.5) setSkillLevel(0)
      else setSkillLevel(1)
    }
  }, [open, participant])

  const handleSave = () => {
    // Map slider position to weight: 0 -> 1.5, 1 -> 1.0, 2 -> 0.5 (inverted)
    const weightMap = [1.5, 1.0, 0.5]
    const weight = weightMap[skillLevel]
    
    onSave({
      id: participant.id,
      name: name.trim(),
      weight
    })
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  // Get current skill level info
  const getSkillLevelInfo = () => {
    switch (skillLevel) {
      case 0:
        return {
          label: t('skill_levels.advanced'),
          weight: 1.5
        }
      case 2:
        return {
          label: t('skill_levels.beginner'),
          weight: 0.5
        }
      case 1:
      default:
        return {
          label: t('skill_levels.intermediate'),
          weight: 1.0
        }
    }
  }

  const currentSkillInfo = getSkillLevelInfo()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>{t('participants.edit_dialog_title')}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {t('participants.edit_dialog_description')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="participant-name" className="text-white">
              {t('participants.placeholder')}
            </Label>
            <Input
              id="participant-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSave()}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          {/* Skill Level Slider */}
          <div className="space-y-4">
            <Label htmlFor="skill-level" className="text-white">
              {t('skill_levels.label')}
            </Label>
            <div className="space-y-3">
              <Slider
                id="skill-level"
                min={0}
                max={2}
                step={1}
                value={[skillLevel]}
                onValueChange={(value) => setSkillLevel(value[0])}
                className="cursor-pointer"
              />
              
              {/* Skill Level Labels */}
              <div className="flex justify-between text-xs text-gray-400">
                <span>{t('skill_levels.advanced')}</span>
                <span>{t('skill_levels.intermediate')}</span>
                <span>{t('skill_levels.beginner')}</span>
              </div>

              {/* Current Selection Preview */}
              <div className="flex items-center justify-center gap-2 p-3 bg-gray-700 rounded-lg">
                <SkillLevelIcon weight={currentSkillInfo.weight} size={20} />
                <span className="font-semibold">{currentSkillInfo.label}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleCancel}
            variant="outline"
            className="border-gray-500 text-gray-300 hover:bg-gray-600"
          >
            {t('participants.cancel')}
          </Button>
          <Button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700"
          >
            {t('participants.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditParticipantDialog

