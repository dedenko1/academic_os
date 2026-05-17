// ============================================
// Academic OS — Dynamic Color Class Mapping
//
// Tailwind CSS purges classes constructed via string interpolation
// (e.g. `bg-${color}` is invisible to the compiler).
// This module maps semantic color names to full, static class strings
// so Tailwind can detect and retain them at build time.
// ============================================

type SemanticColor = 'success' | 'warning' | 'danger' | 'sage' | 'muted' | 'accent';

const bgMap: Record<SemanticColor, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  sage: 'bg-sage',
  muted: 'bg-muted',
  accent: 'bg-accent',
};

const bgSoftMap: Record<SemanticColor, string> = {
  success: 'bg-success-soft',
  warning: 'bg-warning-soft',
  danger: 'bg-danger-soft',
  sage: 'bg-sage-soft',
  muted: 'bg-surface',
  accent: 'bg-accent-soft',
};

const textMap: Record<SemanticColor, string> = {
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  sage: 'text-sage',
  muted: 'text-muted',
  accent: 'text-accent',
};

const borderMap: Record<SemanticColor, string> = {
  success: 'border-success/20',
  warning: 'border-warning/20',
  danger: 'border-danger/20',
  sage: 'border-sage/20',
  muted: 'border-border',
  accent: 'border-accent/20',
};

const bgOpacity10Map: Record<SemanticColor, string> = {
  success: 'bg-success/10',
  warning: 'bg-warning/10',
  danger: 'bg-danger/10',
  sage: 'bg-sage/10',
  muted: 'bg-muted/10',
  accent: 'bg-accent/10',
};

const borderOpacity30Map: Record<SemanticColor, string> = {
  success: 'border-success/30',
  warning: 'border-warning/30',
  danger: 'border-danger/30',
  sage: 'border-sage/30',
  muted: 'border-border',
  accent: 'border-accent/30',
};

/**
 * Get a full, static Tailwind class for a semantic color.
 * Use this instead of string interpolation like `bg-${color}`.
 */
export function colorClass(
  type: 'bg' | 'bg-soft' | 'text' | 'border' | 'bg/10' | 'border/30',
  color: string
): string {
  const c = color as SemanticColor;
  switch (type) {
    case 'bg': return bgMap[c] ?? '';
    case 'bg-soft': return bgSoftMap[c] ?? '';
    case 'text': return textMap[c] ?? '';
    case 'border': return borderMap[c] ?? '';
    case 'bg/10': return bgOpacity10Map[c] ?? '';
    case 'border/30': return borderOpacity30Map[c] ?? '';
    default: return '';
  }
}
