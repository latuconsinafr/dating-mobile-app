import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSwipeTable1716999328511 implements MigrationInterface {
    name = 'AddSwipeTable1716999328511'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "swipe" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdById" character varying, "updatedById" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "userId" uuid, "profileId" uuid, CONSTRAINT "PK_cb1669106ad4579aa39400adb94" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "swipe" ADD CONSTRAINT "FK_68cab0b70b0bb4cd0139225cca4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "swipe" ADD CONSTRAINT "FK_90869b608f995397ce365ca1b90" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "swipe" DROP CONSTRAINT "FK_90869b608f995397ce365ca1b90"`);
        await queryRunner.query(`ALTER TABLE "swipe" DROP CONSTRAINT "FK_68cab0b70b0bb4cd0139225cca4"`);
        await queryRunner.query(`DROP TABLE "swipe"`);
    }

}
