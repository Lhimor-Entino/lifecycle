import './bootstrap';

import React from 'react';
import ReactDOM, { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/inertia-react';
import { InertiaProgress } from '@inertiajs/progress';
import { ThemeProvider } from './Providers/ThemeProvider';
import { QueryClient,QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './Components/ui/sonner';

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => require(`./Pages/${name}`),
    setup({ el, App, props }) {
        const root = createRoot(el);
        const queryClient = new QueryClient();
        root.render(
            <QueryClientProvider client={queryClient}>
                <ThemeProvider defaultTheme='dark' storageKey="vite-ui-theme">
                    <App {...props} />
                    <Toaster richColors theme='dark' closeButton duration={2323} position='top-center'/>
                </ThemeProvider>      
            </QueryClientProvider>      
        );
    },
});




InertiaProgress.init({ color: '#8b5cf6',delay:10 });
