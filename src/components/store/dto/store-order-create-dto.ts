import "reflect-metadata";

import { IsArray, IsBoolean, IsDate, IsDateString, IsDefined, IsEnum, IsNotEmptyObject, IsNumber, IsString, IsUUID, ValidateNested } from "class-validator";
import { StoreOrderStatus } from "../store-entity";
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


export class StoreOrderCreateDTO {

    @IsDefined()
    @IsUUID()
    public petId: string;

    @IsDefined()
    @IsNumber()
    public quantity: number;

    @IsDefined()
    @IsDateString()
    public shipDate: string;

    @IsDefined()
    @IsEnum(StoreOrderStatus)
    public status: StoreOrderStatus;

    @IsDefined()
    @IsBoolean()
    public complete: boolean;
}