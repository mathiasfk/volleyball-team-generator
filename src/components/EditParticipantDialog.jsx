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
import { gtag } from '@/services/analytics.js'


/**
 * Dialog for editing participant name and skill level
 */
const EditParticipantDialog = ({
  open,
  onOpenChange,
  participant,
  onSave,
  error,
  onClearError
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

    const saved = onSave({
      id: participant.id,
      name: name.trim(),
      weight,
      role
    })
    if (saved !== false) onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  // Track skill level change
  const handleSkillLevelChange = (value) => {
    const newSkillLevel = Number(value)
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


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle>{t('participants.edit_dialog_title')}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t('participants.edit_dialog_description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="participant-name" >
              {t('participants.placeholder')}
            </Label>
            <Input
              id="participant-name"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); onClearError() }}
              aria-invalid={!!error}
              aria-describedby={error ? "participant-name-error" : undefined}
              onKeyPress={(e) => e.key === 'Enter' && handleSave()}
              className="bg-secondary border-input"
            />
            {error && <p id="participant-name-error" role="alert" className="text-sm text-[var(--error)]">{error}</p>}
          </div>

          <fieldset className="space-y-3">
            <legend id="skill-label" className="text-sm font-medium">{t('skill_levels.label')}</legend>
            <RadioGroup aria-labelledby="skill-label" value={String(skillLevel)} onValueChange={handleSkillLevelChange} className="gap-3">
              {['beginner', 'intermediate', 'advanced'].map((level, index) => <div key={level} className="flex items-center gap-2">
                <RadioGroupItem value={String(index)} id={`skill-${level}`} />
                <Label htmlFor={`skill-${level}`}>{t(`skill_levels.${level}`)}</Label>
              </div>)}
            </RadioGroup>
          </fieldset>

          {/* Role Selector */}
          <fieldset className="space-y-4">
            <legend id="role-label" className="text-sm font-medium">{t('role.label')}</legend>
            <RadioGroup aria-labelledby="role-label" value={role} onValueChange={handleRoleChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="any" id="role-any"  />
                <Label htmlFor="role-any" className="cursor-pointer">
                  {t('role.any')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="libero" id="role-libero"  />
                <Label htmlFor="role-libero" className="cursor-pointer">
                  {t('role.libero')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="setter" id="role-setter"  />
                <Label htmlFor="role-setter" className="cursor-pointer">
                  {t('role.setter')}
                </Label>
              </div>
            </RadioGroup>
          </fieldset>
        </div>

        <DialogFooter>
          <Button
            onClick={handleCancel}
            variant="outline"

          >
            {t('participants.cancel')}
          </Button>
          <Button
            onClick={handleSave}

          >
            {t('participants.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditParticipantDialog

