# Disaster Map

An interactive mapping console utilizing the NASA Earth Observatory Natural Event Tracker (EONET) v3 API. The application is built using a modern React architecture and features a clean, responsive geospatial interface.

## Project Details
- **Project Reference:** Project:02
- **Development Period:** April – May 2026
- **Deployment & Documentation:**
  - **Live Demo:** [Disaster Map](https://disaster-map-nasa-eonet.vercel.app/)
  - **Technical Publication:** [How Do You Turn Raw NASA Satellite Streams into a High-Performance Geospatial Interface?](https://dev.to/suryansh_swarn/how-do-you-turn-raw-nasa-satellite-streams-into-a-high-performance-geospatial-interface-3nlg)

---

![Disaster Map Cover](https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fxy3m8uhpsnoofx7rco8l.png)

---

## Overview

This project was built to explore geospatial data integration, responsive dashboard design, and performance optimizations when rendering high-density datasets. The application pulls live feeds from NASA's Earth Observatory Natural Event Tracker to map active environmental events globally.

---

## Core Features

- **Real-Time Geospatial Mapping**: Integrates the Leaflet mapping engine with React to render real-time global hazard data.
- **Performance-Driven Marker Clustering**: Uses `react-leaflet-cluster` to group nearby events, preventing browser rendering lag when processing large numbers of concurrent markers.
- **Context-Specific Iconography**: Displays distinct custom marker icons corresponding to each type of natural disaster.
- **Responsive Dashboard Layout**: Features a collapsible, mobile-optimized sidebar that fits within the viewport.
- **Zero-State & Alert Systems**: Employs robust conditional rendering to display contextual alerts when queries yield empty datasets.
- **Progressive Web App (PWA)**: Configured to support local installation on desktop and mobile browsers.

---

## Technical Stack

- **Framework**: [React 19](https://react.dev/) / [Vite](https://vite.dev/)
- **Geospatial Mapping**: [Leaflet](https://leafletjs.com/) / [React Leaflet](https://react-leaflet.js.org/) / [React Leaflet Cluster](https://github.com/akursar/react-leaflet-cluster)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Data Source**: [NASA EONET v3 API](https://eonet.gsfc.nasa.gov/docs/v3)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts/Metrics**: [Recharts](https://recharts.org/)

---

## Getting Started

### Prerequisites
Make sure you have Node.js installed on your system.

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Disaster-map-NASA-EONET-april26
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

### Running the Application
To launch the development server:
```bash
npm run dev
```

To compile the application for production:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## Development Changelog

### Phase 1: Project Setup & Core Mapping Integration (April 3 – 17, 2026)
* Configured the development environment using React, Vite, and Tailwind CSS.
* Integrated the Leaflet engine for geospatial map rendering.
* Connected the client to the NASA EONET v3 API and implemented data-fetching routines for global disaster logs.

### Phase 2: Interface Redesign & Custom Pin Implementation (April 18 – 19, 2026)
* Redesigned the sidebar to improve navigation, remove scrolling issues, and minimize layout footprint to allocate more screen space to the map.
* Replaced default Leaflet markers with custom category-specific icons to clearly differentiate types of natural events.

### Phase 3: Error Handling & Viewport Optimization (April 20 – 21, 2026)
* Introduced a top-right alert layout ("No targets acquired") to provide feedback when no active hazards are present in the selected coordinates.
* Implemented robust exception-handling logic to manage empty API responses safely.
* Applied responsive CSS classes to the sidebar (`max-w-[100vw]`) to ensure clean rendering on mobile viewports.
* Added a creator attribute button in the UI.

### Phase 4: Performance Scaling & Default Positioning (April 23, 2026)
* Integrated `react-leaflet-cluster` to dynamically group markers, improving frame rates and user experience when mapping hundreds of concurrent environmental events.
* Updated initial coordinate focusing to target the Indian subcontinent upon load, enabling interactive panning elsewhere.

### Phase 5: Branding & PWA Configuration (May 10, 2026)
* Designed a custom logo utilizing IconKitchen.
* Integrated Progressive Web App capabilities, enabling users to install the application natively via compatible browsers.
