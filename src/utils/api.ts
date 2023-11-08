import { error, extractDetailsFromUrl } from './helper';

const BASE_URL = 'https://api.github.com';

export const getUserInfo = async (accessToken: string) => {
	try {
		const response = await fetch(`${BASE_URL}/user`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		const userData = await response.json();
		return userData;
	} catch (err) {
		error('Error fetching user data:', err);
		return null;
	}
};

export async function sendUserToServer(userData: UserInfoType) {
	const response = await fetch(`${process.env.SeverURL}/api/user/addUser`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(userData),
	});

	const data = await response.json();
	console.log(data);
	if (response.ok) {
		console.log('Added Successfully');
	} else {
		error(`couldn't add users`, data.message);
	}
}

export const getUserAssignedIssues = async (accessToken: string) => {
	try {
		const res = await getUserInfo(accessToken);
		let username = res.login;
		const response = await fetch(`${BASE_URL}/search/issues?q=assignee:${username}`, {
			headers: {
				Accept: 'application/vnd.github+json',
			},
		});

		const repo = `${extractDetailsFromUrl('owner')}/${extractDetailsFromUrl('repo')}`;

		const data = await response.json();
		const issues: any[] = [];

		data.items.forEach((item: { url: string | string[]; state: string }) => {
			if (item.url.includes(repo) && item.state === 'open') issues.push(item);
		});

		return issues;
	} catch (error) {
		error('Error fetching issues:', error);
		return null;
	}
};

export const isRepoStarred = async (accessToken: string) => {
	try {
		const response = await fetch(`${BASE_URL}/user/starred/${extractDetailsFromUrl('owner')}/${extractDetailsFromUrl('repo')}`, {
			headers: {
				Accept: 'application/vnd.github+json',
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (response.status === 204) {
			return true;
		} else {
			return false;
		}
	} catch (error) {
		error('Error gettings stars:', error);
		return null;
	}
};
