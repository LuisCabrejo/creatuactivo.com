import React from "react";
import { Composition } from "remotion";
import { PillarIA } from "./PillarIA";
import { SeverThread } from "./SeverThread";
import { SystemDependency } from "./SystemDependency";
import { PillarMatriz } from "./PillarMatriz";
import { PillarMetodo } from "./PillarMetodo";
import { CicloTrabajoPago } from "./CicloTrabajoPago";
import { MetricasDivergentes } from "./MetricasDivergentes";
import { Ciclo3D } from "./Ciclo3D";
import { Matriz3D } from "./Matriz3D";
import { IA3D } from "./IA3D";
import { Metodo3D } from "./Metodo3D";
import { Sever3D } from "./Sever3D";
import { Dependencia3D } from "./Dependencia3D";
import { IAOnda3D } from "./IAOnda3D";
import { Checklist3D } from "./Checklist3D";
import { Metricas3D } from "./Metricas3D";
import { PrisionOperativa3D } from "./PrisionOperativa3D";
import { TresFallas3D } from "./TresFallas3D";
import { MotorCongela3D } from "./MotorCongela3D";
import { RemesasFuga3D } from "./RemesasFuga3D";
import { PuntoCritico3D } from "./PuntoCritico3D";
import { Expandir3D } from "./Expandir3D";
import { Activar3D } from "./Activar3D";
import { Maestria3D } from "./Maestria3D";
import { Pulso3D } from "./Pulso3D";
import { Ajedrez3D, AJEDREZ_FRAMES } from "./Ajedrez3D";
import { Tradicional3D } from "./Tradicional3D";
import { TradicionalVoxel3D } from "./TradicionalVoxel3D";
import { GltfTest } from "./GltfTest";
import { EmpresaGltf3D } from "./EmpresaGltf3D";
import { TiendaTest } from "./TiendaTest";
import { EmpresaDiorama3D } from "./EmpresaDiorama3D";
import { BezosSistema, FRAMES_TOTALES as BEZOS_FRAMES } from "./BezosSistema";
import { ReelBezos, FRAMES_TOTALES as REEL_BEZOS_FRAMES } from "./ReelBezos";
import { ReelDistribucion, FRAMES_TOTALES as REEL_DIST_FRAMES } from "./ReelDistribucion";
import { ReelFinal, FRAMES_TOTALES as REEL_FINAL_FRAMES } from "./ReelFinal";

const W = 1080;
const H = 1920;
const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Ajedrez3D" component={Ajedrez3D} durationInFrames={AJEDREZ_FRAMES} fps={24} width={W} height={H} />
      <Composition id="Ajedrez3D2" component={Ajedrez3D} defaultProps={{ fase: 2 }} durationInFrames={168} fps={24} width={W} height={H} />
      <Composition id="Ajedrez3D3" component={Ajedrez3D} defaultProps={{ fase: 3 }} durationInFrames={144} fps={24} width={W} height={H} />
      <Composition id="TiendaTest" component={TiendaTest} durationInFrames={130} fps={30} width={1080} height={1920} />
      <Composition id="EmpresaGltf3D" component={EmpresaGltf3D} durationInFrames={150} fps={30} width={1080} height={1920} />
      <Composition id="EmpresaDiorama3D" component={EmpresaDiorama3D} durationInFrames={150} fps={30} width={1080} height={1920} />
      <Composition id="GltfTest" component={GltfTest} durationInFrames={120} fps={30} width={1080} height={1920} />
      <Composition id="TradicionalVoxel3D" component={TradicionalVoxel3D} durationInFrames={4 * FPS} fps={FPS} width={W} height={H} defaultProps={{ label: "SU EMPRESA", orbLabel: "USTED" }} />
      <Composition
        id="Tradicional3D"
        component={Tradicional3D}
        durationInFrames={4 * FPS}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{ label: "SU EMPRESA", orbLabel: "USTED" }}
      />
      <Composition
        id="PillarIA"
        component={PillarIA}
        durationInFrames={4 * FPS}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{
          eyebrow: "PILAR 2 · QUESWA",
          title: "INTELIGENCIA\nARTIFICIAL",
          sub: "Busca · Filtra · Atiende — 24/7",
        }}
      />
      <Composition
        id="SeverThread"
        component={SeverThread}
        durationInFrames={4 * FPS}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{ topLabel: "EMPRESA", bottomLabel: "USTED" }}
      />
      <Composition
        id="SystemDependency"
        component={SystemDependency}
        durationInFrames={Math.round(7.5 * FPS)}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{
          topLabel: "UN TERCERO",
          baseA: "SU INGRESO",
          baseB: "ESTILO DE VIDA",
          threadNote: "1 solo hilo",
        }}
      />
      <Composition
        id="PillarMatriz"
        component={PillarMatriz}
        durationInFrames={4 * FPS}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{
          eyebrow: "PILAR 1 · RESPALDO OPERATIVO",
          count: 70,
          unit: "PAÍSES",
          sub: "Fábricas · Inventarios · Despachos",
        }}
      />
      <Composition
        id="PillarMetodo"
        component={PillarMetodo}
        durationInFrames={4 * FPS}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{
          eyebrow: "PILAR 3 · MÉTODO COMPROBADO",
          title: "EL MÉTODO",
          sub: "Los pasos exactos · Sin ensayo ni error",
          steps: 3,
        }}
      />
      <Composition
        id="CicloTrabajoPago"
        component={CicloTrabajoPago}
        durationInFrames={5 * FPS}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{
          eyebrow: "EL SISTEMA",
          title: "EL MISMO CICLO",
          sub: "Año tras año",
          nodes: ["TRABAJAR", "PAGAR CUENTAS", "REPETIR"],
        }}
      />
      <Composition
        id="MetricasDivergentes"
        component={MetricasDivergentes}
        durationInFrames={Math.round(4.5 * FPS)}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{
          eyebrow: "EL INTERCAMBIO",
          title: "AÑOS POR POCO",
          sub: "Mucho servicio · Poco patrimonio",
          labelA: "AÑOS DE SERVICIO",
          labelB: "PATRIMONIO",
        }}
      />
      <Composition
        id="Ciclo3D"
        component={Ciclo3D}
        durationInFrames={5 * FPS}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{
          eyebrow: "EL SISTEMA",
          title: "EL MISMO CICLO",
          sub: "Año tras año",
          nodes: ["TRABAJAR", "PAGAR CUENTAS", "REPETIR"],
        }}
      />
      <Composition
        id="Matriz3D"
        component={Matriz3D}
        durationInFrames={5 * FPS}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{
          eyebrow: "PILAR 1 · RESPALDO OPERATIVO",
          count: 70,
          unit: "PAÍSES",
          sub: "Fábricas · Inventarios · Despachos",
        }}
      />
      <Composition
        id="IA3D"
        component={IA3D}
        durationInFrames={5 * FPS}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{
          eyebrow: "PILAR 2 · QUESWA",
          title: "INTELIGENCIA\nARTIFICIAL",
          sub: "Busca · Filtra · Atiende — 24/7",
        }}
      />
      <Composition
        id="Metodo3D"
        component={Metodo3D}
        durationInFrames={5 * FPS}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{
          eyebrow: "PILAR 3 · MÉTODO COMPROBADO",
          title: "EL MÉTODO",
          sub: "Los pasos exactos · Sin ensayo ni error",
          steps: 3,
        }}
      />
      <Composition id="Sever3D" component={Sever3D} durationInFrames={4 * FPS} fps={FPS} width={W} height={H} defaultProps={{ topLabel: "EMPRESA", bottomLabel: "USTED" }} />
      <Composition id="Dependencia3D" component={Dependencia3D} durationInFrames={Math.round(7.5 * FPS)} fps={FPS} width={W} height={H} defaultProps={{ topLabel: "UN TERCERO", baseA: "SU INGRESO", baseB: "ESTILO DE VIDA", threadNote: "1 solo hilo" }} />
      <Composition id="IAOnda3D" component={IAOnda3D} durationInFrames={5 * FPS} fps={FPS} width={W} height={H} defaultProps={{ eyebrow: "PILAR 2 · QUESWA", title: "INTELIGENCIA\nARTIFICIAL", sub: "Busca · Filtra · Atiende — 24/7" }} />
      <Composition id="Checklist3D" component={Checklist3D} durationInFrames={Math.round(5 * FPS)} fps={FPS} width={W} height={H} defaultProps={{ eyebrow: "PILAR 3 · MÉTODO COMPROBADO", title: "EL MÉTODO", sub: "Los pasos exactos · Sin ensayo ni error", steps: ["PASO 01", "PASO 02", "PASO 03"] }} />
      <Composition id="Metricas3D" component={Metricas3D} durationInFrames={Math.round(4.5 * FPS)} fps={FPS} width={W} height={H} defaultProps={{ eyebrow: "EL INTERCAMBIO", title: "AÑOS POR POCO", sub: "Mucho servicio · Poco patrimonio", labelA: "AÑOS DE SERVICIO", labelB: "PATRIMONIO" }} />
      <Composition id="PrisionOperativa3D" component={PrisionOperativa3D} durationInFrames={Math.round(6.5 * FPS)} fps={FPS} width={W} height={H} defaultProps={{ eyebrow: "", title: "", sub: "", towerLabel: "SU EMPRESA", orbLabel: "USTED" }} />
      <Composition id="TresFallas3D" component={TresFallas3D} durationInFrames={Math.round(6.2 * FPS)} fps={FPS} width={W} height={H} defaultProps={{ eyebrow: "UN CARGO AUTOGESTIONADO", title: "NO ES PATRIMONIO", sub: "Es un puesto que usted creó", items: ["NO SE HEREDA", "NO SE VENDE", "NO PRODUCE SIN USTED"], validFrames: [22, 62, 155] }} />
      <Composition id="MotorCongela3D" component={MotorCongela3D} durationInFrames={Math.round(3.9 * FPS)} fps={FPS} width={W} height={H} defaultProps={{ eyebrow: "EL DÍA QUE USTED PARA", title: "SE FRENA\nCON USTED", sub: "Se cansa · se enferma · para", freezeAt: 81 }} />
      <Composition id="MotorGira3D" component={MotorCongela3D} durationInFrames={Math.round(3.4 * FPS)} fps={FPS} width={W} height={H} defaultProps={{ eyebrow: "SU DESGASTE FÍSICO", title: "EL ÚNICO\nMOTOR", sub: "Su cuerpo · su economía", freezeAt: 9999, titleAt: 20 }} />
      <Composition id="RemesasFuga3D" component={RemesasFuga3D} durationInFrames={Math.round(6.0 * FPS)} fps={FPS} width={W} height={H} defaultProps={{ eyebrow: "LIQUIDEZ QUE ENTRA Y SALE", title: "NADA SE QUEDA", sub: "Cuentas · casa · el patrimonio de otros" }} />
      <Composition id="MotorFrena3D" component={MotorCongela3D} durationInFrames={Math.round(3.5 * FPS)} fps={FPS} width={W} height={H} defaultProps={{ eyebrow: "SI USTED SE DETIENE", title: "SU INGRESO\nSE DETIENE", sub: "", freezeAt: 83, titleAt: 20 }} />
      <Composition id="PuntoCritico3D" component={PuntoCritico3D} durationInFrames={Math.round(6.7 * FPS)} fps={FPS} width={W} height={H} defaultProps={{ eyebrow: "TODO DEPENDE DE USTED", title: "VULNERABILIDAD\nCRÍTICA", sub: "Si usted no está de pie, el ingreso cae", loadLabel: "SU INGRESO", pillarLabel: "USTED", critAt: 144 }} />
      {/* === MÉTODO COMPROBADO (Slide 2 servilleta) — clips limpios, nombre va como overlay HTML === */}
      <Composition id="Expandir3D" component={Expandir3D} durationInFrames={Math.round(5 * FPS)} fps={FPS} width={W} height={H} defaultProps={{ eyebrow: "", title: "", sub: "" }} />
      <Composition id="Activar3D" component={Activar3D} durationInFrames={Math.round(5.2 * FPS)} fps={FPS} width={W} height={H} defaultProps={{ eyebrow: "", title: "", sub: "" }} />
      <Composition id="Maestria3D" component={Maestria3D} durationInFrames={Math.round(5 * FPS)} fps={FPS} width={W} height={H} defaultProps={{ eyebrow: "", title: "", sub: "" }} />
      <Composition id="Pulso3D" component={Pulso3D} durationInFrames={Math.round(6.2 * FPS)} fps={FPS} width={W} height={H} defaultProps={{ eyebrow: "LA CONVERSIÓN A PULSO", title: "NO SE\nDUPLICA", sub: "El esfuerzo no se transfiere" }} />
      {/* === Reel tipografía kinética (Dan Koe) — Bezos / El Sistema === */}
      <Composition id="BezosSistema" component={BezosSistema} durationInFrames={BEZOS_FRAMES} fps={FPS} width={W} height={H} />
      {/* Reel GRÁFICAS-led (reusa comps 3D): barras → engranajes → orbe IA */}
      <Composition id="ReelBezos" component={ReelBezos} durationInFrames={REEL_BEZOS_FRAMES} fps={FPS} width={W} height={H} />
      {/* Globo de distribución animado (line-art Dan Koe) + titulares grandes */}
      <Composition id="ReelDistribucion" component={ReelDistribucion} durationInFrames={REEL_DIST_FRAMES} fps={FPS} width={W} height={H} />
      {/* MONTAJE FINAL: 5 clips Veo + VO + titulares + logo (tapa watermark) */}
      <Composition id="ReelFinal" component={ReelFinal} durationInFrames={REEL_FINAL_FRAMES} fps={FPS} width={W} height={H} />
    </>
  );
};
