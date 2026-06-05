import Footer from '../../src/components/layout/Footer';
import { Button, Field, FieldInput, Link, Pill } from '../../src/index';

import { Page, pageParameters, Section } from './StoryDocs';

const editorialSections = [
  {
    'links': [
      { 'href': '/about', 'label': 'Summary' },
      { 'href': '/blog/publications', 'label': 'Publications' },
      { 'href': '/blog/projects', 'label': 'Projects' }
    ],
    'title': 'About'
  },
  {
    'links': [
      { 'href': '/blog/categories/engineering', 'label': 'Engineering' },
      { 'href': '/blog/categories/data', 'label': 'Data' },
      { 'href': '/blog/categories/productivity', 'label': 'Productivity' }
    ],
    'title': 'Blog'
  },
  {
    'links': [
      { 'href': '/blog/projects/gaudi', 'label': 'Gaudi' }
    ],
    'title': 'Projects'
  }
];

const editorialSocialLinks = [
  { 'href': 'https://github.com/ahmadassaf', 'kind': 'github' },
  { 'href': 'https://www.linkedin.com/in/ahmadassaf', 'kind': 'linkedin' },
  { 'href': 'https://twitter.com/ahmadaassaf', 'kind': 'twitter' }
];

const CurrentFooter = () => (
  <div className='rounded-lg border border-gray-200 bg-white px-6 dark:border-gray-800 dark:bg-gray-950'>
    <Footer copyrightName='Ahmad Assaf' />
  </div>
);

const EditorialFooter = () => (
  <div className='rounded-lg border border-gray-200 bg-white px-6 dark:border-gray-800 dark:bg-gray-950'>
    <Footer copyrightName='Ahmad Assaf' sections={ editorialSections } socialLinks={ editorialSocialLinks } variant='editorial' />
  </div>
);

const NewsletterFooter = () => (
  <footer className='overflow-hidden rounded-lg bg-gray-950 text-white'>
    <div className='grid gap-8 p-8 lg:grid-cols-[1.2fr_1fr]'>
      <div>
        <Pill tone='blue' variant='soft'>newsletter</Pill>
        <h3 className='mt-4 text-3xl font-extrabold tracking-tight'>Notes on AI, data, and engineering systems.</h3>
        <p className='mt-3 text-sm leading-6 text-white/75'>A footer treatment for pages where subscription is the primary secondary action.</p>
      </div>
      <form className='flex flex-col gap-3 self-end sm:flex-row'>
        <Field className='flex-1'>
          <label className='sr-only' htmlFor='footer-email'>Email address</label>
          <FieldInput id='footer-email' type='email' placeholder='you@example.com' className='min-h-11 border-white/10 bg-white/10 text-white placeholder:text-white/50 focus:ring-blue-500' />
        </Field>
        <Button type='submit' tone='blue' variant='solid'>Subscribe</Button>
      </form>
    </div>
    <div className='border-t border-white/10 px-8 py-5 text-sm text-white/60'>No spam. No fake urgency. Just useful notes.</div>
  </footer>
);

const CompactFooter = () => (
  <footer className='flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950 sm:flex-row sm:items-center sm:justify-between'>
    <p className='text-sm text-gray-500 dark:text-gray-400'>&copy; 2026 Ahmad Assaf</p>
    <nav className='flex flex-wrap gap-4' aria-label='Compact footer navigation'>
      <Link href='' tone='gray' variant='muted' className='font-normal'>Blog</Link>
      <Link href='' tone='gray' variant='muted' className='font-normal'>Projects</Link>
      <Link href='' tone='gray' variant='muted' className='font-normal'>About</Link>
    </nav>
  </footer>
);

export default {
  parameters: pageParameters,
  title: 'Blocks/Footers'
};

export const Default = {
  'name': 'Footer Blocks',
  'render': () => (
    <Page
      title='Footer Blocks'
      intro='Footer compositions for the current blog footer, editorial sitemap footers, newsletter-first pages, and compact utility pages.'
      kicker='Blocks'
    >
      <Section title='Current Blog Footer' description='Uses the actual Footer component used by the blog layout.'>
        <CurrentFooter />
      </Section>
      <Section title='Editorial Footer' description='Use for content-heavy pages with sitemap navigation.'>
        <EditorialFooter />
      </Section>
      <Section title='Newsletter Footer' description='Use where the subscription action is the main footer goal.'>
        <NewsletterFooter />
      </Section>
      <Section title='Compact Footer' description='Use for focused pages with minimal navigation needs.'>
        <CompactFooter />
      </Section>
    </Page>
  )
};
