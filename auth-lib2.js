let allUsers = [
	{nickname: "admin", password: "1234", groups: ["admin", "manager", "basic"]},
	{nickname: "sobakajozhec", password: "ekh228", groups: ["basic", "manager"]},
	{nickname: "patriot007", password: "russiaFTW", groups: ["basic"]}
];

let allRights = ["manage content", "play games", "delete users", "view site"];

let allGroups = {
	"admin": [allRights[2]],
	"manager": [allRights[0]],
	"basic": [allRights[1], allRights[3]]
};

let session = [];


// Возвращает массив всех пользователей.
function users() {
	return allUsers;
}

//Создает нового пользователя с указанным логином username и паролем password, возвращает созданного пользователя.
function createUser(name, password) {
	let newUser = {
		nickname: name,
		password: password,
		groups: []
	};
	allUsers.push(newUser);
	return newUser;
}

function checkUserExist(user)
{
	if(!user)
	{
		throw Error('it is not user')
	}
	if(allUsers.indexOf(user) === -1)
	{
		throw Error('user does not exist')
	}

	return true
}

function checkGroupExist(group) {
	if(!group)
	{
		throw Error('it is not group')
	}
	if(!allGroups.hasOwnProperty(group))
	{
		throw Error('group does not exist')
	}

	return true
}

function checkRightExist(right) {
	if(!right)
	{
		throw Error('it is not right')
	}
	if(allRights.indexOf(right) === -1)
	{
		throw Error('right does not exist')
	}

	return true
}

// Удаляет пользователя user
function deleteUser(user) {
	if(checkUserExist(user))
	{
		allUsers.splice(allUsers.indexOf(user),1)
	}
}

// Возвращает массив групп, к которым принадлежит пользователь user
function userGroups(user) {
	if(checkUserExist(user))
	{
		return user.groups;
	}
}

// Добавляет пользователя user в группу group
function addUserToGroup(user, group) {
	checkGroupExist(group);
	checkUserExist(user);


	if(user.groups.indexOf(group) !== -1)
		throw Error('User already in this group');

	user.groups.push(group);

}

// Удаляет пользователя user из группы group. Должна бросить исключение, если пользователя user нет в группе group
function removeUserFromGroup(user, group) {
	checkGroupExist(group);
	checkUserExist(user);

	if(user.groups.indexOf(group) === -1)
		throw Error('User not in this group');

	user.groups.splice(user.groups.indexOf(group), 1)
}

// Возвращает массив прав
function rights() {
	return allRights;
}

// Создает новое право с именем name и возвращает его
function createRight(name) {
	allRights.push(name);
	return name;
}

// Удаляет право right
function deleteRight(right) {
	checkRightExist(right)
	allRights.splice(allRights.indexOf(right), 1);

	for(let group in allGroups){
		allGroups[group].splice(allGroups[group].indexOf(right), 1)
	}
	return undefined
}

// Возвращает массив групп
function groups() {
	let arrOfGroups = [];
	for (let group in allGroups)
		arrOfGroups.push(group);

	return arrOfGroups;
}

// Создает новую группу и возвращает её.
function createGroup(name) {
	allGroups[name] = [];
	return name;
}

// Удаляет группу group
function deleteGroup(group) {
	checkGroupExist(group);
	delete allGroups[group];
	allUsers.forEach( user => user.groups.splice( user.groups.indexOf(group), 1))
}

// Возвращает массив прав, которые принадлежат группе group
function groupRights(group) {
	return allGroups[group];
}

// Добавляет право right к группе group
function addRightToGroup(right, group) {
	checkGroupExist(group);
	checkRightExist(right);
	allGroups[group].push(right);
}

// Удаляет право right из группы group. Должна бросить исключение, если права right нет в группе group
function removeRightFromGroup(right, group) {
	checkGroupExist(group);
	checkRightExist(right);

	if(allGroups[group].indexOf(right) === -1)
		throw Error('Right is not exist in this group');

	allGroups[group].splice(allGroups[group].indexOf(right), 1)
}

function login(username, password) {
	let userExist = allUsers.find( 
		function (user) {
			user.nickname === username && user.password === password
		}
	);
	let isInSession = session.find(user => user.nickname === username);
	if(userExist && !isInSession){
		session.push(userExist);
		return true;
	}
	return false;
}

function currentUser() {
	return session[session.length-1]
}

function logout() {
	let user = currentUser();
	session.splice(session.indexOf(currentUser), 1)
}

function isAuthorized(user, right) {
	checkUserExist(user);
	checkRightExist(right);
	if(!user.groups.length) return false;
	let currentGroup = '';

	for(let group in allGroups)
		if(allGroups[group].find(rightInGroup => rightInGroup === right))
		{
			currentGroup = group;
			break;
		}

	let isUserHasRight = !!user.groups.find(group => group === currentGroup);
	return isUserHasRight;
}

isAuthorized(allUsers[1],allRights[1]);

//