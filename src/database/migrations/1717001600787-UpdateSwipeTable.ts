import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSwipeTable1717001600787 implements MigrationInterface {
  name = 'UpdateSwipeTable1717001600787';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "swipe" DROP CONSTRAINT "FK_68cab0b70b0bb4cd0139225cca4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "swipe" DROP CONSTRAINT "FK_90869b608f995397ce365ca1b90"`,
    );
    await queryRunner.query(
      `ALTER TABLE "swipe" ALTER COLUMN "userId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "swipe" ALTER COLUMN "profileId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "swipe" ADD CONSTRAINT "FK_68cab0b70b0bb4cd0139225cca4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "swipe" ADD CONSTRAINT "FK_90869b608f995397ce365ca1b90" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "swipe" DROP CONSTRAINT "FK_90869b608f995397ce365ca1b90"`,
    );
    await queryRunner.query(
      `ALTER TABLE "swipe" DROP CONSTRAINT "FK_68cab0b70b0bb4cd0139225cca4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "swipe" ALTER COLUMN "profileId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "swipe" ALTER COLUMN "userId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "swipe" ADD CONSTRAINT "FK_90869b608f995397ce365ca1b90" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "swipe" ADD CONSTRAINT "FK_68cab0b70b0bb4cd0139225cca4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
