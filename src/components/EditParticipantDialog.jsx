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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx'
import { Slider } from '@/components/ui/slider.jsx'
import { gtag } from '@/services/analytics.js'

import RoleIcon from './RoleIcon.jsx'
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
  const [role, setRole] = useState('any')

  // Update local state when participant changes or dialog opens
  useEffect(() => {
    if (open && participant) {
      setName(participant.name || '')
      const weight = participant.weight || 1.0
      // Map weight to slider position: 0.5 -> 0, 1.0 -> 1, 1.5 -> 2
      if (weight <= 0.5) setSkillLevel(0)
      else if (weight >= 1.5) setSkillLevel(2)
      else setSkillLevel(1)
      // Set role, default to 'any' if not specified
      setRole(participant.role || 'any')
    }
  }, [open, participant])

  const handleSave = () => {
    // Map slider position to weight: 0 -> 0.5, 1 -> 1.0, 2 -> 1.5
    const weightMap = [0.5, 1.0, 1.5]
    const weight = weightMap[skillLevel]
    
    onSave({
      id: participant.id,
      name: name.trim(),
      weight,
      role
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
          label: t('skill_levels.beginner'),
          weight: 0.5
        }
      case 2:
        return {
          label: t('skill_levels.advanced'),
          weight: 1.5
        }
      case 1:
      default:
        return {
          label: t('skill_levels.intermediate'),
          weight: 1.0
        }
    }
  }

  // Track skill level change
  const handleSkillLevelChange = (value) => {
    const newSkillLevel = value[0]
    const weightMap = [0.5, 1.0, 1.5]
    const weight = weightMap[newSkillLevel]
    
    let skillLabel
    switch (newSkillLevel) {
      case 0:
        skillLabel = t('skill_levels.beginner')
        break
      case 2:
        skillLabel = t('skill_levels.advanced')
        break
      case 1:
      default:
        skillLabel = t('skill_levels.intermediate')
        break
    }
    
    setSkillLevel(newSkillLevel)
    
    if (participant) {
      gtag('event', 'edit_participant_skill_level_change', {
        participant_id: participant.id,
        participant_name: participant.name,
        skill_level_index: newSkillLevel,
        skill_level_label: skillLabel,
        weight: weight,
      })
    }
  }

  // Track role change
  const handleRoleChange = (newRole) => {
    setRole(newRole)
    
    if (participant) {
      const roleLabel = t(`role.${newRole}`)
      gtag('event', 'edit_participant_role_change', {
        participant_id: participant.id,
        participant_name: participant.name,
        role: newRole,
        role_label: roleLabel,
      })
    }
  }

  const currentSkillInfo = getSkillLevelInfo()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <style>{`
          [data-slot="slider-track"] {
            background-color: rgb(17, 24, 39) !important;
          }
          [data-slot="slider-range"] {
            background-color: white !important;
          }
          [data-slot="slider-thumb"] {
            background-color: white !important;
            border-color: white !important;
          }
        `}</style>
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
                  onValueChange={handleSkillLevelChange}
                  className="cursor-pointer"
                />
              
              {/* Skill Level Labels */}
              <div className="flex justify-between text-xs text-gray-400">
                <span>{t('skill_levels.beginner')}</span>
                <span>{t('skill_levels.intermediate')}</span>
                <span>{t('skill_levels.advanced')}</span>
              </div>

              {/* Current Selection Preview */}
              <div className="flex items-center justify-center gap-2 p-3 bg-gray-700 rounded-lg">
                <SkillLevelIcon weight={currentSkillInfo.weight} size={20} />
                <span className="font-semibold">{currentSkillInfo.label}</span>
              </div>
            </div>
          </div>

          {/* Role Selector */}
          <div className="space-y-4">
            <Label htmlFor="role" className="text-white">
              {t('role.label')}
            </Label>
            <RadioGroup value={role} onValueChange={handleRoleChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="any" id="role-any" className="border-white text-white" />
                <Label htmlFor="role-any" className="text-white cursor-pointer">
                  {t('role.any')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="libero" id="role-libero" className="border-white text-white" />
                <Label htmlFor="role-libero" className="text-white cursor-pointer flex items-center gap-2">
                  <RoleIcon role="libero" size={16} />
                  {t('role.libero')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="setter" id="role-setter" className="border-white text-white" />
                <Label htmlFor="role-setter" className="text-white cursor-pointer flex items-center gap-2">
                  <RoleIcon role="setter" size={16} />
                  {t('role.setter')}
                </Label>
              </div>
            </RadioGroup>
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

