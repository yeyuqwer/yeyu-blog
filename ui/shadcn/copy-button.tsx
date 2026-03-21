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
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textArea = document.createElement('textarea');
  textArea.value = value;
  textArea.setAttribute('readonly', '');
  textArea.style.position = 'absolute';
  textArea.style.left = '-9999px';

  document.body.append(textArea);
  textArea.select();

  const copied = document.execCommand('copy');
  textArea.remove();

  if (!copied) {
    throw new Error('copy_failed');
  }
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
    try {
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
    } catch {
      // Clipboard access failed silently
    }
  };

  return (
    <button
      type="button"
      data-slot="copy-button"
      aria-label={copied ? '已复制' : '复制'}
      className={cn(copyButtonVariants({ variant, size, className }))}
      onClick={handleCopy}
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.25, bounce: 0.2 }}
            className="inline-flex items-center justify-center"
          >
            <Check />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.25, bounce: 0.2 }}
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