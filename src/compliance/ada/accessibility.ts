/**
 * ADA Compliance Implementation
 *
 * Accessibility features for students with disabilities
 */

import {
  AccessibilityFeature,
  AccessibilityProfile,
  AccessibleContent
} from '../types';

// ============================================================================
// Accessibility Manager
// ============================================================================

export class AccessibilityManager {
  private profiles: Map<string, AccessibilityProfile> = new Map();

  /**
   * Create or update accessibility profile
   */
  setProfile(userId: string, profile: Partial<AccessibilityProfile>): AccessibilityProfile {
    const existing = this.profiles.get(userId);
    const updated: AccessibilityProfile = {
      userId,
      enabledFeatures: profile.enabledFeatures || existing?.enabledFeatures || [],
      preferences: {
        ...existing?.preferences,
        ...profile.preferences
      },
      assistiveTechnology: profile.assistiveTechnology || existing?.assistiveTechnology
    };

    this.profiles.set(userId, updated);
    return updated;
  }

  /**
   * Get user accessibility profile
   */
  getProfile(userId: string): AccessibilityProfile | undefined {
    return this.profiles.get(userId);
  }

  /**
   * Enable accessibility feature
   */
  enableFeature(userId: string, feature: AccessibilityFeature): void {
    const profile = this.getProfile(userId) || {
      userId,
      enabledFeatures: [],
      preferences: {}
    };

    if (!profile.enabledFeatures.includes(feature)) {
      profile.enabledFeatures.push(feature);
      this.profiles.set(userId, profile);
    }
  }

  /**
   * Disable accessibility feature
   */
  disableFeature(userId: string, feature: AccessibilityFeature): void {
    const profile = this.getProfile(userId);
    if (profile) {
      profile.enabledFeatures = profile.enabledFeatures.filter(f => f !== feature);
      this.profiles.set(userId, profile);
    }
  }

  /**
   * Make content accessible
   */
  makeAccessible(
    content: string,
    options: {
      alternativeText?: string;
      ariaLabel?: string;
      ariaDescribedBy?: string;
      role?: string;
      tabIndex?: number;
    } = {}
  ): AccessibleContent {
    return {
      content,
      alternativeText: options.alternativeText,
      ariaLabel: options.ariaLabel,
      ariaDescribedBy: options.ariaDescribedBy,
      role: options.role,
      tabIndex: options.tabIndex,
      metadata: {
        isAccessible: true,
        features: this.detectFeatures(content, options),
        lastChecked: new Date()
      }
    };
  }

  /**
   * Generate alternative text for images
   */
  generateAltText(imagePath: string, description?: string): string {
    // In production, use AI image recognition
    return description || `Image: ${imagePath.split('/').pop()}`;
  }

  /**
   * Generate ARIA labels
   */
  generateAriaLabel(element: string, context?: string): string {
    const labels: Record<string, string> = {
      button: 'Click to activate',
      link: 'Navigate to',
      input: 'Enter text',
      select: 'Choose option',
      checkbox: 'Check or uncheck',
      radio: 'Select option'
    };

    return context || labels[element] || element;
  }

  /**
   * Apply high contrast mode
   */
  applyHighContrast(
    content: string,
    level: 'normal' | 'high' | 'maximum' = 'high'
  ): string {
    const contrastRatios = {
      normal: '4.5:1',
      high: '7:1',
      maximum: '21:1'
    };

    // In production, apply CSS classes or inline styles
    return `<div class="contrast-${level}" data-ratio="${contrastRatios[level]}">${content}</div>`;
  }

  /**
   * Apply font size adjustment
   */
  applyFontSize(content: string, size: number): string {
    // Clamp between 12px and 32px
    const clampedSize = Math.max(12, Math.min(32, size));
    return `<div style="font-size: ${clampedSize}px">${content}</div>`;
  }

  /**
   * Add keyboard navigation support
   */
  addKeyboardNavigation(elements: Array<{
    id: string;
    type: string;
    handler: string;
  }>): Record<string, string> {
    const shortcuts: Record<string, string> = {};

    elements.forEach((element, index) => {
      // Generate keyboard shortcuts
      const key = String(index + 1);
      shortcuts[`Alt+${key}`] = element.id;
    });

    return shortcuts;
  }

  /**
   * Prepare content for screen readers
   */
  prepareForScreenReader(content: string): {
    text: string;
    landmarks: Array<{ type: string; label: string }>;
    headings: Array<{ level: number; text: string }>;
  } {
    // Strip HTML tags for text content
    const text = content.replace(/<[^>]*>/g, ' ').trim();

    // Identify landmarks (main, nav, aside, etc.)
    const landmarks: Array<{ type: string; label: string }> = [];
    const landmarkRegex = /<(main|nav|aside|header|footer)[^>]*>/g;
    let match;
    while ((match = landmarkRegex.exec(content)) !== null) {
      landmarks.push({ type: match[1], label: match[1] });
    }

    // Extract headings
    const headings: Array<{ level: number; text: string }> = [];
    const headingRegex = /<h(\d)>(.*?)<\/h\1>/g;
    while ((match = headingRegex.exec(content)) !== null) {
      headings.push({ level: parseInt(match[1]), text: match[2] });
    }

    return { text, landmarks, headings };
  }

  /**
   * Generate text-to-speech data
   */
  generateTTSData(text: string, profile?: AccessibilityProfile): {
    text: string;
    rate: number;
    pitch: number;
    volume: number;
  } {
    return {
      text,
      rate: profile?.preferences.speechRate || 1.0,
      pitch: 1.0,
      volume: 1.0
    };
  }

  /**
   * Validate accessibility compliance
   */
  validateAccessibility(content: string): {
    isCompliant: boolean;
    violations: Array<{
      type: string;
      severity: 'error' | 'warning';
      message: string;
      location?: string;
    }>;
    score: number;
  } {
    const violations: Array<{
      type: string;
      severity: 'error' | 'warning';
      message: string;
      location?: string;
    }> = [];

    // Check for images without alt text
    const imgRegex = /<img[^>]*>/g;
    let match;
    while ((match = imgRegex.exec(content)) !== null) {
      if (!match[0].includes('alt=')) {
        violations.push({
          type: 'missing_alt_text',
          severity: 'error',
          message: 'Image missing alternative text',
          location: match[0]
        });
      }
    }

    // Check for proper heading hierarchy
    const headings: number[] = [];
    const headingRegex = /<h(\d)>/g;
    while ((match = headingRegex.exec(content)) !== null) {
      headings.push(parseInt(match[1]));
    }

    for (let i = 1; i < headings.length; i++) {
      if (headings[i] - headings[i - 1] > 1) {
        violations.push({
          type: 'heading_hierarchy',
          severity: 'warning',
          message: `Heading level skipped: h${headings[i - 1]} to h${headings[i]}`
        });
      }
    }

    // Check for form inputs without labels
    const inputRegex = /<input[^>]*>/g;
    while ((match = inputRegex.exec(content)) !== null) {
      const hasLabel = match[0].includes('aria-label=') ||
                      match[0].includes('aria-labelledby=');
      if (!hasLabel) {
        violations.push({
          type: 'missing_label',
          severity: 'error',
          message: 'Form input missing label',
          location: match[0]
        });
      }
    }

    // Calculate score (100 - 10 points per error, 5 per warning)
    const score = Math.max(0, 100 -
      violations.filter(v => v.severity === 'error').length * 10 -
      violations.filter(v => v.severity === 'warning').length * 5
    );

    return {
      isCompliant: violations.filter(v => v.severity === 'error').length === 0,
      violations,
      score
    };
  }

  /**
   * Generate accessibility report
   */
  generateReport(userId: string): {
    profile: AccessibilityProfile | undefined;
    featuresUsed: AccessibilityFeature[];
    complianceScore: number;
    recommendations: string[];
  } {
    const profile = this.getProfile(userId);
    const recommendations: string[] = [];

    if (!profile) {
      recommendations.push('No accessibility profile found. Consider enabling accessibility features.');
    } else {
      if (!profile.enabledFeatures.includes(AccessibilityFeature.SCREEN_READER)) {
        recommendations.push('Enable screen reader support for better navigation.');
      }
      if (!profile.enabledFeatures.includes(AccessibilityFeature.KEYBOARD_NAVIGATION)) {
        recommendations.push('Enable keyboard navigation for easier access.');
      }
      if (!profile.preferences.fontSize || profile.preferences.fontSize < 14) {
        recommendations.push('Increase font size for better readability.');
      }
    }

    return {
      profile,
      featuresUsed: profile?.enabledFeatures || [],
      complianceScore: profile ? 85 : 50,
      recommendations
    };
  }

  /**
   * Private helpers
   */

  private detectFeatures(
    content: string,
    options: any
  ): AccessibilityFeature[] {
    const features: AccessibilityFeature[] = [];

    if (options.alternativeText) {
      features.push(AccessibilityFeature.ALTERNATIVE_TEXT);
    }
    if (options.ariaLabel || options.ariaDescribedBy) {
      features.push(AccessibilityFeature.SCREEN_READER);
    }
    if (options.tabIndex !== undefined) {
      features.push(AccessibilityFeature.KEYBOARD_NAVIGATION);
    }

    return features;
  }
}

// ============================================================================
// Export singleton instance
// ============================================================================

export const accessibilityManager = new AccessibilityManager();
