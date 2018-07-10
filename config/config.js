let git = 'git',
	projects = {
		GroupName : {
			ProjectName : {
				event : 'tag_push',
				url : '<project url>',
				path : '/www',
				script : '<shell command>'
			}
		}
	},
	
	logDB = {

	};

module.exports = {
	projects : projects,
	git : git,
	logDB : logDB
};