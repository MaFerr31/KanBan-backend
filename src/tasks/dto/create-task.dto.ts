import {IsIn, IsOptional, IsString} from 'class-validator'

export class CreateTaskDto {
    @IsString()
    @IsOptional()
    title!: string;


    @IsOptional()
    @IsString()
    description?: string;

    @IsString()
    @IsOptional()
    @IsIn(['TODO', 'IN_PROGRESS', 'VALIDATION', 'DONE'], {
        message: 'Status deve ser: TODO, IN_PROGRESS, VALIDATION ou DONE',
    })
    status?: string;

    @IsString()
    @IsOptional()
    @IsIn(['LOW', 'MEDIUM', 'HIGH'], {
        message: 'Prioridade deve ser: LOW, MEDIUM ou HIGH',
    })
    priority?: string;
}