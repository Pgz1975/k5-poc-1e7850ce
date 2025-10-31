/**
 * Voice Monitoring Dashboard
 * Real-time monitoring and analytics for voice session performance
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, CheckCircle, TrendingUp, TrendingDown, Zap, Activity } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#3b82f6'];

export default function VoiceMonitoringDashboard() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [featureFlags, setFeatureFlags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');

  useEffect(() => {
    loadDashboardData();

    // Subscribe to real-time updates
    const metricsChannel = supabase
      .channel('voice-metrics-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'voice_session_metrics' }, () => {
        loadDashboardData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(metricsChannel);
    };
  }, [timeRange]);

  const loadDashboardData = async () => {
    try {
      const cutoffTime = getCutoffTime(timeRange);

      // Load metrics
      const { data: metricsData } = await supabase
        .from('voice_session_metrics')
        .select('*')
        .gte('created_at', cutoffTime)
        .order('created_at', { ascending: false })
        .limit(1000);

      // Load errors
      const { data: errorsData } = await supabase
        .from('voice_session_errors')
        .select('*')
        .gte('occurred_at', cutoffTime)
        .order('occurred_at', { ascending: false })
        .limit(500);

      // Load feature flags
      const { data: flagsData } = await supabase
        .from('voice_feature_flags')
        .select('*')
        .order('created_at', { ascending: false });

      setMetrics(metricsData || []);
      setErrors(errorsData || []);
      setFeatureFlags(flagsData || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCutoffTime = (range: string) => {
    const now = new Date();
    switch (range) {
      case '1h': return new Date(now.getTime() - 60 * 60 * 1000).toISOString();
      case '24h': return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      default: return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    }
  };

  // Calculate summary statistics
  const webrtcMetrics = metrics.filter(m => m.implementation_type === 'webrtc');
  const websocketMetrics = metrics.filter(m => m.implementation_type === 'websocket');
  
  const webrtcSuccess = webrtcMetrics.filter(m => m.connection_success).length;
  const websocketSuccess = websocketMetrics.filter(m => m.connection_success).length;

  const webrtcSuccessRate = webrtcMetrics.length > 0 
    ? ((webrtcSuccess / webrtcMetrics.length) * 100).toFixed(1)
    : '0.0';
  
  const websocketSuccessRate = websocketMetrics.length > 0
    ? ((websocketSuccess / websocketMetrics.length) * 100).toFixed(1)
    : '0.0';

  const avgWebrtcLatency = webrtcMetrics.length > 0
    ? (webrtcMetrics.reduce((sum, m) => sum + (m.avg_latency_ms || 0), 0) / webrtcMetrics.length).toFixed(0)
    : '0';

  const avgWebsocketLatency = websocketMetrics.length > 0
    ? (websocketMetrics.reduce((sum, m) => sum + (m.avg_latency_ms || 0), 0) / websocketMetrics.length).toFixed(0)
    : '0';

  const implementationDistribution = [
    { name: 'WebRTC', value: webrtcMetrics.length },
    { name: 'WebSocket', value: websocketMetrics.length },
  ];

  const errorsByType = errors.reduce((acc: any, err) => {
    acc[err.error_type] = (acc[err.error_type] || 0) + 1;
    return acc;
  }, {});

  const errorChartData = Object.entries(errorsByType).map(([name, value]) => ({ name, value }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-primary/5">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading dashboard...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Voice Session Monitoring</h1>
          <p className="text-muted-foreground">Real-time performance analytics and error tracking</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6 flex gap-2">
          {['1h', '24h', '7d', '30d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg ${
                timeRange === range 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">WebRTC Success Rate</p>
                <p className="text-3xl font-bold">{webrtcSuccessRate}%</p>
              </div>
              <div className={`p-3 rounded-full ${parseFloat(webrtcSuccessRate) > 95 ? 'bg-green-100' : 'bg-yellow-100'}`}>
                {parseFloat(webrtcSuccessRate) > 95 ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">WebSocket Success Rate</p>
                <p className="text-3xl font-bold">{websocketSuccessRate}%</p>
              </div>
              <div className={`p-3 rounded-full ${parseFloat(websocketSuccessRate) > 95 ? 'bg-green-100' : 'bg-yellow-100'}`}>
                {parseFloat(websocketSuccessRate) > 95 ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">WebRTC Avg Latency</p>
                <p className="text-3xl font-bold">{avgWebrtcLatency}ms</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Errors</p>
                <p className="text-3xl font-bold">{errors.length}</p>
              </div>
              <div className={`p-3 rounded-full ${errors.length > 10 ? 'bg-red-100' : 'bg-green-100'}`}>
                {errors.length > 10 ? (
                  <TrendingUp className="w-6 h-6 text-red-600" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-green-600" />
                )}
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="errors">Errors</TabsTrigger>
            <TabsTrigger value="features">Feature Flags</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Implementation Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={implementationDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {implementationDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Error Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={errorChartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="errors" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Errors</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {errors.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No errors in this time range 🎉</p>
                ) : (
                  errors.map((error) => (
                    <div key={error.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={error.is_retryable ? 'default' : 'destructive'}>
                              {error.implementation_type}
                            </Badge>
                            <span className="font-semibold">{error.error_type}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{error.error_message}</p>
                          {error.error_code && (
                            <p className="text-xs text-muted-foreground">Code: {error.error_code}</p>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(error.occurred_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Feature Flags</h3>
              <div className="space-y-4">
                {featureFlags.map((flag) => (
                  <div key={flag.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{flag.flag_name}</h4>
                      <Badge variant={flag.enabled ? 'default' : 'secondary'}>
                        {flag.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                    {flag.enabled && (
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary" 
                              style={{ width: `${flag.rollout_percentage}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium">{flag.rollout_percentage}%</span>
                      </div>
                    )}
                    {flag.metadata?.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {flag.metadata.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Sessions</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {metrics.slice(0, 50).map((metric) => (
                  <div key={metric.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={metric.connection_success ? 'default' : 'destructive'}>
                            {metric.implementation_type}
                          </Badge>
                          <span className="text-sm">{metric.language}</span>
                          {metric.avg_latency_ms && (
                            <span className="text-xs text-muted-foreground">
                              {metric.avg_latency_ms.toFixed(0)}ms avg
                            </span>
                          )}
                        </div>
                        {metric.activity_type && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {metric.activity_type}
                          </p>
                        )}
                      </div>
                      <div className="text-right text-xs text-muted-foreground">
                        <div>{new Date(metric.created_at).toLocaleString()}</div>
                        {metric.connection_duration_ms && (
                          <div>{(metric.connection_duration_ms / 1000).toFixed(1)}s duration</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
