import { FaLinkedin, FaYoutube } from 'react-icons/fa';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import { GoRepoForked, GoStar } from 'react-icons/go';
import { HiSquare3Stack3D } from 'react-icons/hi2';
import { IoArrowUpCircleOutline } from 'react-icons/io5';
import { LiaChartAreaSolid,
  LiaChessKnightSolid,
  LiaCodepen,
  LiaCubesSolid,
  LiaHandshake,
  LiaRobotSolid } from 'react-icons/lia';
import { RiMailOpenFill, RiMoonClearFill, RiSunFill, RiTwitterXFill } from 'react-icons/ri';
import { SiDocker,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiJson,
  SiMarkdown,
  SiNodedotjs,
  SiPython,
  SiReact,
  SiTypescript } from 'react-icons/si';
import { TbFaceIdError } from 'react-icons/tb';
import { VscFile, VscFolder, VscFolderOpened, VscGithub } from 'react-icons/vsc';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import { ArrowRightOnRectangleIcon as HeroArrowRightOnRectangleIcon,
  BookOpenIcon as HeroBookOpenIcon,
  ChatBubbleLeftRightIcon as HeroChatBubbleLeftRightIcon,
  CodeBracketIcon as HeroCodeBracketIcon,
  EnvelopeIcon as HeroEnvelopeIcon,
  FingerPrintIcon as HeroFingerPrintIcon,
  HomeIcon as HeroHomeIcon,
  IdentificationIcon as HeroIdentificationIcon,
  LightBulbIcon as HeroLightBulbIcon,
  NewspaperIcon as HeroNewspaperIcon,
  RectangleGroupIcon as HeroRectangleGroupIcon,
  RectangleStackIcon as HeroRectangleStackIcon,
  TagIcon as HeroTagIcon,
  UserGroupIcon as HeroUserGroupIcon } from '@heroicons/react/24/outline';
import { ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Code,
  Copy,
  File,
  FileText,
  Flame,
  Folder,
  FolderOpen,
  Grid3X3,
  Handshake,
  Home,
  Image,
  Info,
  Link,
  Link2Off,
  List,
  Minus,
  Moon,
  PanelsTopLeft,
  Plus,
  Search,
  Sun,
  Tags,
  TriangleAlert,
  X } from 'lucide-react';

import { cn } from '../utilities/cn';

export const iconRegistry = {
  'ArrowDown': ArrowDown,
  'ArrowDownIcon': ArrowDown,
  'ArrowLeft': ArrowLeft,
  'ArrowLongLeftIcon': ArrowLeft,
  'ArrowLongRightIcon': ArrowRight,
  'ArrowRight': ArrowRight,
  'ArrowRightOnRectangleIcon': HeroArrowRightOnRectangleIcon,
  'ArrowUp': ArrowUp,
  'ArrowUpCircle': IoArrowUpCircleOutline,
  'ArrowUpIcon': ArrowUp,
  'BookOpen': BookOpen,
  'BookOpenIcon': HeroBookOpenIcon,
  'Calendar': CalendarDays,
  'CalendarDaysIcon': CalendarDays,
  'ChartArea': LiaChartAreaSolid,
  'ChatBubbleLeftRightIcon': HeroChatBubbleLeftRightIcon,
  'Check': Check,
  'CheckIcon': IconCheck,
  'ChessKnight': LiaChessKnightSolid,
  'ChevronDown': ChevronDown,
  'ChevronDownIcon': ChevronDown,
  'ChevronRight': ChevronRight,
  'ChevronRightIcon': ChevronRight,
  'Clock': Clock,
  'ClockIcon': Clock,
  'Code': Code,
  'CodeBracketIcon': HeroCodeBracketIcon,
  'Codepen': LiaCodepen,
  'Copy': Copy,
  'CopyIcon': IconCopy,
  'Cubes': LiaCubesSolid,
  'EnvelopeIcon': HeroEnvelopeIcon,
  'ExclamationTriangleIcon': TriangleAlert,
  'ExternalLink': Link,
  'FaceIdError': TbFaceIdError,
  'File': File,
  'FileText': FileText,
  'FingerPrintIcon': HeroFingerPrintIcon,
  'Flame': Flame,
  'Folder': Folder,
  'FolderOpen': FolderOpen,
  'Fork': GoRepoForked,
  'Github': VscGithub,
  'Grid': Grid3X3,
  'Grid3X3': Grid3X3,
  'Handshake': Handshake,
  'HandshakeLine': LiaHandshake,
  'Home': Home,
  'HomeIcon': HeroHomeIcon,
  'IdentificationIcon': HeroIdentificationIcon,
  'Image': Image,
  'Info': Info,
  'InformationCircleIcon': Info,
  'LightBulbIcon': HeroLightBulbIcon,
  'Link': Link,
  'LinkIcon': Link,
  'LinkSlashIcon': Link2Off,
  'Linkedin': FaLinkedin,
  'List': List,
  'MagnifyingGlassIcon': Search,
  'Mail': RiMailOpenFill,
  'Minus': Minus,
  'MinusIcon': FaMinus,
  'Moon': Moon,
  'MoonFill': RiMoonClearFill,
  'NewspaperIcon': HeroNewspaperIcon,
  'Panels': PanelsTopLeft,
  'PhotoIcon': Image,
  'Plus': Plus,
  'PlusIcon': FaPlus,
  'RectangleGroupIcon': HeroRectangleGroupIcon,
  'RectangleStackIcon': HeroRectangleStackIcon,
  'Robot': LiaRobotSolid,
  'Search': Search,
  'Square3Stack3DIcon': HiSquare3Stack3D,
  'Star': GoStar,
  'Sun': Sun,
  'SunFill': RiSunFill,
  'TagIcon': HeroTagIcon,
  'Tags': Tags,
  'Twitter': RiTwitterXFill,
  'UserGroupIcon': HeroUserGroupIcon,
  'VscFile': VscFile,
  'VscFolder': VscFolder,
  'VscFolderOpened': VscFolderOpened,
  'Warning': TriangleAlert,
  'X': X,
  'Youtube': FaYoutube,
  'css': Code,
  'docker': SiDocker,
  'file': VscFile,
  'folder': VscFolder,
  'folder-open': VscFolderOpened,
  'git': SiGit,
  'github': VscGithub,
  'html': SiHtml5,
  'javascript': SiJavascript,
  'json': SiJson,
  'linkedin': FaLinkedin,
  'mail': RiMailOpenFill,
  'markdown': SiMarkdown,
  'node': SiNodedotjs,
  'python': SiPython,
  'react': SiReact,
  'twitter': RiTwitterXFill,
  'typescript': SiTypescript,
  'youtube': FaYoutube
};

export const iconLabels = {
  'Github': 'GitHub profile',
  'Linkedin': 'LinkedIn profile',
  'Mail': 'Email',
  'Twitter': 'X profile',
  'Youtube': 'YouTube channel',
  'github': 'GitHub profile',
  'linkedin': 'LinkedIn profile',
  'mail': 'Email',
  'twitter': 'X profile',
  'youtube': 'YouTube channel'
};

export const iconSizes = {
  '2xl': 'h-10 w-10',
  'lg': 'h-6 w-6',
  'md': 'h-5 w-5',
  'sm': 'h-4 w-4',
  'xl': 'h-8 w-8',
  'xs': 'h-3 w-3'
};

export const iconColors = {
  'blue': 'text-blue-600 dark:text-blue-400',
  'danger': 'text-red-600 dark:text-red-400',
  'dim': 'text-gray-400 dark:text-gray-500',
  'green': 'text-green-600 dark:text-green-400',
  'muted': 'text-gray-500 dark:text-gray-400',
  'neutral': 'text-gray-700 dark:text-gray-200',
  'primary': 'text-blue-600 dark:text-blue-400',
  'red': 'text-red-600 dark:text-red-400',
  'warning': 'text-yellow-700 dark:text-yellow-300',
  'yellow': 'text-yellow-600 dark:text-yellow-300'
};

export const getIcon = (name) => iconRegistry[name] || null;

const Icon = ({
  'aria-hidden': ariaHidden,
  className = '',
  color,
  decorative,
  href,
  kind,
  label,
  linkClassName,
  name,
  rel,
  size = 'md',
  target,
  title,
  ...props
}) => {
  const iconName = name || kind;
  const IconComponent = getIcon(iconName);

  if (!IconComponent) return null;

  const accessibleLabel = label || title || iconLabels[iconName];
  const isDecorative = decorative ?? (!href && !accessibleLabel);
  const svg = (
    <IconComponent
      aria-hidden={ isDecorative ? 'true' : ariaHidden }
      aria-label={ !href && !isDecorative ? accessibleLabel : undefined }
      role={ !href && !isDecorative ? 'img' : undefined }
      className={ cn('shrink-0', iconSizes[size] || iconSizes.md, color ? iconColors[color] : undefined, className) }
      { ...props }
    />
  );

  if (!href) return svg;

  return (
    <a
      className={ cn('inline-flex items-center text-sm text-gray-500 transition hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400', linkClassName) }
      target={ target || (href.startsWith('http') ? '_blank' : undefined) }
      rel={ rel || (href.startsWith('http') ? 'noopener noreferrer' : undefined) }
      href={ href }
      aria-label={ accessibleLabel || iconName }
    >
      {svg}
    </a>
  );
};

export default Icon;
