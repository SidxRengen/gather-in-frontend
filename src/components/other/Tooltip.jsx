import * as TooltipPrimitive from "@radix-ui/react-tooltip";

export function Tooltip({ label, children }) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>

      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side="top"
          sideOffset={8}
          className="
            z-50
            rounded-md
            bg-black/80
            backdrop-blur-md
            px-3 py-1.5
            text-xs
            text-gray-100
            border border-white/10
            shadow-lg
          "
        >
          {label}
          <TooltipPrimitive.Arrow className="fill-black/80" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
