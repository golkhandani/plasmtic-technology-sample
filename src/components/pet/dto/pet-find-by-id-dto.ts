import { IsArray, IsDefined, IsEnum, IsUUID } from "class-validator";
import { PetStatus } from "../pet-entity";


export class PetFindByIdDTO {

    @IsDefined()
    @IsUUID()
    public id: string;
}