/**
 * K5 Platform Webhook API Routes
 * Manage webhook subscriptions and handle webhook events
 */

import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import { createHmac } from 'crypto';
import { webhookSubscriptionSchema } from '../validation/schemas';
import { ResponseFormatter } from '../utils/response';
import type { WebhookEvent, WebhookSubscription } from '../types';

const router = Router();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================================================
// POST /api/v1/webhooks/subscriptions
// Create a new webhook subscription
// ============================================================================

router.post('/subscriptions', async (req, res) => {
  const formatter = new ResponseFormatter(req.headers['x-request-id']);

  try {
    const validatedData = webhookSubscriptionSchema.parse(req.body);

    // Generate webhook secret if not provided
    const secret = validatedData.secret || generateWebhookSecret();

    const { data: subscription, error } = await supabase
      .from('webhook_subscriptions')
      .insert({
        user_id: req.auth.userId,
        url: validatedData.url,
        events: validatedData.events,
        secret,
        active: validatedData.active,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create subscription: ${error.message}`);
    }

    const response = formatter.created(
      {
        id: subscription.id,
        url: subscription.url,
        events: subscription.events,
        secret: subscription.secret, // Return once on creation
        active: subscription.active,
      },
      `/api/v1/webhooks/subscriptions/${subscription.id}`
    );

    return res.status(response.status).json(response.body);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(422).json(formatter.validationError(error.errors));
    }

    console.error('Create webhook subscription error:', error);
    return res.status(500).json(formatter.internalError(error));
  }
});

// ============================================================================
// GET /api/v1/webhooks/subscriptions
// List webhook subscriptions
// ============================================================================

router.get('/subscriptions', async (req, res) => {
  const formatter = new ResponseFormatter(req.headers['x-request-id']);

  try {
    const { data: subscriptions, error } = await supabase
      .from('webhook_subscriptions')
      .select('id, url, events, active, created_at, last_triggered')
      .eq('user_id', req.auth.userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to list subscriptions: ${error.message}`);
    }

    const response = formatter.success(subscriptions);
    return res.status(response.status).json(response.body);
  } catch (error) {
    console.error('List subscriptions error:', error);
    return res.status(500).json(formatter.internalError(error));
  }
});

// ============================================================================
// GET /api/v1/webhooks/subscriptions/:id
// Get webhook subscription details
// ============================================================================

router.get('/subscriptions/:id', async (req, res) => {
  const formatter = new ResponseFormatter(req.headers['x-request-id']);

  try {
    const { id } = req.params;

    const { data: subscription, error } = await supabase
      .from('webhook_subscriptions')
      .select('id, url, events, active, created_at, last_triggered')
      .eq('id', id)
      .eq('user_id', req.auth.userId)
      .single();

    if (error || !subscription) {
      return res.status(404).json(formatter.notFound('Webhook subscription'));
    }

    const response = formatter.success(subscription);
    return res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Get subscription error:', error);
    return res.status(500).json(formatter.internalError(error));
  }
});

// ============================================================================
// PATCH /api/v1/webhooks/subscriptions/:id
// Update webhook subscription
// ============================================================================

router.patch('/subscriptions/:id', async (req, res) => {
  const formatter = new ResponseFormatter(req.headers['x-request-id']);

  try {
    const { id } = req.params;
    const { url, events, active } = req.body;

    const updates: any = {};
    if (url) updates.url = url;
    if (events) updates.events = events;
    if (typeof active === 'boolean') updates.active = active;

    const { data: subscription, error } = await supabase
      .from('webhook_subscriptions')
      .update(updates)
      .eq('id', id)
      .eq('user_id', req.auth.userId)
      .select('id, url, events, active')
      .single();

    if (error || !subscription) {
      return res.status(404).json(formatter.notFound('Webhook subscription'));
    }

    const response = formatter.success(subscription);
    return res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Update subscription error:', error);
    return res.status(500).json(formatter.internalError(error));
  }
});

// ============================================================================
// DELETE /api/v1/webhooks/subscriptions/:id
// Delete webhook subscription
// ============================================================================

router.delete('/subscriptions/:id', async (req, res) => {
  const formatter = new ResponseFormatter(req.headers['x-request-id']);

  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('webhook_subscriptions')
      .delete()
      .eq('id', id)
      .eq('user_id', req.auth.userId);

    if (error) {
      throw new Error(`Failed to delete subscription: ${error.message}`);
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Delete subscription error:', error);
    return res.status(500).json(formatter.internalError(error));
  }
});

// ============================================================================
// POST /api/v1/webhooks/test/:id
// Test webhook subscription
// ============================================================================

router.post('/test/:id', async (req, res) => {
  const formatter = new ResponseFormatter(req.headers['x-request-id']);

  try {
    const { id } = req.params;

    const { data: subscription, error } = await supabase
      .from('webhook_subscriptions')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.auth.userId)
      .single();

    if (error || !subscription) {
      return res.status(404).json(formatter.notFound('Webhook subscription'));
    }

    // Send test event
    const testEvent: WebhookEvent = {
      id: `test_${Date.now()}`,
      type: 'pdf.processing.completed',
      timestamp: new Date().toISOString(),
      data: {
        documentId: 'test-document-id',
        message: 'This is a test webhook event',
      },
      signature: '',
    };

    const delivered = await deliverWebhook(subscription, testEvent);

    const response = formatter.success({
      delivered,
      url: subscription.url,
      message: delivered
        ? 'Test webhook delivered successfully'
        : 'Failed to deliver test webhook',
    });

    return res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Test webhook error:', error);
    return res.status(500).json(formatter.internalError(error));
  }
});

// ============================================================================
// GET /api/v1/webhooks/events
// List webhook delivery events
// ============================================================================

router.get('/events', async (req, res) => {
  const formatter = new ResponseFormatter(req.headers['x-request-id']);

  try {
    const subscriptionId = req.query.subscriptionId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('webhook_events')
      .select('*', { count: 'exact' });

    if (subscriptionId) {
      query = query.eq('subscription_id', subscriptionId);
    }

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: events, error, count } = await query;

    if (error) {
      throw new Error(`Failed to list events: ${error.message}`);
    }

    const response = formatter.success(events, {
      page,
      limit,
      total: count || 0,
      hasMore: (count || 0) > offset + limit,
    });

    return res.status(response.status).json(response.body);
  } catch (error) {
    console.error('List events error:', error);
    return res.status(500).json(formatter.internalError(error));
  }
});

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate webhook secret
 */
function generateWebhookSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let secret = '';
  for (let i = 0; i < 64; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return secret;
}

/**
 * Sign webhook payload
 */
function signWebhook(payload: string, secret: string): string {
  return createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
}

/**
 * Deliver webhook to endpoint
 */
async function deliverWebhook(
  subscription: any,
  event: WebhookEvent
): Promise<boolean> {
  try {
    const payload = JSON.stringify(event);
    const signature = signWebhook(payload, subscription.secret);

    const response = await fetch(subscription.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Event-Type': event.type,
        'X-Webhook-Event-Id': event.id,
      },
      body: payload,
    });

    // Log delivery attempt
    await supabase.from('webhook_events').insert({
      subscription_id: subscription.id,
      event_type: event.type,
      event_id: event.id,
      delivered: response.ok,
      status_code: response.status,
      response_body: await response.text().catch(() => null),
      created_at: new Date().toISOString(),
    });

    // Update last triggered time
    if (response.ok) {
      await supabase
        .from('webhook_subscriptions')
        .update({ last_triggered: new Date().toISOString() })
        .eq('id', subscription.id);
    }

    return response.ok;
  } catch (error) {
    console.error('Webhook delivery error:', error);

    // Log failed delivery
    await supabase.from('webhook_events').insert({
      subscription_id: subscription.id,
      event_type: event.type,
      event_id: event.id,
      delivered: false,
      error_message: error instanceof Error ? error.message : 'Unknown error',
      created_at: new Date().toISOString(),
    });

    return false;
  }
}

/**
 * Trigger webhook for event (exported for use by other services)
 */
export async function triggerWebhook(
  eventType: string,
  data: Record<string, any>
): Promise<void> {
  try {
    // Get all active subscriptions for this event type
    const { data: subscriptions, error } = await supabase
      .from('webhook_subscriptions')
      .select('*')
      .eq('active', true)
      .contains('events', [eventType]);

    if (error || !subscriptions || subscriptions.length === 0) {
      return;
    }

    const event: WebhookEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      type: eventType as any,
      timestamp: new Date().toISOString(),
      data,
      signature: '',
    };

    // Deliver to all subscriptions in parallel
    await Promise.all(
      subscriptions.map((subscription) => deliverWebhook(subscription, event))
    );
  } catch (error) {
    console.error('Trigger webhook error:', error);
  }
}

export default router;
