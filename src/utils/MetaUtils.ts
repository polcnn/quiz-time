import { config } from "@/config";

export const SetMetaTitle = (title: string): string => {
  return `${title} - ${config.meta.title}`;
};
