'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check, Copy } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils/common/shadcn';

const copyButtonVariants = cva(
  'inline-flex shrink-0 items-center justify-center rounded-md transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 text-white',
        outline:
          'bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 border shadow-xs',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        muted: 'bg-muted text-muted-foreground hover:bg-muted/80',
        code: 'border border-transparent bg-transparent text-zinc-500 shadow-none hover:bg-zinc-800/70 hover:text-zinc-100 focus-visible:border-zinc-500 focus-visible:ring-zinc-500/20 data-[copied=true]:text-emerald-300 data-[copied=true]:hover:text-emerald-200',
      },
      size: {
        sm: 'size-6 [&_svg]:size-3',
        default: 'size-8 [&_svg]:size-4',
        md: 'size-10 [&_svg]:size-5',
        lg: 'size-12 [&_svg]:size-6',
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'default',
    },
  },
);

type CopyButtonProps = Omit<React.ComponentProps<'button'>, 'children'> &
  VariantProps<typeof copyButtonVariants> & {
    content: string;
    delay?: number;
    onCopy?: (content: string) => void;
    isCopied?: boolean;
    onCopyChange?: (isCopied: boolean) => void;
  };

async function copyToClipboard(value: string) {
  await navigator.clipboard.writeText(value);
}

function CopyButton({
  className,
  variant,
  size,
  content,
  delay = 3000,
  onCopy,
  isCopied: isCopiedProp,
  onCopyChange,
  ...props
}: CopyButtonProps) {
  const [internalCopied, setInternalCopied] = React.useState(false);
  const resetTimerRef = React.useRef<number | null>(null);

  const isControlled = isCopiedProp !== undefined;
  const copied = isControlled ? isCopiedProp : internalCopied;

  React.useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    await copyToClipboard(content);

    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }

    if (!isControlled) {
      setInternalCopied(true);
    }

    onCopyChange?.(true);
    onCopy?.(content);

    if (delay > 0) {
      resetTimerRef.current = window.setTimeout(() => {
        if (!isControlled) {
          setInternalCopied(false);
        }
        onCopyChange?.(false);
      }, delay);
    }
  };

  return (
    <button
      type="button"
      data-slot="copy-button"
      data-copied={copied ? 'true' : undefined}
      aria-label={copied ? '已复制' : '复制'}
      className={cn(copyButtonVariants({ variant, size, className }))}
      onClick={handleCopy}
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="inline-flex items-center justify-center"
          >
            <Check />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ y: 2, scale: 0.92, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -2, scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="inline-flex items-center justify-center"
          >
            <Copy />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export { CopyButton, copyButtonVariants, copyToClipboard };
export type { CopyButtonProps };
