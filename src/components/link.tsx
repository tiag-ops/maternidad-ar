import NextLink from "next/link";
import type { ComponentProps } from "react";

/** Link con prefetch desactivado (static export: los prefetch de /__next.* dan 404). */
type Props = Omit<ComponentProps<typeof NextLink>, "prefetch">;

export default function Link(props: Props) {
  return <NextLink {...props} prefetch={false} />;
}
