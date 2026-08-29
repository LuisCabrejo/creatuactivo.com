commit da9310d9f2da8df02502d350b95053f03a03f51b
Author: Luis Cabrejo <luiscabrejo7@gmail.com>
Date:   Sat Aug 29 14:22:55 2026 -0500

    fix(seo): areaServed con los 16 países — faltaba Costa Rica (fuente: arsenal_inicial)
    
    Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>

diff --git a/src/app/layout.tsx b/src/app/layout.tsx
index 3b89dba..f578ab8 100644
--- a/src/app/layout.tsx
+++ b/src/app/layout.tsx
@@ -198,12 +198,10 @@ export default function RootLayout({
           "@type": "ContactPoint",
           "telephone": "+57-321-519-3909",
           "contactType": "customer service",
-          // Países operativos de CreaTuActivo (lista del Director, 2 ago 2026). ⚠️ La constante
-          // canónica es 16 desde el 19 ago (Puerto Rico cuenta aparte) y esta lista tiene 15:
-          // falta uno por confirmar con el Director — no se inventa.
-          // NO confundir con los más de 60 países donde Gano Excel tiene presencia.
+          // Los 16 países operativos de CreaTuActivo — fuente: arsenal_inicial.txt (lista del
+          // Director). Faltaba Costa Rica; añadido el 29 ago 2026.
           "areaServed": [
-            "CA", "US", "MX", "DO", "PR", "GT", "SV", "PA", "HN",
+            "CA", "US", "MX", "DO", "PR", "GT", "SV", "PA", "HN", "CR",
             "CO", "BR", "PE", "EC", "BO", "CL"
           ],
           "availableLanguage": ["Spanish", "Portuguese"]
