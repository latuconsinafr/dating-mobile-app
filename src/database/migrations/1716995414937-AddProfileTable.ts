import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProfileTable1716995414937 implements MigrationInterface {
  name = 'AddProfileTable1716995414937';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "profile" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdById" character varying, "updatedById" character varying, "id" uuid NOT NULL, "name" character varying NOT NULL, "age" integer NOT NULL, "location" character varying NOT NULL, "aboutMe" text, CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD CONSTRAINT "FK_3dd8bfc97e4a77c70971591bdcb" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profile" DROP CONSTRAINT "FK_3dd8bfc97e4a77c70971591bdcb"`,
    );
    await queryRunner.query(`DROP TABLE "profile"`);
  }
}
