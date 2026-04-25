---
version: alpha
name: Lamborghini High-Performance System
colors:
  background: "#000000"
  surface: "#050505"
  primary: "#C5A059"
  secondary: "#FFFFFF"
  foreground: "#F5F5F5"
  muted: "#333333"
  success: "#00FF00"
  warning: "#FFA500"
  error: "#FF0000"
  border: "#1A1A1A"
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: -0.02em
    textTransform: uppercase
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    textTransform: uppercase
    letterSpacing: 0.05em
  label-xs:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0.2em
    textTransform: uppercase
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
rounded:
  none: 0px
  sm: 0px
  md: 0px
  lg: 0px
  full: 9999px
---

# Lamborghini High-Performance System

## Identity Statement
This is not a "clean" or "modern" interface. It is a high-performance engine for benchmarking computational creativity. The aesthetic is inspired by the aggressive, uncompromising design language of Lamborghini: true black obsidian surfaces, sharp geometric precision, and metallic gold accents. Every element is engineered for focus and speed.

## Core Directives
1. **Total Obsidian:** Use true black (#000000) for the primary void. Never use off-blacks or charcoal for the base.
2. **Metallic Precision:** Accents must use Gold (#C5A059) sparingly but with high impact, signifying elite performance tiers and critical metrics.
3. **Aggressive Typography:** Headlines are always uppercase, heavy-weight, and slightly compressed.
4. **Zero Softness:** Rounded corners are prohibited for structural elements. Edges must be sharp and precise (0px radius).
5. **Technical Transparency:** Expose metrics and metadata using monospaced typography with wide tracking.

## Colors
The palette is binary and extreme.

- **Background (#000000):** The base void. Zero light.
- **Surface (#050505):** Subtle elevation for interactive components.
- **Primary (#C5A059):** Burnished Gold. Used for victory, top-tier benchmarks, and primary calls to action.
- **Secondary (#FFFFFF):** Stark White. Used for maximum readability against black.
- **Success (#00FF00):** Performance pass. Electric and high-visibility.
- **Error (#FF0000):** System failure. Aggressive and demanding attention.
- **Border (#1A1A1A):** Low-contrast dividers that define structure without breaking the void.

## Typography
Systemic dominance through weight and case.

### Headlines
- **Headline Large:** 24px, Black (900), Uppercase. Aggressive presence.

### Body
- **Body Medium:** 14px, functional and high-contrast.
- **Body Small:** 12px, Uppercase, Medium (500), Wide tracking. Used for secondary labels.

### Labels
- **Label Mono:** 10px, JetBrains Mono, Wide tracking (0.2em), Uppercase. For technical data points.

## Spacing
Built on a 4px high-precision grid. XL spacing is increased to 48px to create dramatic voids.

## Roundness
- **Structural:** 0px. All buttons, cards, and inputs must have sharp 90-degree corners.
- **Utility:** Only status pips or specialized circular indicators may use 9999px.

## Elevation
Elevation is achieved through sharp 1px borders (#1A1A1A) and zero-blur gold glows for active states.

## Components

### Performance Card
- **Background:** Surface (#050505)
- **Border:** 1px solid Border (#1A1A1A)
- **Border Radius:** 0px
- **Active State:** 1px solid Gold (#C5A059)

### Navbar
- **Background:** Background (#000000)
- **Border Bottom:** 1px solid Border (#1A1A1A)
- **Typography:** Body Small (Uppercase)

### Metrics Badge
- **Background:** Black (#000000)
- **Border:** 1px solid Gold (#C5A059)
- **Text:** Gold (#C5A059)
- **Font:** Label Mono
