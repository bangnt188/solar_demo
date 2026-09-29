export const uiThemeAttributes = {
  scheme: ["light", "dark"],
  density: ["comfortable", "compact"],
} as const;

export type UiScheme = (typeof uiThemeAttributes.scheme)[number];
export type UiDensity = (typeof uiThemeAttributes.density)[number];
