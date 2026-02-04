import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface SiteSettings {
  site_name: string;
  site_description: string;
  maintenance_mode: boolean;
  allow_signups: boolean;
  welcome_message: string;
}

const SiteSettingsPage = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: 'Dotfiles Config',
    site_description: 'Bash configuration with Powerline prompt',
    maintenance_mode: false,
    allow_signups: true,
    welcome_message: 'မင်္ဂလာပါ! Welcome to Dotfiles.'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');

      if (error) throw error;

      const settingsMap: Record<string, any> = {};
      data?.forEach(item => {
        settingsMap[item.key] = item.value;
      });

      setSettings(prev => ({
        ...prev,
        ...settingsMap.general_settings || {}
      }));
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    try {
      // Check if setting exists
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .eq('key', 'general_settings')
        .single();

      if (existing) {
        const { error } = await supabase
          .from('site_settings')
          .update({
            value: settings as any,
            updated_by: user?.id
          })
          .eq('key', 'general_settings');
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_settings')
          .insert({
            key: 'general_settings',
            value: settings as any,
            updated_by: user?.id
          });
        if (error) throw error;
      }

      toast({
        title: "Saved",
        description: "Settings သိမ်းပြီးပါပြီ",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Settings သိမ်းရာတွင် မအောင်မြင်ပါ",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-2xl"
    >
      <div className="bg-terminal-header rounded-lg border border-terminal-border p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-terminal-border">
          <Settings className="w-5 h-5 text-terminal-prompt" />
          <h3 className="text-lg font-bold text-terminal-fg">General Settings</h3>
        </div>

        {loading ? (
          <div className="text-center py-8 text-terminal-comment">Loading...</div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site_name" className="text-terminal-comment">Site Name</Label>
                <Input
                  id="site_name"
                  value={settings.site_name}
                  onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                  className="bg-terminal-bg border-terminal-border text-terminal-fg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="site_description" className="text-terminal-comment">Site Description</Label>
                <Input
                  id="site_description"
                  value={settings.site_description}
                  onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                  className="bg-terminal-bg border-terminal-border text-terminal-fg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="welcome_message" className="text-terminal-comment">Welcome Message</Label>
                <Textarea
                  id="welcome_message"
                  value={settings.welcome_message}
                  onChange={(e) => setSettings({ ...settings, welcome_message: e.target.value })}
                  className="bg-terminal-bg border-terminal-border text-terminal-fg min-h-[100px]"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-terminal-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-terminal-fg">Allow Signups</p>
                  <p className="text-sm text-terminal-comment">New users များ register လုပ်ခွင့်ပေးမလား</p>
                </div>
                <Switch
                  checked={settings.allow_signups}
                  onCheckedChange={(checked) => setSettings({ ...settings, allow_signups: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-terminal-fg">Maintenance Mode</p>
                  <p className="text-sm text-terminal-comment">Website ကို maintenance mode ထားမလား</p>
                </div>
                <Switch
                  checked={settings.maintenance_mode}
                  onCheckedChange={(checked) => setSettings({ ...settings, maintenance_mode: checked })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={fetchSettings}
                className="border-terminal-border text-terminal-fg"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button
                onClick={saveSettings}
                disabled={saving}
                className="bg-terminal-prompt text-terminal-bg hover:bg-terminal-prompt/90"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default SiteSettingsPage;
