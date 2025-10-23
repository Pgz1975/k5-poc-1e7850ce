import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CostDatabaseService } from '@/lib/speech/services/CostDatabaseService';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export function UsageDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      if (!user?.id) return;

      const dbService = new CostDatabaseService();
      const userStats = await dbService.getStudentUsageStats(user.id, 30);
      setStats(userStats);
      setLoading(false);
    }

    loadStats();
  }, [user?.id]);

  if (loading) {
    return (
      <Card className="p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Loading usage data...</span>
      </Card>
    );
  }

  if (!stats) return null;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">📊 Your Usage (Last 30 Days)</h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-muted-foreground">Total Sessions</p>
          <p className="text-2xl font-bold">{stats.totalSessions}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Cost</p>
          <p className="text-2xl font-bold">${stats.totalCost.toFixed(4)}</p>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium">Usage by Model</h4>
        {Object.entries(stats.byModel || {}).map(([model, data]: [string, any]) => (
          <div key={model} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{model}</span>
              <span>${data.totalCost.toFixed(4)}</span>
            </div>
            <Progress 
              value={(data.sessions / stats.totalSessions) * 100} 
              className="h-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{data.sessions} sessions</span>
              <span>{Math.floor(data.totalDuration / 60)} minutes</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t">
        <h4 className="text-sm font-medium mb-2">Recent Sessions</h4>
        <div className="space-y-2">
          {stats.recentSessions?.slice(0, 5).map((session: any) => (
            <div key={session.id} className="text-xs flex justify-between">
              <span>{new Date(session.created_at).toLocaleDateString()}</span>
              <span>{session.model_type}</span>
              <span>${session.actual_cost?.toFixed(4) || '0.0000'}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
