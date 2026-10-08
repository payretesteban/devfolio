import { Island } from '@hubspot/cms-components';
import {
  ModuleFields,
  TextField,
  LinkField,
  RepeatedFieldGroup,
  FieldGroup,
  ChoiceField,
} from '@hubspot/cms-components/fields';
import '../../../styles/tailwind.css';
import HeaderNav from '../../islands/HeaderNav.tsx?island';

/**
 * Global header. Rendered from a global partial so it is edited once for the
 * whole site. All interactivity (scroll state, mobile menu and the ⌘K command
 * palette) lives in the HeaderNav island; the module just maps field values
 * to plain, serialisable props.
 */
export function Component({ fieldValues }) {
  const { logo_text, logo_style, nav = [], cta, socials = [] } = fieldValues;

  return (
    <Island
      module={HeaderNav}
      hydrateOn="load"
      logoText={logo_text}
      logoStyle={logo_style}
      nav={nav.map((n) => ({ label: n.text, href: n.href }))}
      cta={{ label: cta?.text, href: cta?.link?.url?.href || '#contact' }}
      socials={socials.map((s) => ({ label: s.text, href: s.href }))}
    />
  );
}

export const fields = (
  <ModuleFields>
    <TextField name="logo_text" label="Logo text" default="EP" />
    <ChoiceField
      name="logo_style"
      label="Logo style"
      display="radio"
      default="tag"
      choices={[
        ['tag', '<EP/> tag'],
        ['path', '~/path.name'],
      ]}
    />
    <RepeatedFieldGroup
      name="nav"
      label="Navigation"
      occurrence={{ min: 0, max: 8, default: 4, sorting_label_field: 'nav.text' }}
      default={[
        { text: 'The Lab', href: '#lab' },
        { text: 'Posts', href: '#posts' },
        { text: 'Site log', href: '#log' },
        { text: 'Services', href: 'https://www.estebanpayret.com/services' },
      ]}
    >
      <TextField name="text" label="Label" default="Link" />
      <TextField name="href" label="URL or #anchor" default="#" />
    </RepeatedFieldGroup>
    <FieldGroup name="cta" label="Header button">
      <TextField name="text" label="Label" default="Let's work together" />
      <LinkField
        name="link"
        label="Link"
        supportedTypes={['EXTERNAL', 'CONTENT', 'EMAIL_ADDRESS']}
        default={{ url: { type: 'EXTERNAL', href: '#contact', content_id: null } }}
      />
    </FieldGroup>
    <RepeatedFieldGroup
      name="socials"
      label="Elsewhere (shown in ⌘K palette)"
      occurrence={{ min: 0, max: 6, default: 3, sorting_label_field: 'socials.text' }}
      default={[
        { text: 'LinkedIn', href: 'https://www.linkedin.com/in/esteban-payret/' },
        { text: 'GitHub', href: 'https://github.com/payretesteban' },
        { text: 'Email', href: 'mailto:me@estebanpayret.com' },
      ]}
    >
      <TextField name="text" label="Label" default="GitHub" />
      <TextField name="href" label="URL" default="https://github.com/" />
    </RepeatedFieldGroup>
  </ModuleFields>
);

export const meta = {
  label: 'Devfolio · Site header',
};
