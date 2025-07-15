'use client';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

export default function Navbar() {
  return (
    <NavigationMenu className="relative z-10 w-full bg-white/90 backdrop-blur border-b px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between container mx-auto">
        <span className="text-xl font-bold tracking-tight text-primary">Blog Summariser</span>
        <NavigationMenuList className="flex gap-6">
          <NavigationMenuItem>
            <NavigationMenuLink href="/" className="hover:text-blue-600 transition-colors">Home</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/blog" className="hover:text-blue-600 transition-colors">Summariser</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="https://github.com" target="_blank" className="hover:text-blue-600 transition-colors">GitHub</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </div>
    </NavigationMenu>
  );
}
