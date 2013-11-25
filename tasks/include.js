/*
 * grunt-contrib-include
 * {%= homepage %}
 *
 * Copyright (c) {%= grunt.template.today('yyyy') %} {%= author_name %}
 * Licensed under the {%= licenses.join(', ') %} license{%= licenses.length === 1 ? '' : 's' %}.
 */

'use strict';

module.exports = function(grunt) 
{

    var fs = require('fs');
    var path = require('path');
    var template = require('./template.min');
    var log = grunt.log;

    grunt.registerMultiTask('include', '{%= description %}', function() 
    {
        var options = this.options(
        {
            prefix: '@',
            suffix: ';',
            globals: {},
            includesDir: '',
            docroot: '.'
        });
        var globalVars = options.globals
        var globalVarNames = Object.keys(globalVars);
        globalVarNames.forEach(function(globalVarName) 
        {
            if (typeof globalVars[globalVarName] === 'string') 
            {
                globalVars[globalVarName] = globalVars[globalVarName];
            } 
            else 
            {
                globalVars[globalVarName] = JSON.stringify(globalVars[globalVarName]);
            }
        });
        var globalVarRegExps = {};

        var includeRegExp = new RegExp(options.prefix + 'include\\(\\s*["\'](.*?)["\'](,\\s*({[\\s\\S]*?})){0,1}\\s*\\)' + options.suffix);
        var _include = function(contents, pageVars)
        {
            var matches = includeRegExp.exec(contents);

            function createReplaceFn (replacement) 
            {
                return function () 
                {
                    return replacement;
                };
            }

            while(matches)
            {
                var match = matches[0];
                var includePath = matches[1];
                var localVars = matches[3] ? JSON.parse(matches[3]) : {};

                includePath = path.resolve(path.join(options.includesDir, includePath));

                var includeContents = grunt.file.read(includePath);

                includeContents =template.compile(includeContents)(localVars);

                includeContents = _replace(includeContents, pageVars);

                includeContents = _include(includeContents, pageVars);

                contents = contents.replace(match, createReplaceFn(includeContents));

                matches = includeRegExp.exec(contents);
            }

            return contents;
        };

        var _replace = function(contents, localVars)
        {
            var localVarNames = Object.keys(localVars);
            
            //replace local vars
            localVarNames.forEach(function(varName) 
            {
                var regexp = new RegExp(options.prefix + varName + options.suffix, 'g');
                contents = contents.replace(regexp, localVars[varName]);
            });

            //replace global vars
            globalVarNames.forEach(function(varName) 
            {

                globalVarRegExps[varName] = globalVarRegExps[varName] || new RegExp(options.prefix + varName + options.suffix, 'g');

                contents = contents.replace(globalVarRegExps[varName], globalVars[varName]);
            });

            return contents;
        };

        this.files.forEach(function(files)
        {
            files.src.forEach(function(src)
            {
                log.debug('Processing glob ' + src);

                if (!grunt.file.isFile(src)) 
                {
                    return;
                }

                log.debug('Processing ' + src);

                var docroot = path.relative(path.dirname(src), path.resolve(options.docroot));
                docroot = docroot ?  docroot + '/' : ''

                var localVars = {}
                localVars.absroot = docroot;
                localVars.resroot = options.resroot +  docroot;

                var contents = grunt.file.read(src);
                
                contents = _replace(contents, localVars);

                contents = _include(contents, localVars);

                var dest = path.join(files.dest, src);

                grunt.file.write(dest, contents);

                log.ok('Processed ' + src);
            });
        });
    });
};
