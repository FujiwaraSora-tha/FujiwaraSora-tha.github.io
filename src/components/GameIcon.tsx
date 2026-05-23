import React from 'react';
import { 
  Home, 
  User, 
  ShoppingBag, 
  Coins, 
  Package, 
  Shield, 
  MessageSquare, 
  Calendar, 
  Compass, 
  HelpCircle, 
  Activity, 
  FileText, 
  Plus, 
  Check, 
  LogOut, 
  Key, 
  BookOpen, 
  Heart, 
  Swords, 
  Crown, 
  ArrowUpRight, 
  MapPin, 
  Users, 
  Award, 
  Zap, 
  AlertTriangle, 
  ChevronDown, 
  Gift, 
  Hourglass, 
  Lock, 
  Settings, 
  Book, 
  Sparkles, 
  Flame, 
  MessageCircle,
  TrendingUp,
  GlassWater,
  Scroll,
  Briefcase,
  RotateCcw
} from 'lucide-react';

interface GameIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const GameIcon: React.FC<GameIconProps> = ({ name, className = '', size = 20 }) => {
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    Home,
    User,
    ShoppingBag,
    Coins,
    Package,
    Shield,
    MessageSquare,
    Calendar,
    Compass,
    HelpCircle,
    Activity,
    FileText,
    Plus,
    Check,
    LogOut,
    Key,
    BookOpen,
    Heart,
    Swords,
    Crown,
    ArrowUpRight,
    MapPin,
    Users,
    Award,
    Zap,
    AlertTriangle,
    ChevronDown,
    Gift,
    Hourglass,
    Lock,
    Settings,
    Book,
    Sparkles,
    Flame,
    MessageCircle,
    TrendingUp,
    GlassWater,
    Scroll,
    Briefcase,
    RotateCcw
  };

  const Component = iconMap[name] || HelpCircle;
  return <Component className={className} size={size} />;
};
