export interface AuthenticatedRequest {
	user: {
		id: string;
		name: string;
		email: string;
		type: 'DOCTOR' | 'PATIENT';
		userId?: string;
		iat?: number;
		exp?: number;
	};
}
