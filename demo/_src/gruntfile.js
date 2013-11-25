module.exports = function(grunt) 
{
    'use strict';

    grunt.initConfig(
    {
        //include
        include: 
        {
            dev: 
            {
                options: 
                {
                    includesDir : 'includes/',
                    prefix : '@',
                    suffix : ';',
                    docroot : '.', //default
                    resroot : '',
                    globals : 
                    {
                        'var1' : 'globals var1 ...',
                        'var2' : 'globals var2 ...'
                    }
                },
                files: 
                [
                    {
                        src: 
                        [
                            '*.html', 
                            'test/**/*.html'
                        ],
                        dest: '../'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-include');
};