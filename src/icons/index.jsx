import { FaLinkedin, FaYoutube } from 'react-icons/fa';
import { RiMailOpenFill, RiTwitterXFill } from 'react-icons/ri';
import { VscGithub } from 'react-icons/vsc';
import { ArrowRightOnRectangleIcon as HeroArrowRightOnRectangleIcon,
  BookOpenIcon as HeroBookOpenIcon,
  FingerPrintIcon as HeroFingerPrintIcon,
  HomeIcon as HeroHomeIcon,
  IdentificationIcon as HeroIdentificationIcon,
  LightBulbIcon as HeroLightBulbIcon,
  NewspaperIcon as HeroNewspaperIcon,
  RectangleGroupIcon as HeroRectangleGroupIcon,
  RectangleStackIcon as HeroRectangleStackIcon,
  TagIcon as HeroTagIcon } from '@heroicons/react/24/outline';
import ArrowDown from 'lucide-react/dist/esm/icons/arrow-down.js';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left.js';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right.js';
import ArrowUp from 'lucide-react/dist/esm/icons/arrow-up.js';
import ArrowUpCircle from 'lucide-react/dist/esm/icons/arrow-up-circle.js';
import Atom from 'lucide-react/dist/esm/icons/atom.js';
import BookOpen from 'lucide-react/dist/esm/icons/book-open.js';
import Bot from 'lucide-react/dist/esm/icons/bot.js';
import Boxes from 'lucide-react/dist/esm/icons/boxes.js';
import Braces from 'lucide-react/dist/esm/icons/braces.js';
import CalendarDays from 'lucide-react/dist/esm/icons/calendar-days.js';
import ChartArea from 'lucide-react/dist/esm/icons/chart-area.js';
import Check from 'lucide-react/dist/esm/icons/check.js';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down.js';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right.js';
import Clock from 'lucide-react/dist/esm/icons/clock.js';
import Code from 'lucide-react/dist/esm/icons/code.js';
import Code2 from 'lucide-react/dist/esm/icons/code-2.js';
import Codepen from 'lucide-react/dist/esm/icons/codepen.js';
import Container from 'lucide-react/dist/esm/icons/container.js';
import Copy from 'lucide-react/dist/esm/icons/copy.js';
import File from 'lucide-react/dist/esm/icons/file.js';
import FileCode from 'lucide-react/dist/esm/icons/file-code.js';
import FileJson from 'lucide-react/dist/esm/icons/file-json.js';
import FileText from 'lucide-react/dist/esm/icons/file-text.js';
import Flame from 'lucide-react/dist/esm/icons/flame.js';
import Folder from 'lucide-react/dist/esm/icons/folder.js';
import FolderOpen from 'lucide-react/dist/esm/icons/folder-open.js';
import GitBranch from 'lucide-react/dist/esm/icons/git-branch.js';
import GitFork from 'lucide-react/dist/esm/icons/git-fork.js';
import Grid3X3 from 'lucide-react/dist/esm/icons/grid-3x3.js';
import Handshake from 'lucide-react/dist/esm/icons/handshake.js';
import Home from 'lucide-react/dist/esm/icons/home.js';
import Image from 'lucide-react/dist/esm/icons/image.js';
import Info from 'lucide-react/dist/esm/icons/info.js';
import Link from 'lucide-react/dist/esm/icons/link.js';
import Link2Off from 'lucide-react/dist/esm/icons/link-2-off.js';
import List from 'lucide-react/dist/esm/icons/list.js';
import MailOpen from 'lucide-react/dist/esm/icons/mail-open.js';
import Menu from 'lucide-react/dist/esm/icons/menu.js';
import MessagesSquare from 'lucide-react/dist/esm/icons/messages-square.js';
import Minus from 'lucide-react/dist/esm/icons/minus.js';
import Moon from 'lucide-react/dist/esm/icons/moon.js';
import PanelsTopLeft from 'lucide-react/dist/esm/icons/panels-top-left.js';
import Plus from 'lucide-react/dist/esm/icons/plus.js';
import ScanFace from 'lucide-react/dist/esm/icons/scan-face.js';
import Search from 'lucide-react/dist/esm/icons/search.js';
import Shapes from 'lucide-react/dist/esm/icons/shapes.js';
import SquareStack from 'lucide-react/dist/esm/icons/square-stack.js';
import Star from 'lucide-react/dist/esm/icons/star.js';
import Sun from 'lucide-react/dist/esm/icons/sun.js';
import Tags from 'lucide-react/dist/esm/icons/tags.js';
import TriangleAlert from 'lucide-react/dist/esm/icons/triangle-alert.js';
import Users from 'lucide-react/dist/esm/icons/users.js';
import X from 'lucide-react/dist/esm/icons/x.js';

const safeIconLinkProtocols = new Set([ 'http:', 'https:', 'mailto:', 'tel:' ]);

const flattenIconClasses = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap(flattenIconClasses);
  if (typeof value === 'object')
    return Object.entries(value)
      .filter(([ , enabled ]) => Boolean(enabled))
      .map(([ className ]) => className);

  return [ String(value) ];
};

const iconClassName = (...values) => flattenIconClasses(values).join(' ');

const normalizeIconHref = (href) => {
  if (typeof href !== 'string') return null;

  const normalizedHref = href.trim();

  if (!normalizedHref) return null;
  if (normalizedHref.startsWith('/') || normalizedHref.startsWith('#')) return normalizedHref;

  try {
    const parsed = normalizedHref.startsWith('//') ? new URL(normalizedHref, 'https:') : new URL(normalizedHref);

    return safeIconLinkProtocols.has(parsed.protocol) ? normalizedHref : null;
  } catch {
    return null;
  }
};

const isExternalIconHref = (href) => typeof href === 'string' && (/^https?:\/\//i.test(href) || href.startsWith('//'));

export const iconRegistry = {
  'ArrowDown': ArrowDown,
  'ArrowDownIcon': ArrowDown,
  'ArrowLeft': ArrowLeft,
  'ArrowLongLeftIcon': ArrowLeft,
  'ArrowLongRightIcon': ArrowRight,
  'ArrowRight': ArrowRight,
  'ArrowRightOnRectangleIcon': HeroArrowRightOnRectangleIcon,
  'ArrowUp': ArrowUp,
  'ArrowUpCircle': ArrowUpCircle,
  'ArrowUpIcon': ArrowUp,
  'BookOpen': BookOpen,
  'BookOpenIcon': HeroBookOpenIcon,
  'Calendar': CalendarDays,
  'CalendarDaysIcon': CalendarDays,
  'ChartArea': ChartArea,
  'ChatBubbleLeftRightIcon': MessagesSquare,
  'Check': Check,
  'CheckIcon': Check,
  'ChessKnight': Shapes,
  'ChevronDown': ChevronDown,
  'ChevronDownIcon': ChevronDown,
  'ChevronRight': ChevronRight,
  'ChevronRightIcon': ChevronRight,
  'Clock': Clock,
  'ClockIcon': Clock,
  'Code': Code,
  'CodeBracketIcon': Code2,
  'Codepen': Codepen,
  'Copy': Copy,
  'CopyIcon': Copy,
  'Cubes': Boxes,
  'EnvelopeIcon': MailOpen,
  'ExclamationTriangleIcon': TriangleAlert,
  'ExternalLink': Link,
  'FaceIdError': ScanFace,
  'File': File,
  'FileText': FileText,
  'FingerPrintIcon': HeroFingerPrintIcon,
  'Flame': Flame,
  'Folder': Folder,
  'FolderOpen': FolderOpen,
  'Fork': GitFork,
  'Github': VscGithub,
  'Grid': Grid3X3,
  'Grid3X3': Grid3X3,
  'Handshake': Handshake,
  'HandshakeLine': Handshake,
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
  'Menu': Menu,
  'Minus': Minus,
  'MinusIcon': Minus,
  'Moon': Moon,
  'MoonFill': Moon,
  'NewspaperIcon': HeroNewspaperIcon,
  'Panels': PanelsTopLeft,
  'PhotoIcon': Image,
  'Plus': Plus,
  'PlusIcon': Plus,
  'RectangleGroupIcon': HeroRectangleGroupIcon,
  'RectangleStackIcon': HeroRectangleStackIcon,
  'Robot': Bot,
  'Search': Search,
  'Square3Stack3DIcon': SquareStack,
  'Star': Star,
  'Sun': Sun,
  'SunFill': Sun,
  'TagIcon': HeroTagIcon,
  'Tags': Tags,
  'Twitter': RiTwitterXFill,
  'UserGroupIcon': Users,
  'VscFile': File,
  'VscFolder': Folder,
  'VscFolderOpened': FolderOpen,
  'Warning': TriangleAlert,
  'X': X,
  'Youtube': FaYoutube,
  'css': Code,
  'docker': Container,
  'file': File,
  'folder': Folder,
  'folder-open': FolderOpen,
  'git': GitBranch,
  'github': VscGithub,
  'html': FileCode,
  'javascript': Braces,
  'json': FileJson,
  'linkedin': FaLinkedin,
  'mail': RiMailOpenFill,
  'markdown': FileText,
  'node': Boxes,
  'python': Code2,
  'react': Atom,
  'twitter': RiTwitterXFill,
  'typescript': FileCode,
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
  'amber': 'text-amber-700 dark:text-amber-300',
  'attention': 'text-rose-700 dark:text-rose-300',
  'blue': 'text-blue-600 dark:text-blue-400',
  'danger': 'text-red-600 dark:text-red-400',
  'dim': 'text-gray-400 dark:text-gray-500',
  'green': 'text-green-600 dark:text-green-400',
  'info': 'text-blue-600 dark:text-blue-400',
  'muted': 'text-gray-500 dark:text-gray-400',
  'neutral': 'text-gray-700 dark:text-gray-200',
  'primary': 'text-blue-600 dark:text-blue-400',
  'red': 'text-red-600 dark:text-red-400',
  'rose': 'text-rose-700 dark:text-rose-300',
  'success': 'text-green-600 dark:text-green-400',
  'teal': 'text-teal-700 dark:text-teal-300',
  'warning': 'text-amber-700 dark:text-amber-300',
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
  const safeHref = normalizeIconHref(href);
  const isDecorative = decorative ?? (!safeHref && !accessibleLabel);
  const svg = (
    <IconComponent
      aria-hidden={ isDecorative ? 'true' : ariaHidden }
      aria-label={ !safeHref && !isDecorative ? accessibleLabel : undefined }
      role={ !safeHref && !isDecorative ? 'img' : undefined }
      className={ iconClassName('shrink-0', iconSizes[size] || iconSizes.md, color ? iconColors[color] : undefined, className) }
      { ...props }
    />
  );

  if (!safeHref) return svg;

  return (
    <a
      className={ iconClassName('inline-flex items-center text-sm text-gray-500 transition hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400', linkClassName) }
      target={ target || (isExternalIconHref(safeHref) ? '_blank' : undefined) }
      rel={ rel || (isExternalIconHref(safeHref) ? 'noopener noreferrer' : undefined) }
      href={ safeHref }
      aria-label={ accessibleLabel || iconName }
    >
      {svg}
    </a>
  );
};

export default Icon;
