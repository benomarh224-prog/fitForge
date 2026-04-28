'use client';

import { useAppStore } from '@/lib/store';
import { Separator } from '@/components/ui/separator';
import { Dumbbell, Github, Twitter, Instagram, Youtube, Heart } from 'lucide-react';

export function Footer() {
  const { navigate } = useAppStore();

  return (
    <footer className="border-t bg-card/50 backdrop-blur-sm mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <button onClick={() => navigate('home')} className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                P
              </div>
              <span className="text-xl font-bold tracking-tight">
                Prime<span className="text-primary"> Forge</span>
              </span>
            </button>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered fitness platform that adapts to your goals. Train smarter, not harder.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Platform</h3>
            <ul className="space-y-2">
              {[
                { label: 'Workouts', page: 'workouts' as const },
                { label: 'AI Coach', page: 'ai-coach' as const },
                { label: 'Dashboard', page: 'dashboard' as const },
                { label: 'Profile', page: 'profile' as const },
                { label: 'Nutrition', page: 'nutrition' as const },
              ].map((item) => (
                <li key={item.page}>
                  <button
                    onClick={() => navigate(item.page)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-2">
              {['About Us', 'Careers', 'Blog', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => navigate('contact')}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Connect</h3>
            <div className="flex gap-3">
              {[
                { Icon: Twitter, href: '#', label: 'Twitter' },
                { Icon: Instagram, href: '#', label: 'Instagram' },
                { Icon: Youtube, href: '#', label: 'YouTube' },
                { Icon: Github, href: '#', label: 'GitHub' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              support@primeforge.app
            </p>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Prime Forge. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> for fitness enthusiasts
          </p>
        </div>
      </div>
    </footer>
  );
}
