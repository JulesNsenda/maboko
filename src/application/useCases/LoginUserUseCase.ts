import type { FirebaseAuthService } from '../../infrastructure/firebase/FirebaseAuthService';

export class LoginUserUseCase {
    private authService: FirebaseAuthService;

    constructor(authService: FirebaseAuthService) {
        this.authService = authService;
    }

    async execute(data: { email: string; password: string }): Promise<string> {
        return await this.authService.login(data.email, data.password);
    }
}