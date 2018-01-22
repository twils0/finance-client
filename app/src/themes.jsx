import { lighten, darken, transparentize } from 'polished';

const hex = {
  background: {
    default: '#fff',
    green: '#509236',
    red: '#ed4765',
  },
  border: '#ccc',
  text: '#000',
  primary: '#8d857f',
  secondary: '#7367e6',
  invalid: '#ed4765',
};

const transparent = {
  placeholder: 0.2,
  selected: 0.2,
  disabled: 0.3,
  border: 0.05,
};

const light = {
  background: 0.55,
  border: 0.1,
};

const dark = {
  default: 0.1,
};

const theme = {
  color: {
    background: {
      default: hex.background.default,
      green: lighten(light.background, hex.background.green),
      red: lighten(light.background, hex.background.red),
    },
    primary: {
      default: hex.primary,
      dark: darken(dark.default, hex.primary),
      border: lighten(transparent.border, hex.border),
      lightBorder: lighten(light.border, hex.border),
      text: hex.text,
      placeholder: transparentize(transparent.placeholder, hex.primary),
      selected: transparentize(transparent.selected, hex.primary),
      disabled: transparentize(transparent.disabled, hex.primary),
    },
    secondary: {
      default: hex.secondary,
      dark: darken(dark.default, hex.secondary),
      border: lighten(transparent.border, hex.border),
      lightBorder: lighten(light.border, hex.border),
      text: hex.text,
      placeholder: transparentize(transparent.placeholder, hex.secondary),
      selected: transparentize(transparent.selected, hex.secondary),
      disabled: transparentize(transparent.disabled, hex.secondary),
    },
    invalid: {
      default: hex.invalid,
      dark: darken(dark.default, hex.invalid),
      border: lighten(transparent.border, hex.invalid),
      lightBorder: lighten(light.border, hex.invalid),
      text: hex.text,
      placeholder: transparentize(transparent.placeholder, hex.invalid),
      selected: transparentize(transparent.selected, hex.invalid),
      disabled: transparentize(transparent.disabled, hex.invalid),
    },
  },

  font: {
    default: 'Titillium Web',
    text: 'Titillium Web',
    button: 'Titillium Web',
  },

  fontWeight: {
    light: 300,
    normal: 400,
    bold: 700,
  },

  letterSpacing: {
    default: '0.2px',
    button: '1.9px',
    buttonTextOnly: '1.7px',
  },

  lineHeight: {
    default: '1.3em',
    input: '1.1em',
  },

  size: {
    font: {
      default: '15px',
      text: '14px',
      mobileText: '15px',
      paragraph: '17px',
      table: '16px',
      tablePage: '18px',
      button: '14px',
      label: '16px',
      errorMessage: '14px',
      h1: '30px',
      h2: '17px',
      h3: '15px',
    },
    icon: {
      search: '28px',
    },
  },

  iconViewbox: {
    search: '-200 -140 1024 1024',
  },
};

export default theme;
