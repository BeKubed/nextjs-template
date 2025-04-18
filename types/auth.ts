interface Roles {
	[key: string]: string
}
export interface UserSession {
	user: AuthUser & Omit<TokenUser, 'roles'>
}
export interface TokenUser {
	id: string
	name: string
	email: string
	image: string
	roles: Roles
}
export interface AuthUser {
	id: string,
	name: string,
	orgs: AuthOrg[],
}

export interface AuthOrg {
	id: string,
	identifier: number,
	org: string,
}

