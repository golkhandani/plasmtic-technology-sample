import "reflect-metadata";

import { IsDefined, IsUUID } from "class-validator";
import { PetCreateDTO } from "./pet-create-dto"

export class PetUpdateDTO extends PetCreateDTO {
    @IsDefined()
    @IsUUID()
    id: string;
}