import { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUpdatePluginConfig } from '../hooks';
import type { InstalledPlugin, PluginConfigField } from '../types/plugins.types';

interface PluginConfigPanelProps {
  plugin: InstalledPlugin;
  onClose: () => void;
}

export function PluginConfigPanel({ plugin, onClose }: PluginConfigPanelProps) {
  const [fields, setFields] = useState<PluginConfigField[]>(
    plugin.configFields.map(f => ({ ...f })),
  );
  const updateMutation = useUpdatePluginConfig();

  function setFieldValue(key: string, value: string | boolean) {
    setFields(prev => prev.map(f => (f.key === key ? { ...f, value } : f)));
  }

  function handleSave() {
    updateMutation.mutate(
      { id: plugin.id, configFields: fields },
      {
        onSuccess: () => toast.success(`${plugin.name} configuration saved`),
        onError: () => toast.error('Failed to save configuration'),
      },
    );
  }

  const isDirty = JSON.stringify(fields) !== JSON.stringify(plugin.configFields);

  return (
    <div className="rounded-lg border bg-card">
      {/* Panel header */}
      <div className="flex items-center justify-between border-b px-5 py-3">
        <div>
          <h3 className="text-sm font-semibold">{plugin.name} — Configuration</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Changes take effect on the next sync.
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-5 px-5 py-5">
        {fields.map(field => (
          <div key={field.key} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-sm">{field.label}</Label>
              {field.type === 'toggle' && (
                <Switch
                  checked={field.value as boolean}
                  onCheckedChange={v => setFieldValue(field.key, v)}
                />
              )}
            </div>

            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}

            {field.type === 'text' && (
              <Input
                value={field.value as string}
                placeholder={field.placeholder}
                onChange={e => setFieldValue(field.key, e.target.value)}
              />
            )}

            {field.type === 'password' && (
              <Input
                type="password"
                value={field.value as string}
                placeholder={field.placeholder}
                onChange={e => setFieldValue(field.key, e.target.value)}
              />
            )}

            {field.type === 'select' && field.options && (
              <Select
                value={field.value as string}
                onValueChange={v => setFieldValue(field.key, v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 border-t px-5 py-3">
        <Button variant="outline" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!isDirty || updateMutation.isPending}
        >
          Save changes
        </Button>
      </div>
    </div>
  );
}
