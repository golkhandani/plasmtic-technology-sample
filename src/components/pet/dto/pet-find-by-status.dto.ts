import { IsArray, IsDefined, IsEnum } from "class-validator";
import { PetStatus } from "../pet.entity";


export class PetFindByStatusDTO {

    @IsDefined()
    @IsEnum(PetStatus)
    public status: PetStatus[] | PetStatus ;
}