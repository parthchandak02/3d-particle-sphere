# Particle Core Observatory

A deployable React experience built around a Spline 3D particle sphere. Live public data is captured from CORS-enabled APIs and mapped into scene motion, particle intensity, lighting, and scale in real time.

## Live data sources

- [CoinGecko](https://www.coingecko.com/) for Bitcoin, Ethereum, and Solana prices plus 24h change
- [Open-Meteo](https://open-meteo.com/) for local atmosphere temperature and wind speed

## Spline integration

The scene drives:

- `Sphere` rotation and scale from market momentum and pulse
- `Sphere + Particles` group lift and tilt
- `Directional Light` intensity from volatility
- `Particle Force` and `Particles` intensity from volatility and wind
- Optional scene variables when present: `pulse`, `momentum`, `volatility`, `temperature`

Scene URL: `https://prod.spline.design/Klk6kydm2OqssauT/scene.splinecode`

## Scripts

```bash
npm start
npm test
npm run build
npm run deploy
```

`npm run deploy` publishes the production build to GitHub Pages.

## Local development

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

This project is configured for GitHub Pages via `gh-pages`:

```bash
npm run deploy
```

Homepage: [https://parthchandak02.github.io/3d-particle-sphere](https://parthchandak02.github.io/3d-particle-sphere)
