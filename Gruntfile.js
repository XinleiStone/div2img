module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> <%= pkg.author %> \n github: <%= pkg.repository.url %> */\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': 'dist/<%= pkg.name %>.js',
                    'demo/textClassify.min.js': 'demo/textClassify.js'
                }
            }
        },
        cssmin: {
            css: {
                files: {
                    'demo/text-classify.min.css': 'demo/text-classify.css'
                }
            }
        },
        watch: {
            files: ['dist'],
            tasks: ['jshint', 'qunit']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-css');

    grunt.registerTask('default', ['uglify', 'cssmin']);
};