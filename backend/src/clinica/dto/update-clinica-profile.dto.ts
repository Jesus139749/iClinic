import { PartialType, PickType } from '@nestjs/swagger';
import { CreateClinicaDto } from './create-clinica.dto';

export class UpdateClinicaProfileDto extends PartialType(
  PickType(CreateClinicaDto, [
    'name',
    'email',
    'phone',
    'street',
    'number',
    'complement',
    'neighborhood',
    'city',
    'state',
    'postalCode',
  ] as const),
) {}
