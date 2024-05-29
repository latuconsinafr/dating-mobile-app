import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { userData } from '../../../database/data/user.data';

/**
 * Defines the DTO that carries data representing audit trail of the data.
 *
 * @usageNotes
 * The TimestampResponse contains timestamp attribute:
 * - `createdAt`: The creation time of the entity
 * - `updatedAt`: The last updation time of the entity
 * - `createdById`: The actor id who's created the entity, if any
 * - `updatedById`: The actor id who's updated the entity, if any
 */
export class AuditTrailResponse {
  @ApiProperty({
    description: 'The creation time of the data',
    example: '2023-02-11T05:24:50.680Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The last updation time of the data',
    example: '2023-02-11T05:24:50.680Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'The creator of the data',
    example: userData[0].id,
  })
  createdById?: string;

  @ApiPropertyOptional({
    description: 'The updater of the data',
    example: userData[0].id,
  })
  updatedById?: string;
}
