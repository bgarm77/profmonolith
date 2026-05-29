import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Локале-осведомлённые обёртки для навигации
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
