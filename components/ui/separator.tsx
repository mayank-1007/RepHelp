// "use client";

// import * as SeparatorPrimitive from "react-divider";
// import * as React from "react";

// import { cn } from "@/lib/utils";

// const Separator = React.forwardRef<
//   React.ElementRef<typeof SeparatorPrimitive.Root>,
//   React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
// >(
//   (
//     { className, orientation = "horizontal", decorative = true, ...props },
//     ref,
//   ) => (
//     <SeparatorPrimitive.Root
//       ref={ref}
//       decorative={decorative}
//       orientation={orientation}
//       className={cn(
//         "shrink-0 bg-slate-200 dark:bg-slate-800",
//         orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
//         className,
//       )}
//       {...props}
//     />
//   ),
// );
// Separator.displayName = SeparatorPrimitive.Root.displayName;

// export { Separator };


import * as React from "react";
import { cn } from "@/lib/utils";

interface DividerProps extends React.HTMLProps<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

const Divider: React.FC<DividerProps> = ({
  className,
  orientation = "horizontal",
  ...props
}) => (
  <div
    className={cn(
      "bg-slate-200 dark:bg-slate-800",
      orientation === "horizontal"
        ? "h-[1px] w-full"
        : "h-full w-[1px]",
      className
    )}
    {...props}
  />
);

export { Divider };
