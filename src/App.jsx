import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { useUser } from './hooks/useUser';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AlphabetModule from './components/AlphabetModule';
import DrawingCanvas from './components/DrawingCanvas';
import ParentsDashboard from './components/ParentsDashboard';
import LessonsPage from './pages/LessonsPage';
import AchievementsPage from './pages/AchievementsPage';
import StorePage from './pages/StorePage';
import GamesPage from './pages/GamesPage';
import CartoonsPage from './pages/CartoonsPage';
import WelcomeModal from './components/WelcomeModal';
import FloatingShapes from './components/FloatingShapes';
import useStreak from './hooks/useStreak';
import Sound from './utils/sound';
import {
  GraduationCap, Home, Trophy, ShoppingBag, Users, Gamepad2, Clapperboard,
} from 'lucide-react';

// Kichik ekranlar uchun pastki navigatsiya (Header'dagi nav faqat lg+ ko'rinadi)
const MOBILE_NAV = [
  { to: '/', label: 'Asosiy', Icon: Home },
  { to: '/lessons', label: 'Darslar', Icon: Trophy },
  { to: '/games', label: "O'yinlar", Icon: Gamepad2 },
  { to: '/cartoons', label: 'Multfilm', Icon: Clapperboard },
  { to: '/store', label: "Do'kon", Icon: ShoppingBag },
  { to: '/parents', label: 'Ota-ona', Icon: Users },
];

export default function App() {
  const { user } = useUser();
  const { streak } = useStreak();

  return (
    <div className="relative min-h-screen pb-24 lg:pb-16">
      <FloatingShapes />

      <div className="relative z-10">
        <Header streak={streak.count} />

        <main className="mx-auto w-full max-w-6xl px-3 pt-4 sm:px-4 sm:pt-6">
          {!user ? (
            <WelcomeModal />
          ) : (
            <Routes>
              <Route path="/" element={<HeroSection />} />
              <Route path="/alphabet" element={<AlphabetModule />} />
              <Route path="/drawing" element={<DrawingCanvas />} />
              <Route path="/lessons" element={<LessonsPage />} />
              <Route path="/games" element={<GamesPage />} />
              <Route path="/cartoons" element={<CartoonsPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/store" element={<StorePage />} />
              <Route path="/parents" element={<ParentsDashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </main>

        <footer className="mt-12 mb-4 flex items-center justify-center gap-2 px-3 text-center text-sm text-slate-400">
          <GraduationCap size={16} />
          <span>
            © {new Date().getFullYear()} ZukkoKids — O'rgan va o'yna!
          </span>
        </footer>
      </div>

      {user && (
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/60 bg-white/80 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
          <div className="mx-auto flex max-w-6xl items-center justify-around px-1 py-1.5 sm:px-2">
            {MOBILE_NAV.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={Sound.select}
                className={({ isActive }) =>
                  `flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-0.5 py-1.5 text-[10px] font-bold transition ${
                    isActive ? 'bg-soft-purple/60 text-candy-purple' : 'text-slate-400'
                  }`
                }
              >
                <Icon size={20} />
                <span className="w-full truncate text-center">{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
