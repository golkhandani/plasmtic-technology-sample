import { IsArray, IsDefined, IsEnum } from "class-validator";
import { PetStatus } from "../pet-entity";


export class PetFindByStatusDTO {

    @IsDefined()
    @IsArray()
    @IsEnum(PetStatus, { each: true })
    public status: PetStatus[];
}