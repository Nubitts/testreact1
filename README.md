# ⛏️ Algoritmo de Cronograma para Supervisores Mineros

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-Fast-yellow?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green)

> Solución algorítmica para la planificación automática de turnos rotativos (NxM), garantizando la cobertura operativa continua bajo restricciones estrictas de seguridad y fatiga.

## 🚀 Demo Desplegado
👉 **[Ver Aplicación en Vivo](https://TU_URL_DE_NETLIFY_AQUI.netlify.app)**

## 📋 Descripción del Problema
Una empresa minera requiere coordinar los turnos de 3 supervisores (S1, S2, S3) para asegurar que la operación de perforación nunca se detenga, cumpliendo reglas estrictas:

1.  **Continuidad Operativa:** Siempre debe haber **EXACTAMENTE 2 supervisores** perforando (Estado 'P').
2.  **Restricción de Seguridad:** Nunca deben estar los 3 perforando al mismo tiempo.
3.  **Cobertura Mínima:** Nunca debe haber solo 1 supervisor perforando (tras el arranque).
4.  **Ciclo de Vida:** Subida (S) -> Inducción (I) -> Perforación (P) -> Bajada (B) -> Descanso (D).

## 🧠 Arquitectura de la Solución (El Algoritmo)

El sistema implementa un **Motor de Satisfacción de Restricciones** basado en fases temporales:

### 1. Supervisor 1 (El Ancla Determinista)
S1 actúa como la constante temporal. Su ciclo es inamovible y define el ritmo del calendario.
* `Ciclo = N (Trabajo) + M (Descanso)`

### 2. Supervisor 3 (Cálculo Inverso)
Calculado matemáticamente para cubrir la "Bajada" de S1.
* El algoritmo determina el día exacto de su "Subida" para que termine su inducción (`I`) el mismo día que S1 entra en Bajada (`B`).
* *Fórmula:* `Offset_S3 = (Días_Trabajo_S1) - (1_Subida + Días_Inducción)`

### 3. Supervisor 2 (Ajuste por Optimización)
S2 es la variable adaptativa. El sistema utiliza un algoritmo de **búsqueda de optimización** (fuerza bruta controlada) que:
1.  Simula todos los días de inicio posibles dentro de un ciclo.
2.  Evalúa cada opción contra las reglas de negocio (suma de 'P' === 2).
3.  Selecciona el "Offset" que genera 0 colisiones y 0 huecos operativos.

## 🛠️ Stack Tecnológico

* **Core:** React.js (Hooks personalizados para la lógica matemática).
* **Build Tool:** Vite (para alto rendimiento y HMR).
* **Estilos:** Tailwind CSS (Sistema de diseño utilitario para la grilla visual).
* **Iconografía:** Lucide React.

## 🎨 Leyenda Visual

El sistema utiliza un código de colores semántico para facilitar la lectura rápida:

| Estado | Código | Color | Descripción |
| :--- | :---: | :--- | :--- |
| **Subida** | `S` | 🔵 Azul | Viaje al campo (1 día) |
| **Inducción** | `I` | 🟡 Amarillo | Capacitación (Configurable 1-5 días) |
| **Perforación** | `P` | 🟢 Verde | Trabajo efectivo (Debe haber siempre 2) |
| **Bajada** | `B` | 🔴 Rojo | Retorno (1 día) |
| **Descanso** | `D` | ⚪ Gris | Días libres |

## ⚙️ Instalación y Uso Local

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/Nubitts/testreact1.git](https://github.com/Nubitts/testreact1.git)
    cd testreact1
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Ejecutar entorno de desarrollo:**
    ```bash
    npm run dev
    ```

4.  Abrir `http://localhost:5173` en tu navegador.

## ✅ Casos de Prueba Validados

El algoritmo ha sido sometido a las casuísticas requeridas:

* **Régimen 14x7:** (5 días inducción) - *Validado*
* **Régimen 21x7:** (3 días inducción) - *Validado*
* **Régimen 10x5:** (2 días inducción) - *Validado*
* **Régimen 14x6:** (4 días inducción) - *Validado*

## 📄 Licencia
Este proyecto está bajo la Licencia MIT.
