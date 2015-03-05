module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bump: {
            options: {
                commit: true,
                commitMessage: 'chore: Release v%VERSION%',
                commitFiles: ['package.json', 'docs/CHANGELOG.md', 'docs/API.md'],
                pushTo: 'origin',
                updateConfigs: ['pkg'],
                tagName: '%VERSION%'
            }
        },
        changelog: {
            options: {
                dest: 'docs/CHANGELOG.md'
            }
        },
        jasmine_node: {
            e2e: ['test/e2e'],
            unit: ['test/unit']
        },
        jsdoc2md: {
            api: {
                src: "lib/*.js",
                dest: "docs/API.md"
            }
        }
    });

    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-conventional-changelog');
    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-jsdoc-to-markdown');
    grunt.loadNpmTasks('grunt-npm');

    grunt.registerTask('test', ['jasmine_node:unit', 'jasmine_node:e2e']);
    grunt.registerTask('docs', ['changelog', 'jsdoc2md']);
    grunt.registerTask('release', function(type) {
        if (!type) {
            grunt.fail.fatal('No release type specified. You must specify patch, minor or major. For example "grunt release:patch".');
        }
        grunt.task.run(['test', 'bump-only:' + type, 'docs', 'bump-commit', 'npm-publish']);
    });
    grunt.registerTask('default', []);
};