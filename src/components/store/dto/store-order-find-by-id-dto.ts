import { IsArray, IsDefined, IsEnum, IsUUID } from "class-validator";


export class PetFindByIdDTO {

    @IsDefined()
    @IsUUID()
    public id: string;
}