import React from 'react';
import { AlertOctagon, Flame, Droplets, Bone, Activity } from 'lucide-react';

export default function QuickPresets({ onSelectPreset }) {
  const presets = [
    {
      id: 'debris',
      label: 'Trapped Under Debris',
      icon: AlertOctagon,
      color: 'preset-red',
      text: 'Trapped under structural debris. Cannot move, need urgent heavy extraction team.',
    },
    {
      id: 'bleeding',
      label: 'Severe Bleeding',
      icon: Activity,
      color: 'preset-red',
      text: 'Severe bleeding from wound. Conscious but losing blood fast. Tourniquet needed.',
    },
    {
      id: 'breathing',
      label: 'Breathing Issue / Unconscious',
      icon: Flame,
      color: 'preset-red',
      text: 'Victim is struggling for air / unresponsive after severe impact fall.',
    },
    {
      id: 'fracture',
      label: 'Broken Bone / Fracture',
      icon: Bone,
      color: 'preset-yellow',
      text: 'Possible fracture/broken limb. Intense pain, mobile/immobile but stable.',
    },
    {
      id: 'flood',
      label: 'Stranded / Rising Water',
      icon: Droplets,
      color: 'preset-yellow',
      text: 'Stranded on rooftop due to rising flood waters. Safe for now, need evacuation.',
    },
  ];

  return (
    <div className="mb-4">
      <label className="section-label">1-TAP QUICK DISTRESS SELECTION</label>
      <div className="presets-grid">
        {presets.map((preset) => {
          const Icon = preset.icon;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset.text)}
              className={`preset-btn ${preset.color}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{preset.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
