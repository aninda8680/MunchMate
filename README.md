# MunchMate 🍔

MunchMate is a modern web application for online food ordering and pick-up, built specifically for university students. It provides a seamless experience for browsing menus, placing orders, and managing food services.

## Features ✨

- **User Authentication**: Secure sign-up and sign-in system with university email verification
- **Smart Menu Management**: Browse and search available food items
- **Real-time Availability**: Track item availability status in real-time
- **Interactive Cart**: Add/remove items with quantity management
- **Admin Dashboard**: Dedicated panel for menu management and item control
- **Responsive Design**: Fully responsive interface with smooth animations
- **Profile Management**: Detailed user profiles with academic information

## Tech Stack 🛠

- **Frontend**: React.js with Vite
- **Styling**: TailwindCSS
- **Animations**: Framer Motion, GSAP
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Image Storage**: Cloudinary
- **State Management**: React Context
- **Routing**: React Router
- **Icons**: Lucide React, React Icons

## Getting Started 🚀

1. Clone the repository:

```bash
git clone https://github.com/yourusername/munchmate.git
```

2. Install dependencies:

```bash
cd munchmate
npm install
```

3. Create a `.env` file in the root directory with your Firebase and Cloudinary credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. Start the development server:

```bash
npm run dev
```

## Project Structure 📁

```
MunchMate/
├── src/
│   ├── components/        # React components
│   ├── context/          # Context providers
│   ├── config/           # Configuration files
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Application entry point
├── public/              # Static assets
└── index.html          # HTML template
```

## Key Features 🔑

- **Enhanced UI/UX**: Smooth animations and transitions
- **Smart Search**: Real-time menu item filtering
- **Category Management**: Easy menu categorization
- **Order Management**: Streamlined ordering process
- **Academic Integration**: University-specific features

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Team Members 👥

- **Atanu Saha** - Frontend Developer
- **Shreyas Saha** - Full-Stack Developer

## Acknowledgments 🙏

- Special thanks to all contributors
- Inspired by modern food delivery platforms
- Built with ❤️ for university students
