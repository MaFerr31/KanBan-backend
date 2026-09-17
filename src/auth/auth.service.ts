import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {JwtService} from '@nestjs/jwt'
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

// O decorator @Injectable() indica que esta classe é um "provedor", podendo ser
// utilizada para outro módulos ou controllers automaticamente.
@Injectable()
export class AuthService {
    // Injeção d dependências no construtor.
    // 'private reandoly' cria e inicializa a propriedade na class automaticament.
    constructor(
        private readonly prisma: PrismaService, // Acessar o banco d dados via prisma Service
        private readonly jwtService: JwtService, // Acessar o utilizario do NestJs para assinatura de Tokens JWT
    ) {}

    /**
     * Fluxo para o cadastro de um usuário.
     */
    async register(dto: RegisterDto) {
        // 1. Verifica se já existe um usuário cadastrado com o e-mail informado anteriormente.
        const userExists = await this.prisma.user.findUnique({
            where: { email: dto.email }
        });

        if (userExists) {
            throw new ConflictException('E-mail já cadastrado.');
        }
        
        // 2. Criptografar a senha antes do salvamento no banco de dados.
        // O número 10 é o "salt rounds" (custo computacional para gerar o hash).
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // Criação e salvamento de um novo usuário na tabela 'user' do db.
        const user = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                password: hashedPassword,
            },
        });

        // 4. Rtorna o token de acesso para o usuário já navegar autenticado.
        return this.generateToken(user.id, user.email)
    }


    /**
     * Fluxo de Login / Authentication
     */
    async login(dto: LoginDto) {
        // 1. Busca de um usuário pelo e-mail.
        const user =  await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) {
            throw new UnauthorizedException('Acesso não autorizado. Credenciais inválidas.')
        }

        // 2. Compara a senha informada no login com o hash salvo no banco
        const isPasswordValid =  await bcrypt.compare(dto.password, user.password);

        if (!isPasswordValid){
            throw new UnauthorizedException('Acesso não autorizado. Credenciais inválidas.')
        }

        // 3. Retorno do Token após passar pelos validadores.
        return this.generateToken(user.id, user.email);
    }

    /**
     *  Geração de token JWT: auxiliar
     */
    private generateToken(userId: string, email: string) {
        // Definição do caminho que serão guardados dentro do tokn codificado.
        // 'sub' (subject) é uma convenção do JWT usada para guardar o ID único do usuário.
        const payload = { sub: userId, email}

        return {
            // O jwtService assina digitalmente o payload usando a chave secreta do seu .env
            access_token: this.jwtService.sign(payload),
        }
    }
}
