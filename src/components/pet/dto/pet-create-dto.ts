import "reflect-metadata";

import { IsArray, IsDefined, IsEnum, IsNotEmptyObject, IsString, ValidateNested } from "class-validator";
import { PetStatus } from "../pet-entity";
import * as uuid from "uuid";
import { Type } from "class-transformer";

export class PetCreateCategoryDTO {

    public id: string;
    public name: string;
}

export class PetCreateTagDTO {
    public id: string;
    public name: string;
}


export class PetCreateDTO {


    @IsDefined()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => PetCreateCategoryDTO)
    public category: PetCreateCategoryDTO;

    @IsDefined()
    @IsString()
    public name: string;

    @IsDefined()
    @IsArray()
    public photoUrls: string[];

    @IsDefined()
    @IsArray()
    @ValidateNested()
    @Type(() => PetCreateTagDTO)
    public tags: PetCreateTagDTO[];

    @IsDefined()
    @IsEnum(PetStatus)
    public status: PetStatus;
}