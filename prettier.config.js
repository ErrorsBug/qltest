module.exports = {
    printWidth: 120,
    tabWidth: 4,
    parser: 'babylon',
    trailingComma: 'none',
    jsxBracketSameLine: true,
    semi: true,
    singleQuote: true,
    overrides: [
        {
            files: ['*.json', '.eslintrc', '.tslintrc', '.prettierrc', '.tern-project'],
            options: {
                parser: 'json',
                tabWidth: 2
            }
        },
        {
            files: '*.{css,sass,scss,less}',
            options: {
                parser: 'postcss',
                tabWidth: 2
            }
        },
        {
            files: '*.ts',
            options: {
                parser: 'typescript'
            }
        }
    ]
};
