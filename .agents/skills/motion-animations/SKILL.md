---
name: motion-animations
description: Core guidelines and code samples for implementing premium, high-performance reveal animations in React 19 / Next.js 16 using Motion 13 (motion/react).
---

# Premium Motion 13 Animations for React 19 & Next.js 16

Guidelines and code patterns for implementing elegant, high-performance reveal animations inspired by high-end automotive websites (e.g. Koenigsegg).

## 1. Package Usage
Always import motion components from `motion/react` in Motion 13 (instead of `framer-motion`):
```typescript
import { motion, AnimatePresence } from "motion/react";
```

## 2. Reveal Animations Pattern (Scroll Triggered)
Use `motion.div` with the `whileInView` prop for scroll-triggered entrance animations. This keeps animations declarative and avoids custom main-thread scroll event handlers.

```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-10%" }}
  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
>
  {children}
</motion.div>
```

### Motion Easings
Always use the custom premium cubic-bezier easing to match the luxury identity (sleek, controlled deceleration):
* `easeOutExpo` / Custom: `[0.16, 1, 0.3, 1]` (highly recommended)

## 3. Staggered List Reveals
For cards and lists, wrap children in motion configurations and use a parent variant to control staggered reveals:

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

// In render
<motion.div 
  variants={containerVariants} 
  initial="hidden" 
  whileInView="visible"
  viewport={{ once: true, margin: "-10%" }}
>
  {items.map(item => (
    <motion.article key={item.id} variants={itemVariants}>
      {item.content}
    </motion.article>
  ))}
</motion.div>
```

## 4. Performance & Core Web Vitals Rules
* **Compositor Only**: Animate exclusively `transform` (`x`, `y`, `scale`) and `opacity`. Never animate layout properties like `height`, `width`, `margin`, or `top` as they cause layout thrashing.
* **Pre-render Visibility**: Never hide content completely on the server (e.g., setting CSS opacity to 0 or omitting elements) if JavaScript might fail to load. The initial HTML must remain visible.
* **Pre-empt Layout Shifts**: Set static aspect-ratios and dimensions for containers to prevent Layout Shifts (CLS) while animations load.
