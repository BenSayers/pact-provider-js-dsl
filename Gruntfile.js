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
        }
    });

    grunt.loadNpmTasks('grunt-conventional-changelog');
    grunt.loadNpmTasks('grunt-jasmine-node');


    grunt.registerTask('test', ['jasmine_node:unit', 'jasmine_node:e2e']);
    grunt.registerTask('docs', ['changelog']);
    grunt.registerTask('default', []);
};