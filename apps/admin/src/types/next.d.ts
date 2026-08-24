declare module 'next/link' {
  import React, { ComponentProps } from 'react';
  import { UrlObject } from 'url';

  type Url = string | UrlObject;

  export interface LinkProps extends Omit<ComponentProps<'a'>, 'href'> {
    href: Url;
    as?: Url;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
  }

  const Link: React.ForwardRefExoticComponent<
    LinkProps & React.RefAttributes<HTMLAnchorElement>
  >;

  export default Link;
}

declare module 'next/navigation' {
  export interface ReadonlyURLSearchParams extends URLSearchParams {
    append(name: string, value: string): void;
    delete(name: string): void;
    set(name: string, value: string): void;
    sort(): void;
  }

  export interface AppRouterInstance {
    back(): void;
    forward(): void;
    refresh(): void;
    push(href: string, options?: { scroll?: boolean }): void;
    replace(href: string, options?: { scroll?: boolean }): void;
    prefetch(href: string): void;
  }

  export function useRouter(): AppRouterInstance;
  export function usePathname(): string;
  export function useSearchParams(): ReadonlyURLSearchParams;
  export function useParams(): Record<string, string | string[]>;
}
