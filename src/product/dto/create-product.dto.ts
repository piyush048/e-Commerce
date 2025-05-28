import { PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";


export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    categoryName: string;

    @IsString()
    @IsNotEmpty()
    brand: string;

    @IsString()
    @IsNotEmpty()
    imageUrl: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    variants: VariantDto[];
}

export class VariantDto {
    @IsOptional()
    @IsString()
    size: string;

    @IsString()
    @IsOptional()
    color: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    stock: number;
}

export class UpdateProductDto extends PartialType (CreateProductDto){}

