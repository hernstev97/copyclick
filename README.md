# CopyClick

A minimalist React application that lets you paste text and copy it with a single click.

## Overview

![Preview of copyclick website](screenshot.png 'CopyClick website')

[CopyClick](https://copyclick.hellofrom.sh/) is designed to streamline the copy-paste workflow by providing a simple, accessible interface where text can be pasted once, then copied multiple times with a single click.

## Features

- **One-Click Copy**: Paste text into the textarea and click anywhere on it to copy to clipboard
- **Edit Mode**: Toggle between view and edit modes
- **Sorting**: Drag and Drop of each textarea enables sorting
- **Data Sharing** Export and Import of snippets enables users to share their data
- **Theme Support**: Automatic dark/light mode detection with manual toggle
- **Persistent User Data**: User preferences and entered text for each textarea is saved in localStorage
- **Accessibility**: Keyboard navigable and screen reader friendly
- **Multilingual support**: Switch between English or German

## Technology Stack

- React 18 with TypeScript
- Context API for theme management
- SCSS for styling
- Vite for build system

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Future Enhancements
- Naming textareas for faster identification between different areas
- Keyboard shortcuts