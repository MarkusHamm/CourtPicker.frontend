module.exports = function(grunt) {
	grunt.initConfig({
	  pkg: grunt.file.readJSON('package.json'),
	  copy: {
		  main: {
			files: [
				{src: 'app/css/**', dest: '../singlepage-cp-prod/'},
				{src: 'app/fonts/**', dest: '../singlepage-cp-prod/'},
				{src: 'app/img/**', dest: '../singlepage-cp-prod/'},
				{src: 'app/includes/**', dest: '../singlepage-cp-prod/'},
				{src: 'app/partials/**', dest: '../singlepage-cp-prod/'},
				{src: 'app/lib/**/*.min.js', dest: '../singlepage-cp-prod/'},
				{src: 'app/cp-prod.html', dest: '../singlepage-cp-prod/app/cp.html'}
			]
		  }
	  },
	  ngAnnotate: {
		  options: {},
		  cp: {
			files: {
				'../tmp/cp-annotated.js' : ['app/js/app.js', 'app/js/services.js', 'app/js/controllers.js', 'app/js/filters.js', 'app/js/directives.js']
			}
		  }
	  },
	  uglify: {
		  my_target: {
			files: {
				'../singlepage-cp-prod/app/js/cp.js': ['../tmp/cp-annotated.js']
			}
		  }
	  }
	});
	
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	
	grunt.registerTask('default', ['copy', 'ngAnnotate', 'uglify']);
};