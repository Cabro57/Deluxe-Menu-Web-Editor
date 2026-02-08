# 🎮 DeluxeMenus Web Editor

A powerful, modern, and intuitive web-based GUI editor for the popular Minecraft plugin **DeluxeMenus**. Build complex menus with ease using a visual interface, real-time preview, and advanced configuration tools.

![DeluxeMenus Web Editor](https://img.shields.io/badge/Minecraft-DeluxeMenus-brightgreen)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)

---

## ✨ Features

- **🚀 Drag-and-Drop Interface**: Easily move items around the inventory grid.
- **👁️ Real-time Preview**: See exactly how your menu will look in-game while you edit.
- **📝 Intelligent YAML Generator**: Automatically generates clean, optimized DeluxeMenus config files.
- **🔄 Live YAML Sync**: Switch between GUI and YAML code views with lightning-fast synchronization.
- **🎭 Placeholder Simulator**: Test your menu with simulated placeholders (e.g., `%player_name%`) to ensure dynamic content looks perfect.
- **🛡️ Requirement Schema Validation**: Follows the official DeluxeMenus wiki standards for requirements and configuration.
- **🎨 Modern Design**: Sleek, glassmorphism-inspired UI with dark mode support.
- **🌍 Internationalization**: Supports multiple languages for the editor interface.

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://reactjs.org/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: YAML-First Architecture (Single Source of Truth)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Cabro57/Deluxe-Menu-Web-Editor.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Deluxe-Menu-Web-Editor
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📖 How to Use

1. **Configure Menu Settings**: Set the menu title, size, and open commands in the primary settings sidebar.
2. **Add Items**: Click on any empty slot in the grid to create a new item.
3. **Customize Items**: Use the properties sidebar to set materials, display names, lore, priorities, and more.
4. **Export**: Once finished, click the **Export** button to copy your generated YAML or download the `.yml` file.
5. **Import**: Have an existing DeluxeMenus file? Click **Import** to load it directly into the editor.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Made with ❤️ for the DeluxeMenus community.*
