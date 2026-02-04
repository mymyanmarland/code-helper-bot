import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, UserX, RefreshCw, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface UserProfile {
  id: string;
  user_id: string;
  username: string | null;
  created_at: string;
  roles: string[];
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine data
      const usersWithRoles = (profiles || []).map(profile => ({
        ...profile,
        roles: roles?.filter(r => r.user_id === profile.user_id).map(r => r.role) || []
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Users ရယူရာတွင် မအောင်မြင်ပါ",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      // First remove existing role
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Add new role - cast to the enum type
      const { error } = await supabase
        .from('user_roles')
        .insert({ 
          user_id: userId, 
          role: newRole as 'admin' | 'moderator' | 'user' 
        });

      if (error) throw error;

      toast({
        title: "အောင်မြင်ပါပြီ",
        description: "User role ပြောင်းပြီးပါပြီ",
      });

      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Role ပြောင်းရာတွင် မအောင်မြင်ပါ",
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.user_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'moderator': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terminal-comment" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-terminal-header border-terminal-border text-terminal-fg"
          />
        </div>
        <Button
          onClick={fetchUsers}
          variant="outline"
          className="border-terminal-border text-terminal-fg hover:bg-terminal-border"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="bg-terminal-header rounded-lg border border-terminal-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-terminal-border hover:bg-transparent">
              <TableHead className="text-terminal-comment">User</TableHead>
              <TableHead className="text-terminal-comment">Created</TableHead>
              <TableHead className="text-terminal-comment">Role</TableHead>
              <TableHead className="text-terminal-comment">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-terminal-comment">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-terminal-comment">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-terminal-border hover:bg-terminal-border/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-terminal-prompt/20 flex items-center justify-center">
                        <User className="w-4 h-4 text-terminal-prompt" />
                      </div>
                      <div>
                        <p className="font-medium text-terminal-fg">{user.username || 'No username'}</p>
                        <p className="text-xs text-terminal-comment truncate max-w-[200px]">{user.user_id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-terminal-comment">
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {user.roles.length > 0 ? (
                        user.roles.map((role, i) => (
                          <Badge key={i} className={getRoleBadgeColor(role)}>
                            {role}
                          </Badge>
                        ))
                      ) : (
                        <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                          No role
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      onValueChange={(value) => updateUserRole(user.user_id, value)}
                    >
                      <SelectTrigger className="w-[130px] bg-terminal-bg border-terminal-border text-terminal-fg">
                        <SelectValue placeholder="Set role" />
                      </SelectTrigger>
                      <SelectContent className="bg-terminal-header border-terminal-border">
                        <SelectItem value="user" className="text-terminal-fg">User</SelectItem>
                        <SelectItem value="moderator" className="text-terminal-fg">Moderator</SelectItem>
                        <SelectItem value="admin" className="text-terminal-fg">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default UserManagement;
