# Studio Taskboard App

A modern, full-stack taskboard application built with Next.js, TypeScript, and Tailwind CSS. This project provides a clean, extensible foundation for building productivity tools, featuring a responsive UI and modular component structure.

## Features

- **Taskboard UI**: Drag-and-drop task management interface
- **Authentication**: Login page for user authentication
- **Reusable Components**: Library of UI components (buttons, dialogs, forms, etc.)
- **Custom Hooks**: Utilities for tasks, toasts, and mobile detection
- **Theming**: Light/dark mode support
- **AI Integration**: AI utilities in `src/ai/`

## Project Structure

```
studio/
├── apphosting.yaml           # App hosting configuration
├── components.json           # Component registry
├── next.config.ts            # Next.js configuration
├── package.json              # Project dependencies and scripts
├── postcss.config.mjs        # PostCSS configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
├── docs/                     # Project documentation
├── src/
│   ├── ai/                   # AI utilities and integrations
│   ├── app/                  # Next.js app directory (pages, layouts, styles)
│   ├── components/           # UI and feature components
│   ├── hooks/                # Custom React hooks
│   └── lib/                  # Types and utility functions
```

## Getting Started

1. **Install dependencies**

   ```powershell
   npm install
   ```

2. **Run the development server**

   ```powershell
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

- `npm run dev` — Start the development server
- `npm run build` — Build for production
- `npm run start` — Start the production server

## Technologies Used

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://react.dev/)

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements and bug fixes.

## License

This project is licensed under the MIT License.
