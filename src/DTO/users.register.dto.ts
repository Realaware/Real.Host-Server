import { IsString, Length } from 'class-validator';

export class RegisterDTO {
    @IsString()
    @Length(3,10)
    username: string

    @IsString()
    @Length(10,25)
    password: string

    @IsString()
    @Length(10,25)
    confirm: string
}