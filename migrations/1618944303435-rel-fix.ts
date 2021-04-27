import {MigrationInterface, QueryRunner} from "typeorm";

export class relFix1618944303435 implements MigrationInterface {
    name = 'relFix1618944303435'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `words` DROP FOREIGN KEY `FK_e6ef47d6cff6a807b437bdc2b66`");
        await queryRunner.query("ALTER TABLE `words` ADD CONSTRAINT `FK_e6ef47d6cff6a807b437bdc2b66` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `words` DROP FOREIGN KEY `FK_e6ef47d6cff6a807b437bdc2b66`");
        await queryRunner.query("ALTER TABLE `words` ADD CONSTRAINT `FK_e6ef47d6cff6a807b437bdc2b66` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
