module.exports = function (grunt) {
    grunt.initConfig({
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

    grunt.loadNpmTasks('grunt-conventional-changelog');
    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-jsdoc-to-markdown');

    grunt.registerTask('test', ['jasmine_node:unit', 'jasmine_node:e2e']);
    grunt.registerTask('docs', ['changelog', 'jsdoc2md']);
    grunt.registerTask('default', []);
};