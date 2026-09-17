import {IsEmail, isNotEmpty, IsNotEmpty, IsString, MinLength} from 'class-validator'

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @MinLength(6)
    password!: string;
}