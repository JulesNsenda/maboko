import { EmailService } from '../../infrastructure/external/EmailService';
import type { FirebaseAuthService } from '../../infrastructure/firebase/FirebaseAuthService';
import type { Language } from '../../shared/types';

interface RegisterUserData {
  name: string;
  email: string;
  password: string;
}

export class RegisterUserUseCase {
  constructor(
    private authService: FirebaseAuthService,
    private emailService: EmailService
  ) {}

  async execute(data: RegisterUserData, language: Language): Promise<void> {
    if (!data.name || !data.email || !data.password) {
      throw new Error(language === 'fr' ? 'Nom, email et mot de passe requis' : 'Name, email, and password required');
    }
    if (data.password.length < 6) {
      throw new Error(language === 'fr' ? 'Le mot de passe doit avoir au moins 6 caractères' : 'Password must be at least 6 characters');
    }

    await this.authService.register(data.email, data.password);
    await this.emailService.sendWelcomeEmail(data.name, data.email, language);
  }
}