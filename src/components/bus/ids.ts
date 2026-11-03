// Unique ids for components that can appear more than once on a page.
let counter = 0;
export const IDS_PREFIX = () => `bus-${++counter}`;
