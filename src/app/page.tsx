import { Button } from '@/components/ui/button';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background text-foreground">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">
                    Next.js 15 + shadcn/ui
                </h1>
                <p className="text-muted-foreground">
                    Ambiente configurado com TypeScript e Tailwind CSS.
                </p>
                <Button>Clique aqui</Button>
            </div>
        </main>
    );
}
