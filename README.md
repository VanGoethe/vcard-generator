# 🪪 iMMap Visit Card Generator

## 📝 About the Project
This project was developed as part of [Buzzvel](https://buzzvel.com/) technical test. It creates a solution to generate business cards with QR codes that redirect to a page containing the user's contact information, making it easier for people to access and share contact details.

## ⚙️ Features
- Register personal description
- Register personal contacts
- Customize visit card
- Generate visit card
- Download visit card
- Generate contacts page with QR code

## 🛠️ Technologies & Dependencies

### Core Technologies
- [Next.js](https://nextjs.org/) (v13.2.4) - React framework for production
- [React](https://reactjs.org/) (v18.2.0) - JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) (v4.9.5) - Typed JavaScript
- [Node.js](https://nodejs.org/) - JavaScript runtime
- [MySQL](https://www.mysql.com/) - Database (via Docker)
- [Prisma](https://www.prisma.io/) (v4.11.0) - Next-generation ORM
- [TailwindCSS](https://tailwindcss.com/) (v3.2.7) - Utility-first CSS framework

### Key Dependencies
- [React Hook Form](https://react-hook-form.com/) (v7.43.5) - Form handling
- [Zod](https://github.com/colinhacks/zod) (v3.21.4) - Schema validation
- [React QR Code](https://www.npmjs.com/package/react-qr-code) (v2.0.11) - QR code generation
- [html2canvas](https://html2canvas.hertzen.com/) (v1.4.1) - Screenshots
- [jsPDF](https://github.com/parallax/jsPDF) (v2.5.1) - PDF generation
- [Moment.js](https://momentjs.com/) (v2.30.1) - Date handling
- [Axios](https://axios-http.com/) (v1.3.4) - HTTP client

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS version recommended)
- Docker and Docker Compose
- Git

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/brunosllz/visit-card-generator
cd visit-card-generator
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy the .env-example file to .env:
   ```bash
   cp .env-example .env
   ```
   - Update the following variables in .env:
     - NEXT_PUBLIC_DEVELOPMENT_URL="http://localhost:3000"
     - DATABASE_URL="mysql://root:docker@localhost:3306/visit-card-generator"

4. Start the MySQL database using Docker:
```bash
docker-compose up -d
```

5. Run database migrations:
```bash
npx prisma migrate dev
```

6. Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000

## 🧪 Testing

The project uses Vitest for testing. Available test commands:

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage

# Open test UI
npm run test:ui
```

## 📚 Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Lint and fix code

## 🔧 Development Tools

- [ESLint](https://eslint.org/) (v8.36.0) - Code linting
- [Prisma Studio](https://www.prisma.io/studio) - Database management
- [Vitest](https://vitest.dev/) (v0.29.3) - Testing framework
- [Testing Library](https://testing-library.com/) - Testing utilities

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
