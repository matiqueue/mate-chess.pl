# Mate Chess pl - Motorola Science Cup Project  

**Note:** Contributions from external users will not be accepted, as this would invalidate our entry in the Motorola Science Cup competition.

## Project Overview  

This chess application is being developed as part of our submission for the **Motorola Science Cup** competition. The application offers an interactive and feature-rich chess experience, emphasizing creative and technical excellence.

## Team Members  

- **Mateusz Lis (Maxicom0001)** — Team Captain and Project Owner  
  - Role: Backend Developer, Creative Decision-Maker, Concept Art  
- **Szymon Góral (matiqueue)** — Project Manager  
  - Role: Fullstack Developer, Creative Decision-Maker, Work Organization  
- **Jakub Batko (nasakrator)** — Backend Developer, Database Administrator  
- **Filip Serwatka (awres)** — Frontend Developer, Three.js Specialist  
- **Wojciech Piątek (wojooo)** — Frontend Developer, Three.js Specialist  

## Project Guidelines  

Due to competition regulations, contributions from the community are not allowed. Only the listed team members can commit and make changes to this project.  

## License  

See the license.md file for details


# shadcn/ui monorepo template

This template is for creating a monorepo with shadcn/ui.

## Usage

```bash
pnpm dlx shadcn@latest init
```

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Tailwind

Your `tailwind.config.ts` and `globals.css` are already set up to use the components from the `ui` package.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/ui/button"
```
