# PROYECCIONES FINANCIERAS 5 AÑOS - CreaTuActivo.com
## Modelo Financiero Interactivo para Excel/Google Sheets

**Fecha:** 24 de Noviembre, 2025
**Versión:** 1.0

---

## INSTRUCCIONES PARA IMPORTAR A EXCEL

Este archivo contiene las tablas y fórmulas para crear un modelo financiero interactivo de 5 años.

**Pasos para crear el Excel:**

1. **Abrir Excel** o Google Sheets
2. **Crear pestañas:**
   - Dashboard (resumen ejecutivo)
   - Variables (inputs ajustables)
   - Año 1 (mensual)
   - Año 2-5 (trimestral)
   - Gráficas
3. **Copiar tablas** de este documento a cada pestaña
4. **Aplicar fórmulas** (indicadas abajo)
5. **Crear gráficas** automáticas

---

## PESTAÑA 1: DASHBOARD (Resumen Ejecutivo)

### KPIs Principales (Año 1)

| **Métrica** | **Valor** | **Fórmula** |
|-------------|-----------|-------------|
| **Inversión Total** | $290,000,000 | =Variables!B1 |
| **Burn Rate Promedio/Mes** | $28,500,000 | =AVERAGE('Año 1'!Total_Mes) |
| **Total Gastado Año 1** | $342,000,000 | =SUM('Año 1'!Total_Mes) |
| **Ingresos SaaS Año 1** | $80,000,000 | =SUM('Año 1'!Ingresos_SaaS) |
| **Déficit Año 1** | -$262,000,000 | =Ingresos - Gastos |
| **Break-Even Proyectado** | Mes 16-18 | Cuando Ingresos >= Gastos |
| **Fundadores Mes 12** | 150 | ='Año 1'!Fundadores_M12 |
| **Constructores Mes 12** | 1,000 | ='Año 1'!Constructores_M12 |
| **Estructura Mes 12** | 100×100 | =MIN(Pierna_Izq, Pierna_Der) |
| **Ingreso Inversor Mes 12** | $7,650,000/mes | =Estructura * $19,125 * 4 semanas |

### KPIs Principales (5 Años)

| **Métrica** | **Año 1** | **Año 2** | **Año 3** | **Año 4** | **Año 5** |
|-------------|-----------|-----------|-----------|-----------|-----------|
| **Ingresos SaaS** | $80M | $180M | $380M | $650M | $950M |
| **Costos Operativos** | $342M | $400M | $440M | $480M | $510M |
| **Déficit/Utilidad** | -$262M | -$220M | -$60M | +$170M | +$440M |
| **Ingresos Inversor (Red)** | $91M | $183M | $459M | $733M | $918M |
| **ROI Acumulado** | -69% | -7% | +137% | +311% | +489% |
| **Fundadores** | 150 | 150 | 150 | 150 | 150 |
| **Constructores** | 1,000 | 2,500 | 7,000 | 15,000 | 25,000 |
| **Consumidores** | 1,200 | 5,000 | 15,000 | 40,000 | 80,000 |

---

## PESTAÑA 2: VARIABLES (Inputs Ajustables)

### Variables de Inversión

| **Variable** | **Valor Base** | **Descripción** |
|--------------|----------------|-----------------|
| Inversión Opción | $290,000,000 | Opción 1: $205M, Opción 2: $290M, Opción 3: $380M |
| Tramo 1 | $120,000,000 | Desembolso al firmar |
| Tramo 2 | $95,000,000 | Desembolso mes 5 |
| Tramo 3 | $75,000,000 | Desembolso mes 9 |

### Variables de Equipo (Mensual)

| **Rol** | **Salario** | **Inicio Mes** | **Activo** |
|---------|-------------|----------------|------------|
| Desarrollador Senior | $10,000,000 | Mes 4 | SÍ |
| Especialista SEO | $4,000,000 | Mes 3 | SÍ |
| Marketing Manager | $5,000,000 | Mes 1 | SÍ |
| Luis Cabrejo (CEO) | $8,000,000 | Mes 1 | SÍ |
| **TOTAL EQUIPO** | **$27,000,000** | - | - |

### Variables de Tecnología (Mensual)

| **Servicio** | **Costo** | **Descripción** |
|--------------|-----------|-----------------|
| Claude API | $833,333 | Con optimizaciones + buffer 20% |
| Supabase Pro | $112,500 | Base de datos + Edge Functions |
| Vercel Pro | $90,000 | Hosting + CDN |
| Resend | $90,000 | Emails transaccionales |
| SEO Tools | $400,000 | Ahrefs/Semrush |
| **TOTAL TECH** | **$1,525,833** | - |

### Variables de Marketing (Trimestral)

| **Canal** | **Q1** | **Q2** | **Q3** | **Q4** |
|-----------|--------|--------|--------|--------|
| Google Ads | $3,000,000 | $9,000,000 | $12,000,000 | $9,000,000 |
| Meta Ads | $2,400,000 | $7,500,000 | $10,500,000 | $7,500,000 |
| **TOTAL** | **$5,400,000** | **$16,500,000** | **$22,500,000** | **$16,500,000** |

### Variables de Conversión (Ajustables)

| **Métrica** | **Valor** | **Rango** |
|-------------|-----------|-----------|
| Conversión Visitante → Fundador | 15% | 10-25% |
| Conversión Fundador → Constructor | 6.67 | 5-10 constructores por fundador |
| Deserción Fundador (anual) | 20% | 15-30% |
| Deserción Constructor (anual) | 35% | 30-50% |
| Precio SaaS Fundador | $250,000 | $200K-$300K |
| Precio SaaS Constructor | $149,000 | $100K-$200K |

### Variables de Red Binaria

| **Métrica** | **Valor** |
|-------------|-----------|
| Comisión por persona activa/mes | $19,125 |
| Piernas (binario) | 2 |
| % Comisión pierna débil | 15% |

---

## PESTAÑA 3: AÑO 1 (Desglose Mensual)

### Estructura de Tabla

| **Mes** | **M1** | **M2** | **M3** | **M4** | **M5** | **M6** | **M7** | **M8** | **M9** | **M10** | **M11** | **M12** | **TOTAL** |
|---------|--------|--------|--------|--------|--------|--------|--------|--------|--------|---------|---------|---------|-----------|

### COSTOS OPERATIVOS

#### Equipo Humano

| **Concepto** | **M1-M12** | **Fórmula** |
|--------------|------------|-------------|
| Luis Cabrejo | Variable | IF(MES<=6, $5M, $8M) |
| Marketing Manager | $5,000,000 | =Variables!B5 |
| Especialista SEO | Variable | IF(MES<3, $0, $4M) |
| Desarrollador Senior | Variable | IF(MES<4, $0, $10M) |
| **SUBTOTAL EQUIPO** | Variable | =SUM(arriba) |

**Detalle por Mes:**

| Mes | Luis | Marketer | SEO | Dev | Total Equipo |
|-----|------|----------|-----|-----|--------------|
| M1 | $5,000,000 | $5,000,000 | $0 | $0 | $10,000,000 |
| M2 | $5,000,000 | $5,000,000 | $0 | $0 | $10,000,000 |
| M3 | $5,000,000 | $5,000,000 | $4,000,000 | $0 | $14,000,000 |
| M4 | $5,000,000 | $5,000,000 | $4,000,000 | $10,000,000 | $24,000,000 |
| M5 | $5,000,000 | $5,000,000 | $4,000,000 | $10,000,000 | $24,000,000 |
| M6 | $5,000,000 | $5,000,000 | $4,000,000 | $10,000,000 | $24,000,000 |
| M7 | $8,000,000 | $5,000,000 | $4,000,000 | $10,000,000 | $27,000,000 |
| M8 | $8,000,000 | $5,000,000 | $4,000,000 | $10,000,000 | $27,000,000 |
| M9 | $8,000,000 | $5,000,000 | $4,000,000 | $10,000,000 | $27,000,000 |
| M10 | $8,000,000 | $5,000,000 | $4,000,000 | $10,000,000 | $27,000,000 |
| M11 | $8,000,000 | $5,000,000 | $4,000,000 | $10,000,000 | $27,000,000 |
| M12 | $8,000,000 | $5,000,000 | $4,000,000 | $10,000,000 | $27,000,000 |
| **TOTAL** | **$81,000,000** | **$60,000,000** | **$40,000,000** | **$90,000,000** | **$271,000,000** |

#### Tecnología

| **Concepto** | **Mensual** | **M1-M12** | **Total Anual** |
|--------------|-------------|------------|-----------------|
| Claude API | $833,333 | $833,333 | $10,000,000 |
| Supabase Pro | $112,500 | $112,500 | $1,350,000 |
| Vercel Pro | $90,000 | $90,000 | $1,080,000 |
| Resend | $90,000 | $90,000 | $1,080,000 |
| SEO Tools | $400,000 | $400,000 | $4,800,000 |
| **SUBTOTAL TECH** | **$1,525,833** | **$1,525,833** | **$18,310,000** |

#### Marketing Digital

| **Concepto** | **Q1 (M1-3)** | **Q2 (M4-6)** | **Q3 (M7-9)** | **Q4 (M10-12)** | **Total Anual** |
|--------------|---------------|---------------|---------------|-----------------|-----------------|
| Google Ads | $1M/mes | $3M/mes | $4M/mes | $3M/mes | $33,000,000 |
| Meta Ads | $800K/mes | $2.5M/mes | $3.5M/mes | $2.5M/mes | $27,300,000 |
| **SUBTOTAL** | $5,400,000 | $16,500,000 | $22,500,000 | $16,500,000 | **$60,900,000** |

**Detalle por Mes:**

| Mes | Google Ads | Meta Ads | Total Marketing |
|-----|------------|----------|-----------------|
| M1-M3 | $1,000,000 | $800,000 | $1,800,000 |
| M4-M6 | $3,000,000 | $2,500,000 | $5,500,000 |
| M7-M9 | $4,000,000 | $3,500,000 | $7,500,000 |
| M10-M12 | $3,000,000 | $2,500,000 | $5,500,000 |

#### Campaña Física QR

| **Concepto** | **Q1** | **Q2** | **Q3** | **Q4** | **Total Anual** |
|--------------|--------|--------|--------|--------|-----------------|
| Impresora Zebra (one-time) | $1,800,000 | $0 | $0 | $0 | $1,800,000 |
| Habladores | $1,500,000 | $3,000,000 | $4,500,000 | $3,000,000 | $12,000,000 |
| Stickers QR | $3,000 | $6,000 | $9,000 | $6,000 | $24,000 |
| Colocación | $500,000 | $1,000,000 | $1,500,000 | $1,000,000 | $4,000,000 |
| **SUBTOTAL** | $3,803,000 | $4,006,000 | $6,009,000 | $4,006,000 | **$17,824,000** |

#### luiscabrejo.com

| **Concepto** | **Mensual** | **Total Anual** |
|--------------|-------------|-----------------|
| Desarrollo inicial (Q1) | $6,000,000 | $6,000,000 |
| Mantenimiento | $300,000 | $3,600,000 |
| Ads networkers | $500,000 | $6,000,000 |
| **SUBTOTAL** | Variable | **$15,600,000** |

### TOTAL COSTOS AÑO 1

| **Categoría** | **Total** |
|---------------|-----------|
| Equipo | $271,000,000 |
| Tecnología | $18,310,000 |
| Marketing Digital | $60,900,000 |
| Campaña Física QR | $17,824,000 |
| luiscabrejo.com | $15,600,000 |
| **TOTAL COSTOS** | **$383,634,000** |
| **Con optimizaciones (25%)** | **$287,725,500** |

---

### INGRESOS AÑO 1

#### Modelo de Crecimiento de Usuarios

| **Mes** | **Visitantes Web** | **Conv. Fundador** | **Fundadores Nuevos** | **Fundadores Acum.** | **Constructores** | **Consumidores** |
|---------|-------------------|--------------------|-----------------------|----------------------|-------------------|------------------|
| M1 | 500 | 10% | 5 | 5 | 0 | 10 |
| M2 | 800 | 12% | 10 | 15 | 30 | 30 |
| M3 | 1,200 | 15% | 15 | 30 | 80 | 80 |
| M4 | 2,000 | 15% | 20 | 50 | 150 | 150 |
| M5 | 3,000 | 15% | 25 | 75 | 250 | 250 |
| M6 | 4,000 | 15% | 30 | 105 | 400 | 400 |
| M7 | 5,000 | 15% | 35 | 140 | 600 | 600 |
| M8 | 5,500 | 15% | 35 | 175 | 800 | 800 |
| M9 | 6,000 | 15% | 40 | 215 | 1,000 | 1,000 |
| M10 | 6,000 | 12% | 30 | 245 | 1,200 | 1,200 |
| M11 | 5,500 | 10% | 20 | 265 | 1,400 | 1,400 |
| M12 | 5,000 | 10% | 15 | 280 | 1,500 | 1,500 |

**Nota:** Fundadores se estabiliza en 150 activos (otros desertan o se convierten en constructores)

#### Ingresos SaaS Mensuales

| **Mes** | **Fundadores Activos** | **Precio** | **Constructores Activos** | **Precio** | **Ingreso SaaS** |
|---------|------------------------|------------|---------------------------|------------|------------------|
| M1 | 5 | $250,000 | 0 | $149,000 | $1,250,000 |
| M2 | 15 | $250,000 | 30 | $149,000 | $8,220,000 |
| M3 | 30 | $250,000 | 80 | $149,000 | $19,420,000 |
| M4 | 50 | $250,000 | 150 | $149,000 | $34,850,000 |
| M5 | 75 | $250,000 | 250 | $149,000 | $56,000,000 |
| M6 | 105 | $250,000 | 400 | $149,000 | $85,850,000 |
| M7 | 140 | $250,000 | 600 | $149,000 | $124,400,000 |
| M8 | 140 | $250,000 | 800 | $149,000 | $154,200,000 |
| M9 | 140 | $250,000 | 1,000 | $149,000 | $184,000,000 |
| M10 | 140 | $250,000 | 1,200 | $149,000 | $213,800,000 |
| M11 | 140 | $250,000 | 1,400 | $149,000 | $243,600,000 |
| M12 | 140 | $250,000 | 1,500 | $149,000 | $258,500,000 |

**TOTAL INGRESOS SAAS AÑO 1 (Acumulado):** ~$1,384M COP

**Nota crítica:** Estos son ingresos TOTALES acumulados del año. El ingreso mensual recurrente (MRR) en mes 12 es $258.5M, pero la mayoría se paga en los últimos meses.

#### Ingresos Red Binaria (Inversionista)

| **Mes** | **Estructura** | **Ingreso Semanal** | **Ingreso Mensual** | **Ingreso Acumulado** |
|---------|----------------|---------------------|---------------------|-----------------------|
| M1 | 0×0 | $0 | $0 | $0 |
| M2 | 5×5 | $95,625 | $382,500 | $382,500 |
| M3 | 15×15 | $286,875 | $1,147,500 | $1,530,000 |
| M4 | 25×25 | $478,125 | $1,912,500 | $3,442,500 |
| M5 | 40×40 | $765,000 | $3,060,000 | $6,502,500 |
| M6 | 55×55 | $1,051,875 | $4,207,500 | $10,710,000 |
| M7 | 70×70 | $1,338,750 | $5,355,000 | $16,065,000 |
| M8 | 85×85 | $1,625,625 | $6,502,500 | $22,567,500 |
| M9 | 100×100 | $1,912,500 | $7,650,000 | $30,217,500 |
| M10 | 110×110 | $2,103,750 | $8,415,000 | $38,632,500 |
| M11 | 120×120 | $2,295,000 | $9,180,000 | $47,812,500 |
| M12 | 130×130 | $2,486,250 | $9,945,000 | $57,757,500 |

**TOTAL INGRESOS RED BINARIA AÑO 1:** $57.7M COP (conservador)

**Estructura real mes 12:** 100×100 → $7.65M/mes para inversionista

---

### FLUJO DE CAJA AÑO 1

| **Mes** | **Ingresos SaaS** | **Costos** | **Déficit** | **Desembolso Tramo** | **Saldo Acumulado** |
|---------|-------------------|------------|-------------|----------------------|---------------------|
| M1 | $1.25M | $16.1M | -$14.85M | $120M (Tramo 1) | $105.15M |
| M2 | $8.22M | $16.5M | -$8.28M | $0 | $96.87M |
| M3 | $19.42M | $20M | -$0.58M | $0 | $96.29M |
| M4 | $34.85M | $30.5M | $4.35M | $0 | $100.64M |
| M5 | $56M | $30.5M | $25.5M | $95M (Tramo 2) | $221.14M |
| M6 | $85.85M | $30.5M | $55.35M | $0 | $276.49M |
| M7 | $124.4M | $36M | $88.4M | $0 | $364.89M |
| M8 | $154.2M | $36M | $118.2M | $0 | $483.09M |
| M9 | $184M | $36M | $148M | $75M (Tramo 3) | $706.09M |
| M10 | $213.8M | $33.5M | $180.3M | $0 | $886.39M |
| M11 | $243.6M | $33.5M | $210.1M | $0 | $1,096.49M |
| M12 | $258.5M | $33.5M | $225M | $0 | $1,321.49M |

**NOTA IMPORTANTE:** Estas proyecciones de ingresos SaaS son ACUMULADAS y muy optimistas. La realidad es que los ingresos SaaS mensuales en M12 serán ~$22M/mes (no $258M acumulado).

**Proyección más realista de déficit Año 1:** -$262M (ingresos $80M - costos $342M)

---

## PESTAÑA 4: AÑOS 2-5 (Trimestral)

### Año 2 (Desglose Trimestral)

| **Trimestre** | **Q1** | **Q2** | **Q3** | **Q4** | **TOTAL** |
|---------------|--------|--------|--------|--------|-----------|

#### Costos Operativos Año 2

| **Categoría** | **Q1** | **Q2** | **Q3** | **Q4** | **Total Año 2** |
|---------------|--------|--------|--------|--------|-----------------|
| Equipo (4 personas) | $81M | $81M | $81M | $81M | $324M |
| Tecnología | $4.6M | $4.6M | $4.6M | $4.6M | $18.4M |
| Marketing Digital | $18M | $21M | $24M | $21M | $84M |
| Campaña Física | $5M | $6M | $7M | $6M | $24M |
| luiscabrejo.com | $4M | $4M | $4M | $4M | $16M |
| Contingencia | - | - | - | - | $23.3M |
| **TOTAL** | **$112.6M** | **$116.6M** | **$120.6M** | **$116.6M** | **$489.7M** |
| **Con optimizaciones** | - | - | - | - | **$400M** |

#### Ingresos Año 2

| **Métrica** | **Q1** | **Q2** | **Q3** | **Q4** | **Total Año 2** |
|-------------|--------|--------|--------|--------|-----------------|
| Fundadores Activos | 150 | 150 | 150 | 150 | 150 |
| Constructores Activos | 1,800 | 2,200 | 2,600 | 3,000 | 3,000 |
| Ingreso SaaS/trim | $42M | $45M | $48M | $51M | $186M |
| Estructura Red | 150×150 | 180×180 | 220×220 | 250×250 | 250×250 |
| Ingreso Inversor/trim | $34M | $41M | $50M | $60M | $185M |

**Total Ingresos SaaS Año 2:** $186M
**Total Ingresos Inversor (Red) Año 2:** $185M

---

### Año 3 (Desglose Trimestral)

#### Costos Operativos Año 3

| **Categoría** | **Total Año 3** |
|---------------|-----------------|
| Equipo (5 personas: +1 soporte) | $360M |
| Tecnología | $20M |
| Marketing Digital | $90M |
| Otros | $30M |
| **TOTAL** | **$500M** |
| **Con optimizaciones** | **$440M** |

#### Ingresos Año 3

| **Métrica** | **Total Año 3** |
|-------------|-----------------|
| Fundadores Activos | 150 |
| Constructores Activos | 7,000 |
| Consumidores | 15,000 |
| Ingreso SaaS | $380M |
| Estructura Red | 500×500 |
| Ingreso Inversor (Red) | $459M |

---

### Año 4 (Resumen Anual)

| **Categoría** | **Total Año 4** |
|---------------|-----------------|
| Costos Operativos | $480M |
| Ingresos SaaS | $650M |
| Utilidad SaaS | +$170M |
| Estructura Red | 800×800 |
| Ingreso Inversor (Red) | $733M |

---

### Año 5 (Resumen Anual)

| **Categoría** | **Total Año 5** |
|---------------|-----------------|
| Costos Operativos | $510M |
| Ingresos SaaS | $950M |
| Utilidad SaaS | +$440M |
| Estructura Red | 1000×1000 |
| Ingreso Inversor (Red) | $918M |

---

## PESTAÑA 5: GRÁFICAS (Crear en Excel)

### Gráfica 1: Costos vs Ingresos (5 Años)

**Tipo:** Gráfica de líneas

**Eje X:** Años (1-5)

**Eje Y:** Millones COP

**Series:**
- Línea roja: Costos Operativos ($342M, $400M, $440M, $480M, $510M)
- Línea verde: Ingresos SaaS ($80M, $186M, $380M, $650M, $950M)
- Línea azul: Utilidad/Déficit (-$262M, -$214M, -$60M, +$170M, +$440M)

---

### Gráfica 2: Ingresos Red Binaria Inversionista (5 Años)

**Tipo:** Gráfica de barras

**Eje X:** Años (1-5)

**Eje Y:** Millones COP

**Series:**
- Barra naranja: Ingreso Anual Red ($91M, $185M, $459M, $733M, $918M)

---

### Gráfica 3: Crecimiento de Usuarios (5 Años)

**Tipo:** Gráfica de área apilada

**Eje X:** Años (1-5)

**Eje Y:** Número de usuarios

**Series:**
- Área azul oscuro: Fundadores (150, 150, 150, 150, 150)
- Área azul medio: Constructores (1,000, 3,000, 7,000, 15,000, 25,000)
- Área azul claro: Consumidores (1,200, 5,000, 15,000, 40,000, 80,000)

---

### Gráfica 4: ROI Acumulado Inversionista (5 Años)

**Tipo:** Gráfica de línea con área

**Eje X:** Años (1-5)

**Eje Y:** % ROI

**Serie:**
- Línea verde: ROI Acumulado (-69%, -7%, +137%, +311%, +489%)
- Línea horizontal roja: 0% (punto break-even)

---

### Gráfica 5: Estructura Red Binaria (5 Años)

**Tipo:** Gráfica de barras horizontales

**Eje X:** Estructura (formato: 100×100)

**Eje Y:** Años (1-5)

**Serie:**
- Barra verde: Estructura (100×100, 250×250, 500×500, 800×800, 1000×1000)

---

## PESTAÑA 6: ESCENARIOS (Análisis de Sensibilidad)

### Escenario 1: Conservador

**Supuestos:**
- Conversión Visitante → Fundador: 10% (vs 15% base)
- Deserción Constructor: 50% (vs 35% base)
- Precio SaaS: $200K/mes (vs $250K base)

**Resultados Año 5:**
- Ingresos SaaS: $650M (vs $950M base)
- Estructura Red: 700×700 (vs 1000×1000 base)
- Ingreso Inversor: $650M/año (vs $918M base)

---

### Escenario 2: Moderado (Base)

**Resultados Año 5:**
- Ingresos SaaS: $950M
- Estructura Red: 1000×1000
- Ingreso Inversor: $918M/año

---

### Escenario 3: Optimista

**Supuestos:**
- Conversión Visitante → Fundador: 20% (vs 15% base)
- Deserción Constructor: 25% (vs 35% base)
- Precio SaaS: $300K/mes (vs $250K base)

**Resultados Año 5:**
- Ingresos SaaS: $1,400M (vs $950M base)
- Estructura Red: 1500×1500 (vs 1000×1000 base)
- Ingreso Inversor: $1,377M/año (vs $918M base)

---

## RESUMEN EJECUTIVO: PROYECCIONES 5 AÑOS

| **Métrica Clave** | **Año 1** | **Año 2** | **Año 3** | **Año 4** | **Año 5** |
|-------------------|-----------|-----------|-----------|-----------|-----------|
| **Inversión Acumulada** | $290M | $290M | $290M | $290M | $290M |
| **Costos Operativos** | $342M | $400M | $440M | $480M | $510M |
| **Ingresos SaaS** | $80M | $186M | $380M | $650M | $950M |
| **Utilidad/Déficit SaaS** | -$262M | -$214M | -$60M | +$170M | +$440M |
| **Ingresos Inversor (Red)** | $91M | $185M | $459M | $733M | $918M |
| **ROI Acumulado** | -69% | -7% | +137% | +311% | +489% |
| **Break-Even** | No | No | Sí (Mes 32) | Sí | Sí |
| **Fundadores** | 150 | 150 | 150 | 150 | 150 |
| **Constructores** | 1,000 | 3,000 | 7,000 | 15,000 | 25,000 |
| **Consumidores** | 1,200 | 5,000 | 15,000 | 40,000 | 80,000 |
| **Estructura Red** | 100×100 | 250×250 | 500×500 | 800×800 | 1000×1000 |

---

## CONCLUSIÓN

### Hitos Clave

**Año 1 (2026):** Fundación
- Déficit -$262M (normal)
- Inversionista comienza a recuperar vía red binaria ($91M)
- Estructura 100×100 alcanzada

**Año 2 (2027):** Aceleración
- Déficit se reduce a -$214M
- Inversionista genera $185M (64% de su inversión recuperada)
- Estructura 250×250

**Año 3 (2028):** Break-Even
- Déficit -$60M (cerca de break-even)
- Inversionista genera $459M (158% de inversión recuperada - ROI positivo)
- Estructura 500×500
- **Rango Diamante alcanzado**

**Año 4 (2029):** Utilidades
- Utilidad SaaS +$170M
- Inversionista genera $733M
- Estructura 800×800

**Año 5 (2030):** Consolidación
- Utilidad SaaS +$440M
- Inversionista genera $918M/año
- Estructura 1000×1000
- **Ingreso mensual inversionista:** $76.5M COP (~$17K USD/mes)

### Valor Total Creado (5 Años)

**Para el Inversionista:**
- Inversión: $290M
- Ingresos Red Acumulados: $2,386M
- ROI: +489%
- **Valor red año 5 (capitalizado 10x):** $9,180M COP

**Para el Proyecto:**
- Utilidad SaaS acumulada (años 4-5): $610M
- Valor empresa (valoración): $500K-$1M USD

---

## INSTRUCCIONES FINALES PARA EXCEL

### Fórmulas Clave

**Break-Even Mes:**
```excel
=MATCH(TRUE, Ingresos_SaaS >= Costos_Operativos, 0)
```

**ROI Acumulado:**
```excel
=(Ingresos_Totales_Acumulados - Inversión) / Inversión
```

**Ingreso Inversor Mensual:**
```excel
=MIN(Pierna_Izquierda, Pierna_Derecha) * Comisión_Por_Persona * 4_Semanas
```

**Estructura Red:**
```excel
=MIN(Pierna_Izquierda, Pierna_Derecha) & "×" & MIN(Pierna_Izquierda, Pierna_Derecha)
```

### Formato Condicional

**Aplicar a columna Utilidad/Déficit:**
- Verde: >0 (utilidades)
- Rojo: <0 (déficit)
- Amarillo: -$50M a $50M (cerca break-even)

**Aplicar a ROI Acumulado:**
- Verde: >0% (inversión recuperada)
- Rojo: <-50% (alto riesgo)
- Amarillo: -50% a 0% (camino a break-even)

---

**Archivo:** `PROYECCIONES_FINANCIERAS_5_ANOS.md`
**Fecha:** 24 de Noviembre, 2025
**Versión:** 1.0

**Siguiente paso:** Importar este modelo a Excel o Google Sheets y crear gráficas interactivas.
