module.exports = function(api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src'
          },
          extensions: [
            '.js',
            '.jsx',
            '.ts',
            '.tsx',
            '.json'
          ]
        }
      ],
      [
        'react-native-reanimated/plugin',
        {
          relativeSourceLocation: true
        }
      ]
    ]
  }
}
