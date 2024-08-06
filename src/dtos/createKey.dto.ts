import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateKeyDto {
    @IsOptional()
    @IsString({ always: false })
    note?: string;
}