import type { Metadata } from "next";
import { CloudSun, Code, Layers, Gauge, GitBranch } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header, StaticBackground } from "@/components";

export const metadata: Metadata = {
  title: "A propos",
  description: "En savoir plus sur meteo-aura et sa stack technique",
};

const techStack = [
  { name: "Next.js 16", category: "Framework" },
  { name: "React 19", category: "UI" },
  { name: "TypeScript", category: "Language" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "shadcn/ui", category: "Components" },
  { name: "Framer Motion", category: "Animations" },
  { name: "Recharts", category: "Charts" },
  { name: "Zod", category: "Validation" },
  { name: "Open-Meteo", category: "API" },
];

const features = [
  "Recherche de villes avec autocompletion",
  "Meteo actuelle detaillee",
  "Previsions horaires sur 48h",
  "Previsions sur 7 jours",
  "Graphiques interactifs",
  "Systeme de favoris",
  "Unites configurables (C/F, km/h/mph)",
  "Theme clair/sombre/systeme",
  "Interface responsive",
  "PWA installable",
];

const limitations = [
  "Donnees fournies par Open-Meteo (gratuit, sans cle API)",
  "Precision dependante de la source de donnees",
  "Pas d'alertes meteo en temps reel",
  "Historique limite aux recherches recentes",
];

const roadmap = [
  "Carte interactive avec couches meteo",
  "Alertes et notifications",
  "Widget meteo embarquable",
  "Mode comparaison de villes",
  "Donnees de qualite de l'air",
];

export default function AboutPage() {
  return (
    <StaticBackground>
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <CloudSun className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">meteo-aura</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Une application meteo moderne et complete, construite avec les dernieres technologies
            web. Projet portfolio demonstrant une architecture propre et une UI soignee.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* stack technique */}
          <Card className="bg-background/80 backdrop-blur-sm border-border/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Stack technique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <Badge key={tech.name} variant="secondary" className="text-xs">
                    {tech.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* fonctionnalites */}
          <Card className="bg-background/80 backdrop-blur-sm border-border/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                Fonctionnalites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5 text-sm">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* limites */}
          <Card className="bg-background/80 backdrop-blur-sm border-border/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Limites connues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {limitations.map((limit) => (
                  <li key={limit} className="flex items-start gap-2">
                    <span className="mt-1">-</span>
                    {limit}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* roadmap */}
          <Card className="bg-background/80 backdrop-blur-sm border-border/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5 text-sm">
                {roadmap.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-muted-foreground mt-1">-</span>
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* credits */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Donnees meteo fournies par{" "}
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Open-Meteo
            </a>
          </p>
        </div>
      </main>
    </StaticBackground>
  );
}
