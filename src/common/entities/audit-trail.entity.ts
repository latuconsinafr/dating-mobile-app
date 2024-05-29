import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Defines abstract class for audit trail entity of T.
 *
 * @usageNotes
 * The audit trail entity contains attribute:
 * - `createdAt`: The creation time of the entity
 * - `updatedAt`: The last updation time of the entity
 * - `createdById`: The actor id who's created the entity, if any
 * - `updatedById`: The actor id who's updated the entity, if any
 */
export abstract class AuditTrailEntity<T> {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  createdById?: string;

  @Column({ nullable: true })
  updatedById?: string;

  /**
   * The constructor.
   *
   * @param partial The partial object of T
   */
  constructor(partial: Partial<T>) {
    Object.assign(this, partial);
  }
}
