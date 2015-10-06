// Grunt minfier task. only thing I'm using this for

module.exports = function(grunt){
	grunt.initConfig({
		uglify:{
			my_target:{
				files: {
					'kennitala-min.js': ['kennitala.js']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['uglify']);
}
