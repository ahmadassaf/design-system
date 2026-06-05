/**
 * Footer Component
 *
 * @description Main website footer with navigation links, social media icons,
 * newsletter signup, and copyright information. Features responsive grid layout
 * with categories, projects, and about sections.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import Icon from '@/components/core/Icon';
import Link from '@/components/core/Link';
import NewsletterForm from '@/components/layout/NewsletterForm';

const defaultSections = [
  {
    'links': [
      { 'href': '/blog/categories/engineering', 'label': 'Engineering' },
      { 'href': '/blog/categories/management', 'label': 'Management' },
      { 'href': '/blog/categories/productivity', 'label': 'Productivity' },
      { 'href': '/blog/categories/data', 'label': 'Data' }
    ],
    'title': 'Categories'
  },
  {
    'links': [
      { 'href': '/blog/projects/gaudi', 'label': 'Gaudi' }
    ],
    'title': 'Projects'
  },
  {
    'links': [
      { 'href': '/about', 'label': 'Summary' },
      { 'href': '/press', 'label': 'Press' },
      { 'href': '/blog/publications', 'label': 'Publications' }
    ],
    'title': 'About'
  }
];

const defaultSocialLinks = [
  { 'href': 'mailto:me@assaf.website', 'kind': 'mail' },
  { 'href': 'https://github.com/ahmadassaf', 'kind': 'github' },
  { 'href': 'https://www.youtube.com/ahmadassafa', 'kind': 'youtube' },
  { 'href': 'https://www.linkedin.com/in/ahmadassaf', 'kind': 'linkedin' },
  { 'href': 'https://twitter.com/ahmadaassaf', 'kind': 'twitter' }
];

const FooterSection = ({ links = [], title }) => (
  <div>
    <h3 className='text-sm font-semibold text-gray-950 dark:text-white'>{title}</h3>
    <ul role='list' className='mt-4 space-y-3'>
      {links.map((link) => (
        <li key={ `${title}-${link.href}-${link.label}` }>
          <Link href={ link.href } variant='muted' className='text-sm font-normal capitalize'>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

/**
 * Footer component with navigation and social links
 *
 * @returns {JSX.Element} Complete footer with responsive grid layout
 *
 * @example
 * <Footer />
 */
const Footer = ({
  copyrightName = 'Ahmad Assaf',
  newsletterProps = {},
  sections = defaultSections,
  socialLinks = defaultSocialLinks
}) => (
  <footer aria-labelledby='footer-heading' className='border-t border-gray-200 dark:border-border-dark'>
    <h2 id='footer-heading' className='sr-only'>Footer</h2>
    <div className='mx-auto py-10 lg:py-14'>
      <div className='grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,28rem)] lg:items-start max-md:hidden'>
        <nav aria-label='Footer navigation' className='grid gap-8 sm:grid-cols-3'>
          {sections.filter((section) => section.links?.length).map((section) => (
            <FooterSection key={ section.title } links={ section.links } title={ section.title } />
          ))}
        </nav>

        <NewsletterForm
          { ...newsletterProps }
          className='mt-0'
          classNames={{
            ...newsletterProps.classNames,
            'form': 'mt-5 flex gap-3',
            'input': 'min-h-11',
            'root': newsletterProps.classNames?.root,
            'title': 'text-sm font-semibold text-gray-950 dark:text-white'
          }}
        />
      </div>
      <div className='mt-8 border-t border-gray-200 dark:border-border-dark pt-8 md:flex md:items-center md:justify-between max-sm:border-none max-sm:p-0 max-sm:m-0 max-md:border-0'>

        <div className='flex gap-5 md:order-2 sm:justify-center'>
          {socialLinks.filter((link) => link.href).map((link) => (
            <Icon key={ link.kind } kind={ link.kind } href={ link.href } />
          ))}
        </div>

        <p className='mt-8 text-sm text-gray-500 md:order-1 md:mt-0 sm:text-center dark:text-gray-400'>
          &copy; {new Date().getFullYear()} {copyrightName}. All rights reserved.
        </p>

      </div>
    </div>
  </footer>
);

export default Footer;
