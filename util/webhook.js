/****************************************************************************
 Copyright (c) 2017 Louis Y P Chen.
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
const config = require('../config/config')
const secret = '058d398a6abdc92060109085cee0c6474ff81f211b24d0feb0cf488502fb84f0'
const M = require('../util/m')

const execa = require('execa')

// const logger = require('../util/logger')

let run_it = async (cmd) => {
	console.log(`Prepare to start to run command : ${cmd}`)
	// logger.info(`Prepare to start to run command : ${cmd}`)
	try{
		let result = await execa.shell(cmd)
		// console.log(result)
		return result.stdout
	}catch(err){
		return err.stderr
	}
	return 'DONE'
}

let wh = async function(ctx){
	let result = ''
	if(ctx.req.headers['x-gitlab-token'] === secret){
		let data = ctx.request.body
		let projects = config.projects
		if(data){
			if(!data.project){
				console.log(`Can't find any project`)
				// logger.info(`Can't find any project`)
				result = `Can't find any project`
			}else{
				let project = projects[data.project.namespace]
				if(project){
					project = project[data.project.name]
					if(project){
						if(data.object_kind && data.object_kind === project.event){
							if(project.url != data.project.ssh_url){
								console.log(`Project URL does not match`)
								// logger.info(`Project URL does not match`)
								result = `Project URL does not match`										
							}
							if(!data.checkout_sha){
								console.log(`Delete tag or no changes won't trigger any deployment`)
								// logger.info(`Delete tag or no changes won't trigger any deployment`)
								result = `Delete tag or no changes won't trigger any deployment`
							}
							let trigger = false
							switch(data.object_kind){
								case 'push' :
									trigger = data.ref === 'refs/heads/master'
									break
								case 'tag_push':
									trigger = data.ref === `refs/tags/${data.message}`
									break
								default:
									break
							}
							if(!trigger){
								console.log(`Can not match Ref : ${data.ref} with ${project.event} kind`)
								// logger.info(`Can not match Ref : ${data.ref} with ${project.event} kind`)
								result = `Can not match Ref : ${data.ref} with ${project.event} kind`
							}else{
								let g = M.pipeline(run_it);
								let [path, script] = [project.path, project.script]
								if(script){
									result = g.call(this, `cd ${path} && ${script}`)
								}								
							}

						}
					}
				}				
			}
		}
	}
	return result
}


module.exports = wh