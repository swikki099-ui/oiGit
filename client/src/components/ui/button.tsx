import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold uppercase tracking-widest transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 sharp-corners",
  {
    variants: {
      variant: {
        default:
           "bg-[#111111] text-[#F9F9F7] border border-transparent hover:bg-white hover:text-[#111111] hover:border-[#111111]",
        destructive:
          "bg-[#CC0000] text-white hover:bg-[#990000]",
        outline:
          "border border-[#111111] bg-transparent hover:bg-[#111111] hover:text-[#F9F9F7]",
        secondary:
          "bg-[#E5E5E0] text-[#111111] border border-[#111111] hover:bg-[#111111] hover:text-[#F9F9F7]",
        ghost: "hover:bg-[#E5E5E0] hover:text-[#111111] border border-transparent",
        link: "text-[#111111] underline-offset-4 decoration-2 decoration-[#CC0000] hover:underline",
      },
      size: {
        default: "min-h-[44px] px-6 py-2",
        sm: "min-h-[36px] px-4 text-xs",
        lg: "min-h-[56px] px-8",
        icon: "min-h-[44px] min-w-[44px] h-[44px] w-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
