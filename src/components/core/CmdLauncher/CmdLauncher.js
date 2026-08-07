'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTheme } from 'next-themes';

import Icon from '../Icon';
import Kbd from '../Kbd';
import { useSiteConfig } from '../../../utilities/SiteConfig';
import CommandPalette, { filterItems, getItemIndex } from './CommandPalette';

const omit = (item, keys) => {
  const result = { ...item };

  keys.forEach((key) => {
    delete result[key];
  });

  return result;
};

const normalizeSlug = (value = '') => String(value).replace(/^\//, '');
const allowedExternalProtocols = new Set([ 'http:', 'https:', 'mailto:' ]);

const normalizeExternalUrl = (value) => {
  if (!value) return null;

  try {
    const url = new URL(String(value).trim());

    return allowedExternalProtocols.has(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
};

const normalizeEmailUrl = (email) => {
  const address = String(email || '').trim();

  if (!address || /[\s<>"'`]/.test(address) || !address.includes('@')) return null;

  return normalizeExternalUrl(`mailto:${address}`);
};

const createExternalAction = (url) => () => {
  const href = normalizeExternalUrl(url);

  if (!href || typeof window === 'undefined') return;

  try {
    window.open(href, '_blank', 'noopener,noreferrer')?.focus();
  } catch {

    // Browser policies can block popups or external handlers.
  }
};

const commandItemProps = ({ closeOnSelect, href, onClick }) => {
  return {
    ...(typeof closeOnSelect === 'boolean' ? { closeOnSelect } : {}),
    ...(href ? { href } : {}),
    ...(onClick ? { onClick } : {})
  };
};

const itemConfig = {
  'navigation': {},
  'post': { 'showSubtitle': true },
  'project': { 'showSubtitle': true },
  'publication': { 'showSubtitle': true },
  'tag': { 'showSubtitle': true },
  'thought': { 'showSubtitle': true }
};

const CmdItem = ({ category, children, count, icon, subtitle, title, type = 'navigation' }) => {
  const config = itemConfig[type] || itemConfig.navigation;
  const resolvedSubtitle = subtitle || (type === 'post' && category ? category.replace(/[-_]/g, ' ') : null) || (type === 'tag' && typeof count !== 'undefined' ? `${count} ${count === 1 ? 'post' : 'posts'}` : null);

  return (
    <div className='group flex w-full items-center gap-3 rounded-lg px-4 py-3'>
      {icon ? <Icon name={ icon } decorative size='md' className='text-gray-600 dark:text-gray-300' /> : null}
      <div className='min-w-0 flex-1'>
        <div className='truncate text-sm font-medium text-gray-950 dark:text-gray-100'>{title || children}</div>
        {config.showSubtitle && resolvedSubtitle ? (
          <div className='mt-0.5 truncate text-xs capitalize text-gray-500 dark:text-gray-400'>{resolvedSubtitle}</div>
        ) : null}
      </div>
    </div>
  );
};

const LauncherFooter = () => (
  <div className='border-t border-gray-200 bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-900'>
    <div className='flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400'>
      <span className='hidden items-center gap-1 sm:flex'><Kbd keys='enter' size='xs' /> to select</span>
      <span className='flex items-center gap-1'><Kbd keys='down' size='xs' /><Kbd keys='up' size='xs' /> to navigate</span>
      <span className='flex items-center gap-1'><Kbd keys='escape' size='xs' /> to close / go back</span>
    </div>
  </div>
);

const prepareCollection = (collection, type) => (collection || []).map((item) => {
  const base = {
    ...item,
    'children': item.title || item.display || item.name,
    'id': type === 'publication' ? item.id : item.slug,
    'showType': false,
    'title': item.title || item.display || item.name,
    type
  };

  if (type === 'post')
    return omit({ ...base, 'href': `/blog/${normalizeSlug(item.slug)}` }, [ 'draft', 'externalLink', 'featured', 'filePath', 'readingTime', 'sameAs', 'tableOfContents', 'venueType' ]);

  if (type === 'project')
    return omit({ ...base, 'href': `/blog/projects/${normalizeSlug(item.slug)}`, 'subtitle': item.description || item.summary }, [ 'draft', 'externalLink', 'featured', 'filePath' ]);

  if (type === 'thought')
    return omit({ ...base, 'href': `/thoughts/${normalizeSlug(item.slug)}`, 'subtitle': item.summary || item.description }, [ 'draft', 'featured', 'filePath' ]);

  if (type === 'publication')
    return omit({ ...base, 'href': item.href, 'subtitle': item.venue || item.year }, [ 'sameAs', 'venueType' ]);

  return base;
});

const prepareTags = (tags = []) => tags.map((tag) => {
  return {
    'children': tag.title || tag.display || tag.name,
    'count': tag.count,
    'href': tag.href || `/blog/tags/${normalizeSlug(tag.slug || tag.id)}`,
    'id': tag.slug || tag.id,
    'showType': false,
    'title': tag.title || tag.display || tag.name,
    'type': 'tag'
  };
});

const collectionPageConfig = {
  'posts': { 'heading': 'Posts', 'icon': 'BookOpenIcon', 'label': 'Posts', 'type': 'post' },
  'projects': { 'heading': 'Projects', 'icon': 'RectangleGroupIcon', 'label': 'Projects', 'type': 'project' },
  'publications': { 'heading': 'Publications', 'icon': 'NewspaperIcon', 'label': 'Publications', 'type': 'publication' },
  'tags': { 'heading': 'Tags', 'icon': 'TagIcon', 'label': 'Tags', 'type': 'tag' },
  'thoughts': { 'heading': 'Thoughts', 'icon': 'LightBulbIcon', 'label': 'Thoughts', 'type': 'thought' }
};

const CollectionPage = ({ id, items, search, setPage }) => {
  const config = collectionPageConfig[id];
  const filtered = filterItems([{ 'heading': config.heading, id, items, 'options': { 'filterOnListHeading': true } }], search);

  return (
    <CommandPalette.Page id={ id } searchPrefix={ [ 'General', config.label ] } onEscape={ () => setPage('root') }>
      {filtered.length ? filtered.map((list) => (
        <CommandPalette.List key={ list.id } heading={ list.heading }>
          {list.items.map(({ category, children, count, 'id': itemId, subtitle, title, type, ...rest }) => (
            <CommandPalette.ListItem key={ itemId } index={ getItemIndex(filtered, itemId) } { ...commandItemProps(rest) }>
              <CmdItem title={ title } subtitle={ subtitle } category={ category } count={ count } type={ type || config.type }>
                {children}
              </CmdItem>
            </CommandPalette.ListItem>
          ))}
        </CommandPalette.List>
      )) : <CommandPalette.FreeSearchAction />}
    </CommandPalette.Page>
  );
};

/**
 * Builds the contact page entries from site metadata. Consumers can override the
 * whole list via the CommandLauncher `social` prop.
 */
const buildSocialItems = (metadata = {}, social) => {
  if (social) return social;

  const items = [];
  const linkedin = normalizeExternalUrl(metadata.linkedin);
  const twitter = normalizeExternalUrl(metadata.twitter);
  const github = normalizeExternalUrl(metadata.github);
  const youtube = normalizeExternalUrl(metadata.youtube);
  const email = normalizeEmailUrl(metadata.email);

  if (linkedin) items.push({ 'children': 'LinkedIn', 'closeOnSelect': false, 'icon': 'UserGroupIcon', 'id': 'linkedin', 'onClick': createExternalAction(linkedin), 'title': 'LinkedIn profile' });
  if (twitter) items.push({ 'children': 'Twitter', 'closeOnSelect': false, 'icon': 'ChatBubbleLeftRightIcon', 'id': 'twitter', 'onClick': createExternalAction(twitter), 'title': 'Twitter profile' });
  if (github) items.push({ 'children': 'GitHub', 'closeOnSelect': false, 'icon': 'CodeBracketIcon', 'id': 'github', 'onClick': createExternalAction(github), 'title': 'GitHub profile' });
  if (youtube) items.push({ 'children': 'YouTube', 'closeOnSelect': false, 'icon': 'VideoCameraIcon', 'id': 'youtube', 'onClick': createExternalAction(youtube), 'title': 'YouTube channel' });
  if (email) items.push({ 'children': 'Mail', 'closeOnSelect': false, 'icon': 'EnvelopeIcon', 'id': 'mail', 'onClick': createExternalAction(email), 'title': 'Send an email' });

  return items;
};

const SocialPage = ({ items = [], search, setPage }) => {
  const socialItems = filterItems([
    {
      'heading': 'Contact',
      'id': 'contact',
      items
    }
  ], search);

  return (
    <CommandPalette.Page id='contact' searchPrefix={ [ 'General', 'Contact' ] } onEscape={ () => setPage('root') }>
      {socialItems.length ? socialItems.map((list) => (
        <CommandPalette.List key={ list.id } heading={ list.heading }>
          {list.items.map(({ children, icon, id, title, ...rest }) => (
            <CommandPalette.ListItem key={ id } index={ getItemIndex(socialItems, id) } { ...commandItemProps(rest) }>
              <CmdItem title={ title } icon={ icon }>{children}</CmdItem>
            </CommandPalette.ListItem>
          ))}
        </CommandPalette.List>
      )) : <CommandPalette.FreeSearchAction />}
    </CommandPalette.Page>
  );
};

const NoResults = ({ search }) => (
  <div className='flex items-center gap-3 p-5 text-sm text-gray-500 dark:text-gray-400'>
    <Icon name='FaceIdError' decorative size='md' />
    <span>No results for “{search}”.</span>
  </div>
);

const CommandLauncher = ({
  open,
  posts = [],
  projects = [],
  publications = [],
  setOpen,
  social,
  tags = [],
  thoughts = []
}) => {
  const [ page, setPage ] = useState('root');
  const [ search, setSearch ] = useState('');
  const [ selected, setSelected ] = useState(0);
  const [ isKeyboardMode, setIsKeyboardMode ] = useState(true);
  const { resolvedTheme, setTheme, theme } = useTheme();
  const { metadata } = useSiteConfig();
  const socialItems = useMemo(() => buildSocialItems(metadata, social), [ metadata, social ]);

  const collections = useMemo(() => {
    return {
      'posts': prepareCollection(posts, 'post'),
      'projects': prepareCollection(projects, 'project'),
      'publications': prepareCollection(publications, 'publication'),
      'tags': prepareTags(tags),
      'thoughts': prepareCollection(thoughts, 'thought')
    };
  }, [ posts, projects, publications, tags, thoughts ]);

  const rootItems = useMemo(() => filterItems([
    {
      'heading': 'Explore content',
      'id': 'cmdLauncher',
      /* Collection entries only appear when the consumer actually supplied that collection. */
      'items': [
        { 'children': 'Home', 'cmdIcon': 'HomeIcon', 'href': '/', 'id': 'home' },
        { 'children': 'Blog', 'cmdIcon': 'BookOpenIcon', 'href': '/blog', 'id': 'blog' },
        ...(collections.projects.length ? [{ 'children': 'Projects', 'closeOnSelect': false, 'cmdIcon': 'RectangleGroupIcon', 'id': 'projects', 'onClick': () => {
          setPage('projects'); setSearch('');
        } }] : []),
        ...(collections.posts.length ? [{ 'children': 'Posts', 'closeOnSelect': false, 'cmdIcon': 'RectangleStackIcon', 'id': 'posts_list', 'onClick': () => {
          setPage('posts'); setSearch('');
        } }] : []),
        ...(collections.thoughts.length ? [{ 'children': 'Thoughts', 'closeOnSelect': false, 'cmdIcon': 'LightBulbIcon', 'id': 'thoughts', 'onClick': () => {
          setPage('thoughts'); setSearch('');
        } }] : []),
        ...(collections.publications.length ? [{ 'children': 'Publications', 'closeOnSelect': false, 'cmdIcon': 'NewspaperIcon', 'id': 'publications', 'onClick': () => {
          setPage('publications'); setSearch('');
        } }] : []),
        ...(collections.tags.length ? [{ 'children': 'Tags', 'closeOnSelect': false, 'cmdIcon': 'TagIcon', 'id': 'tags', 'onClick': () => {
          setPage('tags'); setSearch('');
        } }] : [])
      ]
    },
    {
      'heading': 'Other',
      'id': 'other',
      'items': [
        { 'children': 'About me', 'cmdIcon': 'FingerPrintIcon', 'href': '/about', 'id': 'about_me' },
        ...(socialItems.length ? [{ 'children': 'Reach out', 'closeOnSelect': false, 'cmdIcon': 'IdentificationIcon', 'id': 'reach_out', 'onClick': () => {
          setPage('contact'); setSearch('');
        } }] : []),
        { 'children': 'Switch theme', 'closeOnSelect': false, 'cmdIcon': 'ArrowRightOnRectangleIcon', 'id': 'switch_theme', 'onClick': () => setTheme(theme === 'dark' || resolvedTheme === 'dark' ? 'light' : 'dark') }
      ]
    },
    { 'heading': 'Posts', 'hidden': true, 'id': 'posts_fullTextSearch', 'items': collections.posts, 'options': { 'filterOnListHeading': true } },
    { 'heading': 'Projects', 'hidden': true, 'id': 'projects_fullTextSearch', 'items': collections.projects, 'options': { 'filterOnListHeading': true } },
    { 'heading': 'Thoughts', 'hidden': true, 'id': 'thoughts_fullTextSearch', 'items': collections.thoughts, 'options': { 'filterOnListHeading': true } },
    { 'heading': 'Publications', 'hidden': true, 'id': 'publications_fullTextSearch', 'items': collections.publications, 'options': { 'filterOnListHeading': true } },
    { 'heading': 'Tags', 'hidden': true, 'id': 'tags_fullTextSearch', 'items': collections.tags, 'options': { 'filterOnListHeading': true } }
  ], search), [ collections, resolvedTheme, search, setTheme, socialItems, theme ]);

  useEffect(() => {
    const down = (event) => {
      if (event.key !== 'k' || (!event.metaKey && !event.ctrlKey)) return;

      event.preventDefault();
      setOpen((currentOpen) => !currentOpen);
      setPage('root');
    };

    document.addEventListener('keydown', down);

    return () => document.removeEventListener('keydown', down);
  }, [ setOpen ]);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if ([ 'ArrowDown', 'ArrowUp', 'End', 'Enter', 'Escape', 'Home' ].includes(event.key)) setIsKeyboardMode(true);
    };
    const handleMouseMove = () => setIsKeyboardMode(false);

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [ open ]);

  return (
    <div className={ isKeyboardMode ? 'gaudi-command-launcher gaudi-command-launcher--keyboard' : 'gaudi-command-launcher' }>
      <CommandPalette
        className={ isKeyboardMode ? 'gaudi-command-launcher gaudi-command-launcher--keyboard' : 'gaudi-command-launcher' }
        footer={ <LauncherFooter /> }
        isOpen={ open }
        onChangeOpen={ setOpen }
        onChangeSearch={ setSearch }
        onChangeSelected={ setSelected }
        page={ page }
        search={ search }
        selected={ selected }
        showType={ false }
      >
        <CommandPalette.Page id='root' searchPrefix={ [ 'General' ] }>
          {rootItems.length ? rootItems.map((list) => (
            <div key={ `cmd-${list.id}` } className={ search.toLowerCase() === list.heading.toLowerCase() ? 'hidden' : '' }>
              <div className={ list.hidden && !search.length ? 'hidden' : 'visible' }>
                <CommandPalette.List key={ `cmdPalette-${list.id}` } heading={ list.heading }>
                  {list.items.map(({ category, children, cmdIcon, count, id, subtitle, title, type, ...rest }) => (
                    <CommandPalette.ListItem key={ `cmdPaletteItem-${list.id}-${id}` } index={ getItemIndex(rootItems, id) } { ...commandItemProps(rest) }>
                      <CmdItem title={ title } subtitle={ subtitle } category={ category } count={ count } type={ type || 'navigation' } icon={ cmdIcon }>
                        {children}
                      </CmdItem>
                    </CommandPalette.ListItem>
                  ))}
                </CommandPalette.List>
              </div>
            </div>
          )) : <NoResults search={ search } />}
        </CommandPalette.Page>
        <CollectionPage id='projects' setPage={ setPage } search={ search } items={ collections.projects } />
        <CollectionPage id='posts' setPage={ setPage } search={ search } items={ collections.posts } />
        <CollectionPage id='thoughts' setPage={ setPage } search={ search } items={ collections.thoughts } />
        <CollectionPage id='publications' setPage={ setPage } search={ search } items={ collections.publications } />
        <CollectionPage id='tags' setPage={ setPage } search={ search } items={ collections.tags } />
        <SocialPage setPage={ setPage } search={ search } items={ socialItems } />
      </CommandPalette>
    </div>
  );
};

export default CommandLauncher;
