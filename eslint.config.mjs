import pluginSecurity from 'eslint-plugin-security';

export default [
  pluginSecurity.configs.recommended,
  {
    ignores: [".next/", "node_modules/", "public/"]
  }
];
