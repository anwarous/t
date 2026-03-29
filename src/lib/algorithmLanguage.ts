/**
 * Register a Monaco Editor language for the algorithm pseudo-code dialect.
 * Safe to call multiple times – it will only register once.
 */
export function registerAlgorithmLanguage(monaco: any) {
  const LANG_ID = 'algorithm'

  // Avoid double-registration
  if (monaco.languages.getLanguages().some((l: any) => l.id === LANG_ID)) return

  monaco.languages.register({ id: LANG_ID })

  monaco.languages.setMonarchTokensProvider(LANG_ID, {
    ignoreCase: true,

    keywords: [
      'algorithme', 'algo', 'debut', 'fin', 'finsi', 'finpour', 'fintantque',
      'si', 'alors', 'sinon', 'pour', 'de', 'faire', 'tant', 'que',
      'repeter', 'répéter', 'retourner', 'procedure', 'procédure',
      'fonction', 'div', 'mod', 'et', 'ou', 'non',
    ],

    builtins: ['lire', 'ecrire', 'écrire', 'convch', 'long', 'majus'],

    typeKeywords: ['entier', 'reel', 'réel', 'booleen', 'booléen', 'chaine', 'chaîne', 'tableau', 'enregistrement'],

    structKeywords: ['tdo', 'tdnt'],

    constants: ['vrai', 'faux'],

    tokenizer: {
      root: [
        // Line comments
        [/\/\/.*$/, 'comment'],

        // String literals
        [/"/, 'string', '@string'],

        // Floating-point numbers
        [/\d+\.\d*/, 'number.float'],

        // Integer literals
        [/\d+/, 'number'],

        // Assignment arrows  <--  or  <-
        [/<--/, 'keyword.operator'],
        [/<-/,  'keyword.operator'],

        // Comparison / relational operators
        [/<=|>=|<>|!=|<|>|=/, 'operator'],

        // Arithmetic operators
        [/[+\-*/^]/, 'operator'],

        // Punctuation
        [/[()[\],:]/, 'delimiter'],

        // Identifiers and keywords (supports accented Latin letters)
        [/[a-zA-ZÀ-öø-ÿ_][a-zA-ZÀ-öø-ÿ0-9_]*/, {
          cases: {
            '@keywords':      'keyword',
            '@builtins':      'function',
            '@typeKeywords':  'type',
            '@structKeywords':'keyword.struct',
            '@constants':     'number',
            '@default':       'identifier',
          },
        }],

        // Whitespace
        [/[ \t\r\n]+/, 'white'],
      ],

      string: [
        [/[^"]+/, 'string'],
        [/"/,     'string', '@pop'],
      ],
    },
  })
}
