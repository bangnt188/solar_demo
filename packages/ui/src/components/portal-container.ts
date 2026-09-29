import type { RefObject } from "react";

export type PortalContainer = HTMLElement | ShadowRoot | RefObject<HTMLElement | ShadowRoot | null> | null;
